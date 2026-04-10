import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Lock className="h-10 w-10 text-emerald-600 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: January 2025</p>
        </div>

        <Section title="1. Data We Collect">
          <p><strong>Account data:</strong> Email address, full name, and phone number (optional).</p>
          <p><strong>Listing data:</strong> Charger specifications, approximate location (public), and exact address (private).</p>
          <p><strong>Usage data:</strong> Log data, IP addresses, and browser information for security and analytics.</p>
        </Section>

        <Section title="2. How We Use Your Data">
          <ul className="list-disc pl-4 space-y-1">
            <li>To operate the ChargeShare Local platform</li>
            <li>To facilitate booking requests between Drivers and Hosts</li>
            <li>To send transactional notifications (e.g., booking approvals)</li>
            <li>To detect and prevent fraud and abuse</li>
          </ul>
        </Section>

        <Section title="3. Location Privacy">
          <p>We take location privacy seriously:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Public map and listing pages show only approximate neighbourhood-level locations</li>
            <li>Exact home addresses are stored encrypted and only revealed to a Driver after a Host approves their booking</li>
            <li>Our API never returns exact addresses in public endpoints</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing">
          <p>We do not sell your personal data. We share data only with:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Supabase (our database and authentication provider)</li>
            <li>The other party in an approved booking (exact address only)</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your data for as long as your account is active. You can request deletion of your account and associated data by contacting privacy@chargesharelocal.com.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p>
        </Section>

        <Section title="7. Cookies">
          <p>We use essential cookies for authentication. We do not use third-party advertising cookies.</p>
        </Section>

        <Section title="8. Contact">
          <p>For privacy inquiries, email: <a href="mailto:privacy@chargesharelocal.com" className="text-emerald-600 hover:underline">privacy@chargesharelocal.com</a></p>
        </Section>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400">
          Also see our <Link to="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link to="/safety" className="text-emerald-600 hover:underline">Safety Guidelines</Link>.
        </div>
      </div>
    </div>
  )
}
