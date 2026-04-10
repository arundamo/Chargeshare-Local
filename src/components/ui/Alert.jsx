import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
  warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
}

export function Alert({ type = 'info', message, className = '' }) {
  const Icon = icons[type]
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${styles[type]} ${className}`} role="alert">
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
