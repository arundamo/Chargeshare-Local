import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, CheckCircle, XCircle, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/ui/Alert'
import { CardSkeleton } from '../../components/ui/Spinner'

const DEMO_BOOKINGS = [
  {
    id: 1,
    charger_title: 'Driveway Level 2 – Tesla friendly',
    charger_address_approx: 'Shoreditch, London E1',
    exact_address: null,
    status: 'pending',
    message: 'Hi, I\'d like to charge tonight at 7pm.',
    created_at: '2025-04-10T18:00:00Z',
  },
  {
    id: 2,
    charger_title: 'Garage CCS Fast Charger',
    charger_address_approx: 'Hackney, London E8',
    exact_address: '45 Mare Street, London E8 4RT',
    status: 'approved',
    message: 'Hoping for tomorrow morning.',
    created_at: '2025-04-09T10:00:00Z',
  },
  {
    id: 3,
    charger_title: 'Home L1 – overnight welcome',
    charger_address_approx: 'Bethnal Green, London E2',
    exact_address: null,
    status: 'rejected',
    message: 'Can I book for this weekend?',
    created_at: '2025-04-08T14:00:00Z',
  },
]

export default function DriverDashboardPage() {
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
          import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

        if (!supabaseAvailable || !user) {
          await new Promise(r => setTimeout(r, 300))
          setBookings(DEMO_BOOKINGS)
          setLoading(false)
          return
        }

        const { data, error: dbError } = await supabase
          .from('booking_requests')
          .select(`
            id, status, message, created_at,
            chargers ( title, address_approx, exact_address_private )
          `)
          .eq('driver_id', user.id)
          .order('created_at', { ascending: false })

        if (dbError) throw dbError

        setBookings(
          (data || []).map(b => ({
            id: b.id,
            charger_title: b.chargers?.title,
            charger_address_approx: b.chargers?.address_approx,
            exact_address: b.status === 'approved' ? b.chargers?.exact_address_private : null,
            status: b.status,
            message: b.message,
            created_at: b.created_at,
          }))
        )
      } catch {
        setError('Failed to load bookings.')
        setBookings(DEMO_BOOKINGS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const statusMeta = {
    pending: { variant: 'warning', icon: <Clock className="h-4 w-4 text-amber-500" />, label: 'Pending host response' },
    approved: { variant: 'success', icon: <CheckCircle className="h-4 w-4 text-emerald-500" />, label: 'Booking approved' },
    rejected: { variant: 'danger', icon: <XCircle className="h-4 w-4 text-red-400" />, label: 'Booking declined' },
    cancelled: { variant: 'default', icon: <XCircle className="h-4 w-4 text-gray-400" />, label: 'Cancelled' },
    completed: { variant: 'info', icon: <CheckCircle className="h-4 w-4 text-blue-400" />, label: 'Completed' },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your charging activity</p>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Quick actions */}
        <div className="flex gap-3">
          <Link to="/browse" className="flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center hover:border-emerald-400 transition-colors cursor-pointer">
              <MapPin className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Find Chargers</p>
            </div>
          </Link>
          <Link to="/host/onboarding" className="flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center hover:border-emerald-400 transition-colors cursor-pointer">
              <Zap className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Become a Host</p>
            </div>
          </Link>
        </div>

        {/* Bookings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">My Booking Requests</h2>

          {loading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <Clock className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-gray-400 text-sm">No booking requests yet</p>
              <Link to="/browse">
                <span className="text-emerald-600 text-sm hover:underline">Browse chargers →</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const meta = statusMeta[booking.status] || statusMeta.pending
                return (
                  <div key={booking.id} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.charger_title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {booking.charger_address_approx}
                        </div>
                      </div>
                      <Badge variant={meta.variant}>
                        {meta.icon}
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      {meta.icon}
                      {meta.label}
                    </div>

                    {booking.status === 'approved' && booking.exact_address && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                        📍 {booking.exact_address}
                      </div>
                    )}

                    <p className="text-xs text-gray-400">
                      Requested {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
