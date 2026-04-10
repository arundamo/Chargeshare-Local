# ChargeShare Local

A hyperlocal EV charger sharing marketplace where private charger owners can list their chargers for EV drivers nearby.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Map | Leaflet + React-Leaflet (OpenStreetMap) |
| Auth & DB | Supabase |
| Hosting | Render Static Sites |

## Features

- 🔐 **Auth** – Sign up / log in via Supabase Auth
- 🗺️ **Browse** – Map + list view with filters (connector type, level, Tesla compatible, free/paid)
- 🔒 **Privacy** – Exact home addresses hidden until host approves booking
- 📋 **Request-to-book** – Drivers send requests, hosts approve/reject
- 🚗 **Driver Dashboard** – Track booking requests and approved addresses
- ⚡ **Host Dashboard** – Manage listings and incoming requests
- 🛡️ **Admin Panel** – Moderate reports and approve pending chargers
- 🌙 **Dark mode** – Full dark mode support
- 📱 **Mobile-first** – Responsive design

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/arundamo/Chargeshare-Local.git
cd Chargeshare-Local
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase project: **Settings → API → Project URL & anon key**

### 3. Set up Supabase database

In the Supabase Dashboard, go to **SQL Editor** and run:

1. `supabase/schema.sql` – Creates all tables, RLS policies, and triggers
2. `supabase/seed.sql` – Optional: adds sample data (edit UUIDs first)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **No Supabase?** The app works in demo mode with hardcoded sample data if `VITE_SUPABASE_URL` is not set.

### 5. Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

## Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Static Site**
3. Connect your GitHub repo
4. Configure:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
5. Add environment variables in Render dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Create Static Site**

For SPA routing (React Router), add a `_redirects` file to the `public/` folder:

```
/* /index.html 200
```

## Project Structure

```
src/
├── components/
│   ├── charger/         # ChargerCard, ChargerMap, FilterBar
│   ├── layout/          # Navbar, Footer, ProtectedRoute
│   └── ui/              # Button, Badge, Alert, FormFields, Spinner
├── context/
│   └── AuthContext.jsx  # Supabase auth state
├── lib/
│   ├── supabase.js      # Supabase client
│   └── constants.js     # Connector types, charging levels, etc.
└── pages/
    ├── HomePage.jsx
    ├── BrowsePage.jsx
    ├── ChargerDetailPage.jsx
    ├── auth/            # SignUpPage, LoginPage
    ├── host/            # HostOnboardingPage, HostDashboardPage
    ├── driver/          # DriverDashboardPage
    ├── admin/           # AdminPanelPage
    └── static/          # TermsPage, PrivacyPage, SafetyPage

supabase/
├── schema.sql           # Full DB schema with RLS policies
└── seed.sql             # Example seed data
```

## Data Models

| Table | Key Fields |
|-------|-----------|
| `users` | id, full_name, email, role (driver/host/admin) |
| `hosts` | user_id, house_rules, response_time, verified |
| `chargers` | title, connector_type, level, power_kw, tesla_compatible, session_price, address_approx, lat, lng, **exact_address_private**, availability_type, status |
| `booking_requests` | charger_id, driver_id, message, status |
| `reviews` | booking_id, reviewer_id, charger_id, rating, comment |
| `reports` | charger_id, reporter_id, reason, status |
| `audit_logs` | actor_id, action, target_type, target_id |

## Privacy Architecture

- `exact_address_private` is stored in the database but **never returned by public API queries**
- The public browse/map view uses `address_approx` (neighbourhood level) and rounded coordinates
- The exact address is only shown to a driver in their dashboard **after** the host has approved their booking request
- Row Level Security (RLS) on Supabase enforces these rules at the database level

## User Roles

| Role | Capabilities |
|------|-------------|
| Driver | Browse, view details, request booking, view dashboard |
| Host | All driver capabilities + list chargers, manage requests |
| Admin | All capabilities + approve chargers, moderate reports |

## Development Notes

- The app degrades gracefully when Supabase is not configured (demo mode with static data)
- Leaflet maps use OpenStreetMap tiles (no API key required)
- Dark mode state persists to `localStorage` and respects system preference on first visit

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```
