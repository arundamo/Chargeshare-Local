import { Link } from 'react-router-dom'
import { MapPin, Zap, DollarSign, Clock, Shield } from 'lucide-react'
import { Badge } from '../ui/Badge'

export function ChargerCard({ charger }) {
  const {
    id,
    title,
    connector_type,
    level,
    power_kw,
    tesla_compatible,
    session_price,
    address_approx,
    availability_type,
    status,
  } = charger

  const isFree = !session_price || session_price === 0

  return (
    <Link
      to={`/charger/${id}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 overflow-hidden"
    >
      {/* Header color band */}
      <div className="h-3 bg-gradient-to-r from-emerald-500 to-teal-400" />

      <div className="p-4 space-y-3">
        {/* Title & status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <Badge variant={status === 'active' ? 'success' : 'default'}>
            {status}
          </Badge>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{address_approx}</span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="info">
            <Zap className="h-3 w-3" />
            {level}
          </Badge>
          <Badge>
            {connector_type}
          </Badge>
          {power_kw && (
            <Badge>{power_kw} kW</Badge>
          )}
          {tesla_compatible && (
            <Badge variant="success">
              <Shield className="h-3 w-3" />
              Tesla OK
            </Badge>
          )}
        </div>

        {/* Price & availability */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 text-sm font-medium">
            {isFree ? (
              <span className="text-emerald-600 dark:text-emerald-400">Free</span>
            ) : (
              <>
                <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">${session_price} / session</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{availability_type}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
