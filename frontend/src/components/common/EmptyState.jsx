export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center py-16 px-6 text-center border border-white/10">
      {Icon && (
        <div className="h-16 w-16 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-4 text-brand-400 shadow-glow-sm">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="text-base font-bold font-display text-white">{title}</h3>
      {description && <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
