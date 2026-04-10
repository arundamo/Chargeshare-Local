import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Plus, Check, X, Clock, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/ui/Alert'
import { CardSkeleton } from '../../components/ui/Spinner'

const DEMO_REQUESTS = [
  { id: 1, driver_name: 'Alex T.', message: "Hi, I'd like to charge my Tesla tonight at 7pm for 2 hours.", status: 'pending', created_at: '2025-04-10T18:00:00Z', charger_title: 'Driveway Level 2' },
  { id: 2, driver_name: 'Maria L.', message: "Hoping to use the charger tomorrow morning.", status: 'approved', created_at: '2025-04-09T10:00:00Z', charger_title: 'Driveway Level 2' },
]

const DEMO_CHARGERS = [
  { id: 'demo-1', title: 'Driveway Level 2 – Tesla friendly', status: 'active', address_approx: 'Shoreditch, London E1', level: 'Level 2', connector_type: 'Tesla NACS', session_price: 5 },
]

export default function HostDashboardPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [chargers, setChargers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
          import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

        if (!supabaseAvailable || !user) {
          await new Promise(r => setTimeout(r, 300))
          setRequests(DEMO_REQUESTS)
          setChargers(DEMO_CHARGERS)
          setLoading(false)
          return
        }

        const { data: hostData } = await supabase.from('hosts').select('id').eq('user_id', user.id).single()
        if (!hostData) { setChargers([]); setRequests([]); setLoading(false); return }

        const [chargersRes, requestsRes] = await Promise.all([
          supabase.from('chargers').select('*').eq('host_id', hostData.id).order('created_at', { ascending: false }),
          supabase.from('booking_requests')
            .select('*, chargers(title), users(full_name)')
            .in('charger_id', [])
            .order('created_at', { ascending: false }),
        ])

        setChargers(chargersRes.data || [])
        setRequests(requestsRes.data || [])
      } catch {
        setError('Failed to load dashboard.')
        setChargers(DEMO_CHARGERS)
        setRequests(DEMO_REQUESTS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  async function handleAction(requestId, status) {
    setActionLoading(requestId)
    try {
      const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

      if (supabaseAvailable) {
        await supabase.from('booking_requests').update({ status }).eq('id', requestId)
      }
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r))
    } catch {
      setError('Failed to update request.')
    } finally {
      setActionLoading(null)
    }
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="h-6 w-6 text-emerald-600" />
              Host Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your chargers and bookings</p>
          </div>
          <Link to="/host/onboarding">
            <Button size="sm"><Plus className="h-4 w-4" />Add Charger</Button>
          </Link>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Chargers', value: chargers.length, icon: <Zap className="h-5 w-5 text-emerald-500" /> },
            { label: 'Pending requests', value: pendingCount, icon: <Clock className="h-5 w-5 text-amber-500" /> },
            { label: 'Total bookings', value: requests.filter(r => r.status === 'approved').length, icon: <Check className="h-5 w-5 text-blue-500" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
              {icon}
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charger listings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Your Chargers</h2>
          {loading ? (
            <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
          ) : chargers.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Zap className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-gray-400 text-sm">No chargers yet</p>
              <Link to="/host/onboarding"><Button size="sm"><Plus className="h-4 w-4" />Add your first charger</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {chargers.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{c.title}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="h-3 w-3" />{c.address_approx}
                      </div>
                      <div className="flex gap-1.5 mt-1">
                        <Badge variant={c.status === 'active' ? 'success' : c.status === 'pending' ? 'warning' : 'default'}>
                          {c.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Link to={`/charger/${c.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking requests */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Booking Requests
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{pendingCount}</span>
            )}
          </h2>
          {loading ? (
            <div className="space-y-3"><CardSkeleton /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No booking requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {req.driver_name || req.users?.full_name || 'Driver'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {req.charger_title || req.chargers?.title} · {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      req.status === 'approved' ? 'success' :
                      req.status === 'rejected' ? 'danger' :
                      req.status === 'pending' ? 'warning' : 'default'
                    }>
                      {req.status}
                    </Badge>
                  </div>
                  {req.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
                      &ldquo;{req.message}&rdquo;
                    </p>
                  )}
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(req.id, 'approved')}
                        disabled={actionLoading === req.id}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(req.id, 'rejected')}
                        disabled={actionLoading === req.id}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
