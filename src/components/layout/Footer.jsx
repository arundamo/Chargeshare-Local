import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Zap className="h-5 w-5 text-emerald-400" />
              ChargeShare Local
            </Link>
            <p className="text-sm leading-relaxed">
              Hyperlocal EV charger sharing marketplace. Share your charger, charge the future.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-white transition-colors">Browse Chargers</Link></li>
              <li><Link to="/host/onboarding" className="hover:text-white transition-colors">List Your Charger</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/auth/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/auth/login" className="hover:text-white transition-colors">Log In</Link></li>
              <li><Link to="/driver/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/safety" className="hover:text-white transition-colors">Safety Guidelines</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          © {new Date().getFullYear()} ChargeShare Local. All rights reserved. Built for the EV community.
        </div>
      </div>
    </footer>
  )
}
