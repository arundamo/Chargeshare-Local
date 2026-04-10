import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

function Section({ title, items }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Safety Guidelines</h1>
          <p className="text-sm text-gray-400">Keeping our community safe and trusted</p>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
          ChargeShare Local is a community platform. Safety is a shared responsibility between Hosts and Drivers.
        </div>

        <Section
          title="For Hosts"
          items={[
            'Ensure your EV charger meets all local electrical safety standards and codes.',
            'Use a certified Level 2 EVSE unit — avoid DIY or uncertified installations.',
            'Keep the charging area clear of obstructions and hazards.',
            'Always inspect the charger cable before each use for damage or wear.',
            'Only approve bookings from Drivers you are comfortable with.',
            'Never share your exact address publicly — use the approximate location feature.',
            'Report any misuse or damage immediately via the Report button.',
            'Inform your home insurance provider that you are sharing your charger commercially.',
          ]}
        />

        <Section
          title="For Drivers"
          items={[
            'Always send a booking request — never attempt to charge without host approval.',
            'Inspect the charging cable before connecting. Do not use if damaged.',
            'Follow the host\'s access notes and house rules at all times.',
            'Never leave your vehicle unattended for extended periods without notifying the host.',
            'If you notice a fault with the charger, stop the session and notify the host immediately.',
            'Do not bring additional guests to the charger location without permission.',
            'Report any charger that appears unsafe using the Report feature.',
          ]}
        />

        <Section
          title="Platform safety features"
          items={[
            'Exact addresses are never shown publicly — only after host approval.',
            'All charger listings are reviewed by our admin team before going live.',
            'Users can report suspicious or unsafe listings at any time.',
            'Our admin team reviews all reports and takes action within 48 hours.',
            'Accounts that violate community standards are suspended promptly.',
          ]}
        />

        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 space-y-1">
          <p className="font-semibold">Emergency</p>
          <p>If you are in immediate danger or witness an electrical hazard, call emergency services (999 in UK / 911 in US) immediately. Do not attempt to handle electrical faults yourself.</p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400">
          Read our <Link to="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  )
}
