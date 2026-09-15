export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className={`animate-spin rounded-full border-2 border-brand-500 border-t-transparent ${sizes[size]} ${className}`} />
  )
}

export function PageSpinner() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
        Loading Vector Engine...
      </span>
    </div>
  )
}
