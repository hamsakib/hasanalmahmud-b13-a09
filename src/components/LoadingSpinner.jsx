export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div
      className={`${sizes[size]} border-amber-500 border-t-transparent rounded-full animate-spin`}
    />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 z-50">
        {spinner}
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  )
}
