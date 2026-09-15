import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

function AnimatedCounter({ value }) {
  const numericVal = typeof value === 'number' ? value : parseInt(value, 10)
  
  if (isNaN(numericVal)) return <span>{value ?? '—'}</span>

  const spring = useSpring(0, { bounce: 0.15, duration: 1.2 })
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())
  const [currentVal, setCurrentVal] = useState('0')

  useEffect(() => {
    spring.set(numericVal)
    const unsubscribe = display.on('change', (latest) => setCurrentVal(latest))
    return () => unsubscribe()
  }, [numericVal, spring, display])

  return <span>{currentVal}</span>
}

export default function StatCard({ title, value, icon: Icon, color = 'primary', subtitle, trend }) {
  const colorMap = {
    primary: {
      box: 'from-brand-500/20 to-indigo-500/20 border-brand-500/30 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.25)]',
      glow: 'bg-indigo-500/20',
      text: 'text-indigo-400'
    },
    green: {
      box: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      glow: 'bg-emerald-500/20',
      text: 'text-emerald-400'
    },
    yellow: {
      box: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      glow: 'bg-amber-500/20',
      text: 'text-amber-400'
    },
    red: {
      box: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      glow: 'bg-rose-500/20',
      text: 'text-rose-400'
    },
    purple: {
      box: 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
      glow: 'bg-purple-500/20',
      text: 'text-purple-400'
    },
    blue: {
      box: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      glow: 'bg-cyan-500/20',
      text: 'text-cyan-400'
    },
  }

  const theme = colorMap[color] || colorMap.primary

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card-vfx p-6 border border-white/10 flex items-center justify-between gap-4 relative overflow-hidden group cursor-pointer"
    >
      {/* Background radial ambient light */}
      <div className={`ambient-glow w-32 h-32 ${theme.glow} -top-8 -right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-4 rounded-2xl bg-gradient-to-br border ${theme.box} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-2xl lg:text-3xl font-display font-black text-white mt-1 tracking-tight">
            <AnimatedCounter value={value} />
          </p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>}
        </div>
      </div>

      {trend && (
        <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full border border-white/10 bg-white/5 ${theme.text}`}>
          {trend}
        </span>
      )}
    </motion.div>
  )
}

