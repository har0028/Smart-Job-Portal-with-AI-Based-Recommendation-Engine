import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, User, ChevronDown, Shield, LogOut, Crown } from 'lucide-react'
import BrandLogo from './BrandLogo'
import NotificationBell from './NotificationBell'

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dashboardPath =
    user?.role === 'ADMIN'     ? '/admin/dashboard' :
    user?.role === 'RECRUITER' ? '/recruiter/dashboard' :
                                  '/seeker/dashboard'

  const roleColor = 
    user?.role === 'ADMIN'     ? 'from-purple-500 to-pink-500' :
    user?.role === 'RECRUITER' ? 'from-cyan-500 to-blue-500' :
                                  'from-brand-500 to-indigo-500'

  return (
    <header className="h-16 bg-slate-900/70 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-8 shrink-0 z-40 sticky top-0 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle} 
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <BrandLogo size="sm" to={dashboardPath} />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-slate-950/60 border border-white/10 px-3 py-1.5 rounded-full text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-medium text-emerald-300">AI Match Engine Active</span>
        </div>

        {/* High-Visibility Header Button for VIP Upgrade (Job Seekers) */}
        {user?.role === 'JOB_SEEKER' && (
          <Link 
            to="/seeker/pro-upgrade" 
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/25 via-purple-500/20 to-pink-500/25 border border-amber-500/50 text-amber-300 text-xs font-black shadow-[0_0_18px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 transition-all duration-200"
          >
            <Crown className="h-4 w-4 text-amber-400 animate-bounce" />
            <span className="tracking-wide">👑 VIP Career Pass</span>
          </Link>
        )}

        <NotificationBell />

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-brand-500/40 hover:bg-slate-800 transition-all duration-200"
          >
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${roleColor} p-0.5 shadow-md overflow-hidden`}>
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">{user?.fullName}</p>
              <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">
                {user?.role?.replace('_', ' ').toLowerCase()}
              </p>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 glass-panel z-50 p-2 border border-white/15 shadow-2xl"
                >
                  <div className="px-3 py-2.5 mb-1 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm font-semibold text-white">{user?.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-md border border-brand-500/30">
                      <Shield className="h-3 w-3" />
                      {user?.role}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
