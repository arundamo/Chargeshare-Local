import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/FormFields'
import { CONNECTOR_TYPES, CHARGING_LEVELS } from '../../lib/constants'

export function FilterBar({ filters, onChange, onSearch, searchQuery, onSearchChange }) {
  const { connectorType, level, teslaCompatible, free, available } = filters

  function setFilter(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by city or postal code…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button onClick={onSearch} size="sm">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <SlidersHorizontal className="inline h-3 w-3 mr-1" />
            Connector
          </label>
          <select
            value={connectorType}
            onChange={(e) => setFilter('connectorType', e.target.value)}
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All connectors</option>
            {CONNECTOR_TYPES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Level</label>
          <select
            value={level}
            onChange={(e) => setFilter('level', e.target.value)}
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All levels</option>
            {CHARGING_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Checkbox
            id="tesla"
            label="Tesla compatible"
            checked={teslaCompatible}
            onChange={(e) => setFilter('teslaCompatible', e.target.checked)}
          />
          <Checkbox
            id="free"
            label="Free only"
            checked={free}
            onChange={(e) => setFilter('free', e.target.checked)}
          />
          <Checkbox
            id="available"
            label="Available now"
            checked={available}
            onChange={(e) => setFilter('available', e.target.checked)}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ connectorType: '', level: '', teslaCompatible: false, free: false, available: false })}
          className="text-gray-400"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>
    </div>
  )
}
