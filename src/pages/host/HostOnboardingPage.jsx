import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Shield, Clock, CheckCircle, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input, Textarea, Checkbox } from '../../components/ui/FormFields'
import { Alert } from '../../components/ui/Alert'

const STEPS = ['Identity', 'Your Charger', 'Rules & Availability', 'Review']

export default function HostOnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    chargerTitle: '',
    connectorType: '',
    level: '',
    powerKw: '',
    teslaCompatible: false,
    sessionPrice: '',
    exactAddress: '',
    addressApprox: '',
    accessNotes: '',
    availabilityType: 'always',
    houseRules: '',
  })

  function setField(key, value) {
    setFormData(f => ({ ...f, [key]: value }))
  }

  function validateStep() {
    if (step === 0) {
      if (!formData.fullName.trim()) { setError('Full name is required'); return false }
      if (!formData.agreeTerms || !formData.agreePrivacy) { setError('Please accept the terms'); return false }
    }
    if (step === 1) {
      if (!formData.chargerTitle.trim()) { setError('Charger title is required'); return false }
      if (!formData.connectorType) { setError('Select connector type'); return false }
      if (!formData.level) { setError('Select charging level'); return false }
      if (!formData.exactAddress.trim()) { setError('Exact address is required (kept private)'); return false }
      if (!formData.addressApprox.trim()) { setError('Approximate location is required (public)'); return false }
    }
    return true
  }

  async function handleSubmit() {
    if (!validateStep()) return
    setLoading(true)
    setError('')
    try {
      const supabaseAvailable = import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'

      if (supabaseAvailable && user) {
        // Update user role to host
        await supabase.from('users').update({ role: 'host' }).eq('id', user.id)

        // Create host record
        const { data: hostData } = await supabase.from('hosts').insert({
          user_id: user.id,
          phone: formData.phone,
          house_rules: formData.houseRules,
          response_time: 'Usually within a few hours',
        }).select('id').single()

        // Create charger listing
        await supabase.from('chargers').insert({
          host_id: hostData.id,
          title: formData.chargerTitle,
          connector_type: formData.connectorType,
          level: formData.level,
          power_kw: formData.powerKw ? parseFloat(formData.powerKw) : null,
          tesla_compatible: formData.teslaCompatible,
          session_price: formData.sessionPrice ? parseFloat(formData.sessionPrice) : 0,
          exact_address_private: formData.exactAddress,
          address_approx: formData.addressApprox,
          access_notes: formData.accessNotes,
          availability_type: formData.availabilityType,
          status: 'pending',
        })
      }

      navigate('/host/dashboard')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function next() {
    if (!validateStep()) return
    setError('')
    setStep(s => s + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-3">
            <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Become a Host</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your charger with the EV community</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-colors ${
                i < step ? 'bg-emerald-600 text-white' :
                i === step ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500' :
                'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}>
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden sm:block text-xs ml-1 ${i === step ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 mx-1.5" />}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
          {error && <Alert type="error" message={error} />}

          {/* Step 0: Identity */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Tell us about yourself</h2>
              <Input
                id="fullName"
                label="Full name"
                placeholder="Jane Smith"
                value={formData.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
              />
              <Input
                id="phone"
                label="Phone number (optional)"
                type="tel"
                placeholder="+1 555 000 0000"
                value={formData.phone}
                onChange={(e) => setField('phone', e.target.value)}
              />
              <div className="space-y-2 pt-2">
                <Checkbox
                  id="agreeTerms"
                  label="I agree to the Terms of Service"
                  checked={formData.agreeTerms}
                  onChange={(e) => setField('agreeTerms', e.target.checked)}
                />
                <Checkbox
                  id="agreePrivacy"
                  label="I agree to the Privacy Policy and understand my exact address is kept private"
                  checked={formData.agreePrivacy}
                  onChange={(e) => setField('agreePrivacy', e.target.checked)}
                />
              </div>
            </div>
          )}

          {/* Step 1: Charger details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Charger details</h2>
              <Input
                id="title"
                label="Listing title"
                placeholder="e.g. Driveway Level 2 – Tesla friendly"
                value={formData.chargerTitle}
                onChange={(e) => setField('chargerTitle', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Connector type</label>
                  <select
                    value={formData.connectorType}
                    onChange={(e) => setField('connectorType', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm"
                  >
                    <option value="">Select…</option>
                    {['Type 1 (J1772)', 'Type 2 (Mennekes)', 'CCS1', 'CCS2', 'CHAdeMO', 'Tesla NACS', 'NEMA 5-15', 'NEMA 14-50'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Charging level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setField('level', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm"
                  >
                    <option value="">Select…</option>
                    <option value="Level 1">Level 1 (~1.4 kW)</option>
                    <option value="Level 2">Level 2 (~7–22 kW)</option>
                    <option value="DC Fast">DC Fast (50+ kW)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="powerKw"
                  label="Power output (kW)"
                  type="number"
                  placeholder="e.g. 7"
                  value={formData.powerKw}
                  onChange={(e) => setField('powerKw', e.target.value)}
                />
                <Input
                  id="sessionPrice"
                  label="Session fee ($, 0 = free)"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.sessionPrice}
                  onChange={(e) => setField('sessionPrice', e.target.value)}
                />
              </div>
              <Checkbox
                id="teslaCompatible"
                label="Tesla compatible (has adapter or NACS)"
                checked={formData.teslaCompatible}
                onChange={(e) => setField('teslaCompatible', e.target.checked)}
              />
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Shield className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Your exact address is kept private and only shared with approved drivers.
                  </p>
                </div>
                <Input
                  id="exactAddress"
                  label="Exact address (private)"
                  placeholder="12 Example Street, City, Postcode"
                  value={formData.exactAddress}
                  onChange={(e) => setField('exactAddress', e.target.value)}
                />
                <Input
                  id="addressApprox"
                  label="Approximate location (public)"
                  placeholder="e.g. Shoreditch, London E1"
                  value={formData.addressApprox}
                  onChange={(e) => setField('addressApprox', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Rules & availability */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Rules &amp; availability</h2>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Availability</label>
                <select
                  value={formData.availabilityType}
                  onChange={(e) => setField('availabilityType', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm"
                >
                  <option value="always">Always available</option>
                  <option value="scheduled">By schedule</option>
                  <option value="on_request">On request</option>
                </select>
              </div>
              <Textarea
                id="accessNotes"
                label="Access notes (shown after booking approval)"
                placeholder="Ring the doorbell, parking bay is on the left…"
                value={formData.accessNotes}
                onChange={(e) => setField('accessNotes', e.target.value)}
                rows={3}
              />
              <Textarea
                id="houseRules"
                label="House rules (public)"
                placeholder="No noise after 10pm. Please leave the area tidy…"
                value={formData.houseRules}
                onChange={(e) => setField('houseRules', e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Review your listing</h2>
              <div className="space-y-2 text-sm">
                {[
                  ['Name', formData.fullName],
                  ['Charger title', formData.chargerTitle],
                  ['Connector', formData.connectorType],
                  ['Level', formData.level],
                  ['Power', formData.powerKw ? `${formData.powerKw} kW` : 'Not specified'],
                  ['Tesla compatible', formData.teslaCompatible ? 'Yes' : 'No'],
                  ['Session fee', formData.sessionPrice ? `$${formData.sessionPrice}` : 'Free'],
                  ['Public location', formData.addressApprox],
                  ['Availability', formData.availabilityType],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{value || '—'}</span>
                  </div>
                ))}
              </div>
              <Alert type="info" message="Your listing will be reviewed by our team before going live (usually within 24h)." />
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between pt-2">
            {step > 0 ? (
              <Button variant="secondary" onClick={() => { setStep(s => s - 1); setError('') }}>
                Back
              </Button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>Next <ChevronRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Listing'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
