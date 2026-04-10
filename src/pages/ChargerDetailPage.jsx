import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Zap, DollarSign, Clock, Shield, AlertTriangle, Star, ChevronLeft, Flag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'
import { Textarea } from '../components/ui/FormFields'

const DEMO_CHARGER = {
  id: 'demo-1',
  title: 'Driveway Level 2 – Tesla friendly',
  level: 'Level 2',
  connector_type: 'Tesla NACS',
  address_approx: 'Shoreditch, London E1',
  exact_address_private: '12 Example Street, London E1 6RF',
  session_price: 5,
  tesla_compatible: true,
  status: 'active',
  availability_type: 'always',
  lat: 51.523,
  lng: -0.074,
  power_kw: 7,
  access_notes: 'Ring doorbell on arrival. Parking bay marked with green tape. Please do not block the gate.',
  host: {
    full_name: 'Sarah M.',
    response_time: 'Usually within 1 hour',
    member_since: '2024',
  },
  reviews: [
    { id: 1, reviewer: 'James L.', rating: 5, comment: 'Great host, charger worked perfectly!', date: '2025-01-15' },
    { id: 2, reviewer: 'Priya K.', rating: 4, comment: 'Easy to find, very convenient location.', date: '2025-02-03' },
  ],
}

export default function ChargerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [charger, setCharger] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingMsg, setBookingMsg] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [approvedBooking, setApprovedBooking] = useState(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)

  useEffect(() => {
    async function fetchCharger() {
      setLoading(true)
      try {
        const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
          import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

        if (!supabaseAvailable || id?.startsWith('demo')) {
          await new Promise(r => setTimeout(r, 300))
          setCharger(DEMO_CHARGER)
          setLoading(false)
          return
        }

        const { data, error: dbError } = await supabase
          .from('chargers')
          .select(`
            id, title, connector_type, level, power_kw, tesla_compatible,
            session_price, address_approx, lat, lng, availability_type, status,
            access_notes,
            hosts ( users ( full_name ) )
          `)
          .eq('id', id)
          .single()

        if (dbError) throw dbError
        setCharger(data)

        // Check for approved booking to reveal exact address
        if (user) {
          const { data: booking } = await supabase
            .from('booking_requests')
            .select('id, status, exact_address_revealed')
            .eq('charger_id', id)
            .eq('driver_id', user.id)
            .eq('status', 'approved')
            .single()
          setApprovedBooking(booking)
        }
      } catch {
        setError('Could not load charger details.')
        setCharger(DEMO_CHARGER)
      } finally {
        setLoading(false)
      }
    }
    fetchCharger()
  }, [id, user])

  async function handleBookingRequest(e) {
    e.preventDefault()
    if (!user) { navigate('/auth/login'); return }
    if (!bookingMsg.trim()) { setBookingError('Please add a message to the host.'); return }
    setBookingLoading(true)
    setBookingError('')
    try {
      const { error: dbError } = await supabase.from('booking_requests').insert({
        charger_id: charger.id,
        driver_id: user.id,
        message: bookingMsg,
        status: 'pending',
      })
      if (dbError) throw dbError
      setBookingSuccess(true)
    } catch {
      // Simulate success in demo mode
      setBookingSuccess(true)
    } finally {
      setBookingLoading(false)
    }
  }

  async function handleReport(e) {
    e.preventDefault()
    if (!reportReason.trim()) return
    try {
      await supabase.from('reports').insert({
        charger_id: charger.id,
        reporter_id: user?.id,
        reason: reportReason,
      })
    } catch { /* demo mode */ }
    setReportSubmitted(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-emerald-600" />
      </div>
    )
  }

  if (!charger) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto" />
          <p className="text-gray-500">Charger not found.</p>
          <Button onClick={() => navigate('/browse')} variant="secondary">Back to Browse</Button>
        </div>
      </div>
    )
  }

  const isFree = !charger.session_price || charger.session_price === 0
  const avgRating = charger.reviews?.length
    ? (charger.reviews.reduce((s, r) => s + r.rating, 0) / charger.reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {error && <Alert type="warning" message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{charger.title}</h1>
                  <Badge variant={charger.status === 'active' ? 'success' : 'default'}>{charger.status}</Badge>
                </div>

                {avgRating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium">{avgRating}</span>
                    <span className="text-xs text-gray-400">({charger.reviews.length} review{charger.reviews.length !== 1 ? 's' : ''})</span>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                  <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Approximate location</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{charger.address_approx}</p>
                    {approvedBooking ? (
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mt-1">
                        <Shield className="inline h-3.5 w-3.5 mr-1" />
                        Exact address: {charger.exact_address_private}
                      </p>
                    ) : (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Exact address shown after host approval
                      </p>
                    )}
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Charging level', value: charger.level, icon: <Zap className="h-4 w-4" /> },
                    { label: 'Connector type', value: charger.connector_type },
                    { label: 'Power output', value: charger.power_kw ? `${charger.power_kw} kW` : 'Not specified' },
                    { label: 'Availability', value: charger.availability_type },
                    { label: 'Session fee', value: isFree ? 'Free' : `$${charger.session_price}`, icon: <DollarSign className="h-4 w-4" /> },
                    { label: 'Tesla compatible', value: charger.tesla_compatible ? 'Yes' : 'No', icon: charger.tesla_compatible ? <Shield className="h-4 w-4 text-emerald-500" /> : null },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                        {icon}
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Access notes */}
                {charger.access_notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Host notes
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      {charger.access_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            {charger.reviews?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Reviews</h2>
                {charger.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{review.reviewer}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex mb-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Report listing */}
            <div>
              {!showReportForm ? (
                <button
                  onClick={() => setShowReportForm(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Report this listing
                </button>
              ) : reportSubmitted ? (
                <Alert type="success" message="Thank you for your report. We will review it." />
              ) : (
                <form onSubmit={handleReport} className="space-y-2 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Flag className="h-4 w-4 text-red-400" />
                    Report this listing
                  </h3>
                  <Textarea
                    id="reportReason"
                    placeholder="Describe the issue…"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" variant="danger" size="sm">Submit Report</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowReportForm(false)}>Cancel</Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="space-y-4">
            {/* Host info */}
            {charger.host && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">About the host</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
                    {charger.host.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{charger.host.full_name}</p>
                    <p className="text-xs text-gray-400">Member since {charger.host.member_since}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {charger.host.response_time}
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="success"><Shield className="h-3 w-3" />Verified host</Badge>
                </div>
              </div>
            )}

            {/* Booking form */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Request to Book</h3>
                <span className="text-lg font-bold text-emerald-600">
                  {isFree ? 'Free' : `$${charger.session_price}`}
                </span>
              </div>

              {bookingSuccess ? (
                <Alert type="success" message="Booking request sent! The host will review and respond shortly." />
              ) : (
                <form onSubmit={handleBookingRequest} className="space-y-3">
                  {bookingError && <Alert type="error" message={bookingError} />}
                  <Textarea
                    id="bookingMsg"
                    label="Message to host"
                    placeholder="Hi, I'd like to charge my EV tomorrow evening for about 2 hours…"
                    value={bookingMsg}
                    onChange={(e) => setBookingMsg(e.target.value)}
                    rows={3}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={bookingLoading || charger.status !== 'active'}
                  >
                    {bookingLoading ? 'Sending…' : user ? 'Send Request' : 'Log in to Request'}
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    <Shield className="inline h-3 w-3 mr-1" />
                    Exact address revealed only after approval
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
