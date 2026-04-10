import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Shield className="h-10 w-10 text-emerald-600 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="text-sm text-gray-400">Last updated: January 2025</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By using ChargeShare Local (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>ChargeShare Local is a hyperlocal marketplace that connects EV vehicle owners (&ldquo;Drivers&rdquo;) with private EV charger owners (&ldquo;Hosts&rdquo;). The Platform facilitates discovery and booking of private EV charging sessions.</p>
        </Section>

        <Section title="3. User Accounts">
          <p>You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
        </Section>

        <Section title="4. Host Responsibilities">
          <p>Hosts are solely responsible for ensuring their charger is safe, functional, and compliant with applicable electrical codes and regulations. ChargeShare Local does not inspect or certify chargers.</p>
        </Section>

        <Section title="5. Driver Responsibilities">
          <p>Drivers must comply with the access instructions and house rules provided by Hosts. Drivers are responsible for any damage caused during a charging session.</p>
        </Section>

        <Section title="6. Privacy & Location Data">
          <p>Exact property addresses are never disclosed on public pages. They are only shared with a Driver after a Host explicitly approves a booking request. See our <Link to="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link> for full details.</p>
        </Section>

        <Section title="7. Payments">
          <p>In v1, session fees (if any) are flat fees agreed between Driver and Host. ChargeShare Local does not process payments and is not a party to any financial transaction between users.</p>
        </Section>

        <Section title="8. Liability">
          <p>ChargeShare Local provides the Platform &ldquo;as-is&rdquo; without warranties. We are not liable for any damages arising from use of chargers listed on the Platform, including property damage or personal injury.</p>
        </Section>

        <Section title="9. Termination">
          <p>We reserve the right to suspend or terminate accounts that violate these Terms or our community guidelines.</p>
        </Section>

        <Section title="10. Changes to Terms">
          <p>We may update these Terms from time to time. Continued use after changes constitutes acceptance of the updated Terms.</p>
        </Section>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400">
          Questions? Contact us at legal@chargesharelocal.com
        </div>
      </div>
    </div>
  )
}
