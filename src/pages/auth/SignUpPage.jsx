import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/FormFields'
import { Alert } from '../../components/ui/Alert'

export default function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    const errs = {}
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email'
    if (!formData.password) errs.password = 'Password is required'
    else if (formData.password.length < 8) errs.password = 'At least 8 characters'
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setServerError('')
    setLoading(true)
    try {
      await signUp(formData.email, formData.password, formData.fullName)
      setSuccess(true)
    } catch (err) {
      setServerError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-md w-full text-center space-y-4">
          <Zap className="h-12 w-12 text-emerald-600 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h1>
          <p className="text-gray-500 dark:text-gray-400">
            We sent a confirmation link to <strong>{formData.email}</strong>. Click the link to activate your account.
          </p>
          <Button onClick={() => navigate('/auth/login')} className="w-full">
            Go to Log In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xl mb-6">
            <Zap className="h-6 w-6" />
            ChargeShare Local
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-emerald-600 hover:underline font-medium">Log in</Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          {serverError && <Alert type="error" message={serverError} />}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="fullName"
              label="Full name"
              type="text"
              placeholder="Jane Smith"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              autoComplete="name"
            />
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              autoComplete="new-password"
            />
            <Input
              id="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="text-xs text-center text-gray-400">
            By signing up you agree to our{' '}
            <Link to="/terms" className="underline">Terms</Link> and{' '}
            <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
