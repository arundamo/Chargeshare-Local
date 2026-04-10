export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export function LoadingSkeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <LoadingSkeleton className="h-40 w-full rounded-lg" />
      <LoadingSkeleton className="h-5 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-full" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-6 w-16 rounded-full" />
        <LoadingSkeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}
