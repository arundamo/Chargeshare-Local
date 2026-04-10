import { Link } from 'react-router-dom'
import { Zap, MapPin, Shield, DollarSign, ChevronRight, Star } from 'lucide-react'
import { Button } from '../components/ui/Button'

const DEMO_CHARGERS = [
  {
    id: 1, title: 'Driveway Level 2 – Tesla friendly', level: 'Level 2',
    connector_type: 'Tesla NACS', address_approx: 'Shoreditch, London', session_price: 5,
    tesla_compatible: true, status: 'active',
  },
  {
    id: 2, title: 'Garage CCS Fast Charger', level: 'DC Fast',
    connector_type: 'CCS2', address_approx: 'Hackney, London', session_price: 0,
    tesla_compatible: false, status: 'active',
  },
  {
    id: 3, title: 'Home L1 – overnight welcome', level: 'Level 1',
    connector_type: 'NEMA 5-15', address_approx: 'Bethnal Green, London', session_price: 2,
    tesla_compatible: false, status: 'active',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
            <Zap className="h-3.5 w-3.5" />
            The hyperlocal EV charger marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Share your charger.<br />
            <span className="text-emerald-600 dark:text-emerald-400">Power your community.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            ChargeShare Local connects EV drivers with private charger owners nearby. Safe, simple, and community-first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/browse">
              <Button size="lg">
                <MapPin className="h-5 w-5" />
                Find Chargers Near Me
              </Button>
            </Link>
            <Link to="/host/onboarding">
              <Button size="lg" variant="outline">
                <Zap className="h-5 w-5" />
                List Your Charger
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Built on trust &amp; privacy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="h-7 w-7 text-emerald-600" />,
                title: 'Privacy first',
                desc: 'Exact home addresses are never shown until a booking is approved by the host.',
              },
              {
                icon: <MapPin className="h-7 w-7 text-emerald-600" />,
                title: 'Neighbourhood-level search',
                desc: 'Browse by city or postal code. Map shows approximate locations only.',
              },
              {
                icon: <DollarSign className="h-7 w-7 text-emerald-600" />,
                title: 'Free or paid',
                desc: 'Hosts choose their session fee or offer their charger for free to the community.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-3 text-center">
                <div className="flex justify-center">{icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured chargers */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured chargers</h2>
            <Link to="/browse" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_CHARGERS.map((charger) => (
              <div key={charger.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">{charger.title}</h3>
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {charger.address_approx}
                  </div>
                  <div className="text-xs text-gray-500">{charger.level} · {charger.connector_type}</div>
                  <div className="text-sm font-medium text-emerald-600">
                    {charger.session_price === 0 ? 'Free' : `$${charger.session_price} / session`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">D</span>
                For Drivers
              </h3>
              <ol className="space-y-3">
                {[
                  'Search for chargers near you by city or postcode',
                  'View approximate location and charger details',
                  'Send a booking request to the host',
                  'Get the exact address once approved',
                  'Charge up and leave a review',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">H</span>
                For Hosts
              </h3>
              <ol className="space-y-3">
                {[
                  'Complete host onboarding (takes 5 minutes)',
                  'Create your charger listing with details',
                  'Set your availability and session fee',
                  'Review and approve driver requests',
                  'Share the exact address and earn',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">What people say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', quote: 'Found a charger two streets away in under a minute. The host was super friendly!', stars: 5 },
              { name: 'James L.', quote: 'Listed my Level 2 charger and had 3 bookings in the first week. Love it.', stars: 5 },
              { name: 'Priya K.', quote: 'Privacy features are great — I never worried about sharing my address publicly.', stars: 5 },
            ].map(({ name, quote, stars }) => (
              <div key={name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-left space-y-3">
                <div className="flex">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">&ldquo;{quote}&rdquo;</p>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-200">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-emerald-600 dark:bg-emerald-800">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-3xl font-bold text-white">Ready to join the community?</h2>
          <p className="text-emerald-100">Sign up free and start sharing or finding EV chargers near you today.</p>
          <Link to="/auth/signup">
            <Button variant="secondary" size="lg">
              Get Started — It&apos;s Free
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
