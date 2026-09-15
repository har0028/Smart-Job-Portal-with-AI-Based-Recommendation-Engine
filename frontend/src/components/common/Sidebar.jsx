import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar({ links, open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" 
            onClick={onClose} 
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-900/80 backdrop-blur-2xl border-r border-white/10
        z-40 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] lg:shadow-none
      `}>
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {links.map(({ to, icon: Icon, label, featured }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                 ${featured
                   ? 'bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-pink-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-400'
                   : isActive
                   ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                   : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${featured ? 'text-amber-400 animate-bounce' : isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className="truncate tracking-wide font-extrabold">{label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeSidePill" 
                      className={`absolute right-2 w-1.5 h-5 rounded-full ${featured ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]' : 'bg-indigo-400 shadow-glow-sm'}`} 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
