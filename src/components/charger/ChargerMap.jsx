import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issues with Vite bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function BoundsUpdater({ onBoundsChange }) {
  const map = useMap()
  useEffect(() => {
    const handleMoveEnd = () => {
      const bounds = map.getBounds()
      onBoundsChange?.(bounds)
    }
    map.on('moveend', handleMoveEnd)
    return () => map.off('moveend', handleMoveEnd)
  }, [map, onBoundsChange])
  return null
}

export function ChargerMap({ chargers, center = [51.505, -0.09], zoom = 12, onBoundsChange }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsUpdater onBoundsChange={onBoundsChange} />
      {chargers.map((charger) => (
        <Marker
          key={charger.id}
          position={[charger.lat, charger.lng]}
          icon={charger.status === 'active' ? activeIcon : undefined}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold text-sm">{charger.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{charger.address_approx}</p>
              <p className="text-xs text-gray-600 mt-1">
                {charger.level} · {charger.connector_type}
              </p>
              <Link
                to={`/charger/${charger.id}`}
                className="mt-2 block text-xs text-emerald-600 font-medium hover:underline"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
