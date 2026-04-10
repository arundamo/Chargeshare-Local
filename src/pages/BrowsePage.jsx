import { useState, useEffect, useCallback } from 'react'
import { LayoutList, Map as MapIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ChargerCard } from '../components/charger/ChargerCard'
import { ChargerMap } from '../components/charger/ChargerMap'
import { FilterBar } from '../components/charger/FilterBar'
import { CardSkeleton } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'

const DEMO_CHARGERS = [
  {
    id: 'demo-1', title: 'Driveway Level 2 – Tesla friendly', level: 'Level 2',
    connector_type: 'Tesla NACS', address_approx: 'Shoreditch, London E1', session_price: 5,
    tesla_compatible: true, status: 'active', availability_type: 'always',
    lat: 51.523, lng: -0.074, power_kw: 7,
  },
  {
    id: 'demo-2', title: 'Garage CCS Fast Charger', level: 'DC Fast',
    connector_type: 'CCS2', address_approx: 'Hackney, London E8', session_price: 0,
    tesla_compatible: false, status: 'active', availability_type: 'on_request',
    lat: 51.535, lng: -0.057, power_kw: 50,
  },
  {
    id: 'demo-3', title: 'Home L1 – overnight welcome', level: 'Level 1',
    connector_type: 'NEMA 5-15', address_approx: 'Bethnal Green, London E2', session_price: 2,
    tesla_compatible: false, status: 'active', availability_type: 'scheduled',
    lat: 51.528, lng: -0.055, power_kw: 1.4,
  },
  {
    id: 'demo-4', title: 'Type 2 Home Charger', level: 'Level 2',
    connector_type: 'Type 2 (Mennekes)', address_approx: 'Islington, London N1', session_price: 3,
    tesla_compatible: false, status: 'active', availability_type: 'always',
    lat: 51.538, lng: -0.103, power_kw: 11,
  },
]

export default function BrowsePage() {
  const [chargers, setChargers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState('split') // 'list' | 'map' | 'split'
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    connectorType: '', level: '', teslaCompatible: false, free: false, available: false,
  })

  const loadChargers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

      if (!supabaseAvailable) {
        // Use demo data when Supabase is not configured
        await new Promise(r => setTimeout(r, 300))
        let filtered = [...DEMO_CHARGERS]
        if (filters.connectorType) filtered = filtered.filter(c => c.connector_type === filters.connectorType)
        if (filters.level) filtered = filtered.filter(c => c.level === filters.level)
        if (filters.teslaCompatible) filtered = filtered.filter(c => c.tesla_compatible)
        if (filters.free) filtered = filtered.filter(c => !c.session_price || c.session_price === 0)
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          filtered = filtered.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.address_approx.toLowerCase().includes(q)
          )
        }
        setChargers(filtered)
        return
      }

      let query = supabase
        .from('chargers')
        .select('id, title, connector_type, level, power_kw, tesla_compatible, session_price, address_approx, lat, lng, availability_type, status')
        .eq('status', 'active')

      if (filters.connectorType) query = query.eq('connector_type', filters.connectorType)
      if (filters.level) query = query.eq('level', filters.level)
      if (filters.teslaCompatible) query = query.eq('tesla_compatible', true)
      if (filters.free) query = query.or('session_price.is.null,session_price.eq.0')
      if (searchQuery) query = query.ilike('address_approx', `%${searchQuery}%`)

      const { data, error: dbError } = await query.order('created_at', { ascending: false }).limit(50)
      if (dbError) throw dbError
      setChargers(data || [])
    } catch {
      setChargers(DEMO_CHARGERS)
    } finally {
      setLoading(false)
    }
  }, [filters, searchQuery])

  useEffect(() => {
    loadChargers()
  }, [loadChargers])

  const mapCenter = chargers.length > 0
    ? [chargers.reduce((s, c) => s + c.lat, 0) / chargers.length,
      chargers.reduce((s, c) => s + c.lng, 0) / chargers.length]
    : [51.505, -0.09]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Chargers</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Loading…' : `${chargers.length} charger${chargers.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              aria-label="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('map')}
              className={`p-2 rounded ${view === 'map' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              aria-label="Map view"
            >
              <MapIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('split')}
              className={`p-2 rounded text-xs font-medium ${view === 'split' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              aria-label="Split view"
            >
              Split
            </button>
          </div>
        </div>

        <FilterBar
          filters={filters}
          onChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={loadChargers}
        />

        {error && <Alert type="warning" message={error} />}

        {view === 'list' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
              : chargers.length === 0
                ? (
                  <div className="col-span-full text-center py-16 text-gray-400">
                    <MapIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No chargers found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                )
                : chargers.map((c) => <ChargerCard key={c.id} charger={c} />)
            }
          </div>
        )}

        {view === 'map' && (
          <div className="h-[calc(100vh-280px)] min-h-[400px]">
            {loading
              ? <div className="h-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              : <ChargerMap chargers={chargers} center={mapCenter} zoom={12} />
            }
          </div>
        )}

        {view === 'split' && (
          <div className="flex gap-4 h-[calc(100vh-280px)] min-h-[500px]">
            <div className="w-80 flex-shrink-0 overflow-y-auto space-y-3 pr-1">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                : chargers.length === 0
                  ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="font-medium">No chargers found</p>
                    </div>
                  )
                  : chargers.map((c) => <ChargerCard key={c.id} charger={c} />)
              }
            </div>
            <div className="flex-1 min-h-0">
              {loading
                ? <div className="h-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                : <ChargerMap chargers={chargers} center={mapCenter} zoom={12} />
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
