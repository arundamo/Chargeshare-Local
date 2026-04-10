-- ============================================================
-- ChargeShare Local – Supabase Schema
-- Run in Supabase SQL Editor (Database > SQL Editor > New query)
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- USERS (extends Supabase auth.users)
-- -------------------------------------------------------
CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  role          TEXT NOT NULL DEFAULT 'driver' CHECK (role IN ('driver', 'host', 'admin')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create user profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------
-- HOSTS
-- -------------------------------------------------------
CREATE TABLE public.hosts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  phone          TEXT,
  house_rules    TEXT,
  response_time  TEXT DEFAULT 'Usually within a few hours',
  verified       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- CHARGERS
-- -------------------------------------------------------
CREATE TABLE public.chargers (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id                 UUID NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
  title                   TEXT NOT NULL,
  description             TEXT,
  connector_type          TEXT NOT NULL,
  level                   TEXT NOT NULL CHECK (level IN ('Level 1', 'Level 2', 'DC Fast')),
  power_kw                NUMERIC(6, 2),
  tesla_compatible        BOOLEAN NOT NULL DEFAULT FALSE,
  session_price           NUMERIC(8, 2) NOT NULL DEFAULT 0,
  -- Public approximate location (neighbourhood level)
  address_approx          TEXT NOT NULL,
  lat                     DOUBLE PRECISION NOT NULL,
  lng                     DOUBLE PRECISION NOT NULL,
  -- Private exact address (never exposed in public API)
  exact_address_private   TEXT NOT NULL,
  access_notes            TEXT,
  availability_type       TEXT NOT NULL DEFAULT 'always' CHECK (availability_type IN ('always', 'scheduled', 'on_request')),
  status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- BOOKING REQUESTS
-- -------------------------------------------------------
CREATE TABLE public.booking_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charger_id      UUID NOT NULL REFERENCES public.chargers(id) ON DELETE CASCADE,
  driver_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (charger_id, driver_id, created_at)
);

-- -------------------------------------------------------
-- REVIEWS
-- -------------------------------------------------------
CREATE TABLE public.reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id   UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
  reviewer_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  charger_id   UUID NOT NULL REFERENCES public.chargers(id) ON DELETE CASCADE,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- REPORTS
-- -------------------------------------------------------
CREATE TABLE public.reports (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charger_id   UUID REFERENCES public.chargers(id) ON DELETE SET NULL,
  reporter_id  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reason       TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'actioned', 'dismissed')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- AUDIT LOGS
-- -------------------------------------------------------
CREATE TABLE public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action       TEXT NOT NULL,
  target_type  TEXT,
  target_id    UUID,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- ROW LEVEL SECURITY
-- -------------------------------------------------------

-- Users: can read public profile, write own
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Hosts: public read, auth write
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view hosts" ON public.hosts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create host" ON public.hosts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Hosts can update own record" ON public.hosts FOR UPDATE USING (auth.uid() = user_id);

-- Chargers: public read (but WITHOUT exact_address_private), authenticated write
ALTER TABLE public.chargers ENABLE ROW LEVEL SECURITY;

-- Public can see active chargers (exact_address_private excluded at app layer)
CREATE POLICY "Anyone can view active chargers" ON public.chargers FOR SELECT USING (status = 'active');

-- Hosts can see their own chargers including pending
CREATE POLICY "Hosts can view own chargers" ON public.chargers FOR SELECT
  USING (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));

-- Hosts can create chargers
CREATE POLICY "Hosts can create chargers" ON public.chargers FOR INSERT
  WITH CHECK (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));

-- Hosts can update own chargers
CREATE POLICY "Hosts can update own chargers" ON public.chargers FOR UPDATE
  USING (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));

-- Booking requests
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Drivers can view their own requests
CREATE POLICY "Drivers view own requests" ON public.booking_requests FOR SELECT USING (driver_id = auth.uid());

-- Hosts can view requests for their chargers
CREATE POLICY "Hosts view requests for their chargers" ON public.booking_requests FOR SELECT
  USING (charger_id IN (
    SELECT c.id FROM public.chargers c
    JOIN public.hosts h ON h.id = c.host_id
    WHERE h.user_id = auth.uid()
  ));

-- Drivers can create requests
CREATE POLICY "Drivers can create requests" ON public.booking_requests FOR INSERT WITH CHECK (driver_id = auth.uid());

-- Hosts can update status of requests for their chargers
CREATE POLICY "Hosts can update request status" ON public.booking_requests FOR UPDATE
  USING (charger_id IN (
    SELECT c.id FROM public.chargers c
    JOIN public.hosts h ON h.id = c.host_id
    WHERE h.user_id = auth.uid()
  ));

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Auth users can write reviews" ON public.reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can view all reports" ON public.reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Audit logs: admin only
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Auth users can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- -------------------------------------------------------
-- INDEXES
-- -------------------------------------------------------
CREATE INDEX idx_chargers_status ON public.chargers(status);
CREATE INDEX idx_chargers_lat_lng ON public.chargers(lat, lng);
CREATE INDEX idx_chargers_connector ON public.chargers(connector_type);
CREATE INDEX idx_chargers_level ON public.chargers(level);
CREATE INDEX idx_booking_driver ON public.booking_requests(driver_id);
CREATE INDEX idx_booking_charger ON public.booking_requests(charger_id);
CREATE INDEX idx_booking_status ON public.booking_requests(status);
