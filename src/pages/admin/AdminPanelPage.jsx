import { useState, useEffect } from 'react'
import { Shield, Flag, Zap, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/ui/Alert'
import { CardSkeleton } from '../../components/ui/Spinner'

const DEMO_REPORTS = [
  { id: 1, charger_title: 'Fake Free Charger', reason: 'The charger does not exist at this address.', reporter: 'user@example.com', status: 'open', created_at: '2025-04-09T12:00:00Z' },
  { id: 2, charger_title: 'Fast DC Charger', reason: 'Host is unresponsive to booking requests.', reporter: 'driver@example.com', status: 'open', created_at: '2025-04-08T09:00:00Z' },
]

const DEMO_PENDING_CHARGERS = [
  { id: 'pending-1', title: 'New CCS Charger', address_approx: 'Camden, London NW1', host_name: 'Bob S.', created_at: '2025-04-10T14:00:00Z', status: 'pending' },
]

export default function AdminPanelPage() {
  const { profile } = useAuth()
  const [reports, setReports] = useState([])
  const [pendingChargers, setPendingChargers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('reports')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
          import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

        if (!supabaseAvailable) {
          await new Promise(r => setTimeout(r, 300))
          setReports(DEMO_REPORTS)
          setPendingChargers(DEMO_PENDING_CHARGERS)
          setLoading(false)
          return
        }

        const [reportsRes, chargersRes] = await Promise.all([
          supabase.from('reports').select('*, chargers(title), users(email)').order('created_at', { ascending: false }),
          supabase.from('chargers').select('*, hosts(users(full_name))').eq('status', 'pending').order('created_at', { ascending: false }),
        ])

        setReports(reportsRes.data || [])
        setPendingChargers(chargersRes.data || [])
      } catch {
        setError('Failed to load admin data.')
        setReports(DEMO_REPORTS)
        setPendingChargers(DEMO_PENDING_CHARGERS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleReportAction(reportId, action) {
    try {
      const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

      if (supabaseAvailable) {
        await supabase.from('reports').update({ status: action }).eq('id', reportId)
        await supabase.from('audit_logs').insert({
          actor_id: profile?.id,
          action: `report_${action}`,
          target_type: 'report',
          target_id: reportId,
        })
      }
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r))
    } catch {
      setError('Action failed.')
    }
  }

  async function handleChargerAction(chargerId, status) {
    try {
      const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

      if (supabaseAvailable) {
        await supabase.from('chargers').update({ status }).eq('id', chargerId)
        await supabase.from('audit_logs').insert({
          actor_id: profile?.id,
          action: `charger_${status}`,
          target_type: 'charger',
          target_id: chargerId,
        })
      }
      setPendingChargers(prev => prev.filter(c => c.id !== chargerId))
    } catch {
      setError('Action failed.')
    }
  }

  const openReports = reports.filter(r => r.status === 'open')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Moderation &amp; oversight</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Open reports', value: openReports.length, icon: <Flag className="h-5 w-5 text-red-400" /> },
            { label: 'Pending chargers', value: pendingChargers.length, icon: <Zap className="h-5 w-5 text-amber-400" /> },
            { label: 'Total reports', value: reports.length, icon: <Users className="h-5 w-5 text-blue-400" /> },
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

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-1 w-fit">
          {[
            { key: 'reports', label: `Reports (${openReports.length})`, icon: <Flag className="h-4 w-4" /> },
            { key: 'chargers', label: `Pending (${pendingChargers.length})`, icon: <Zap className="h-4 w-4" /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                tab === key
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Reports tab */}
        {tab === 'reports' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Listing Reports</h2>
            {loading ? (
              <CardSkeleton />
            ) : reports.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No reports</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.charger_title || report.chargers?.title || 'Unknown charger'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Reported by {report.reporter || report.users?.email || 'anonymous'} · {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={report.status === 'open' ? 'danger' : 'default'}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-2">
                      {report.reason}
                    </p>
                    {report.status === 'open' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleReportAction(report.id, 'resolved')}>
                          <CheckCircle className="h-4 w-4" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReportAction(report.id, 'actioned')}>
                          <AlertTriangle className="h-4 w-4" />
                          Take Action
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleReportAction(report.id, 'dismissed')}>
                          <XCircle className="h-4 w-4" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending chargers tab */}
        {tab === 'chargers' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Pending Charger Approvals</h2>
            {loading ? (
              <CardSkeleton />
            ) : pendingChargers.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">All chargers reviewed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingChargers.map((charger) => (
                  <div key={charger.id} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{charger.title}</p>
                        <p className="text-xs text-gray-400">
                          {charger.address_approx} · By {charger.host_name || charger.hosts?.users?.full_name || 'host'} · {new Date(charger.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="warning">pending</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleChargerAction(charger.id, 'active')}>
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleChargerAction(charger.id, 'suspended')}>
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
