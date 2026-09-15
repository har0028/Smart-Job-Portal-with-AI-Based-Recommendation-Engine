import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, ArrowRight, UserCheck, Briefcase, Menu, X, LayoutDashboard, Search } from 'lucide-react'
import BrandLogo from './BrandLogo'

export default function PublicNavbar({ onOpenAuth }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenu, setMobileMenu] = useState(false)

  const dashboardPath =
    user?.role === 'ADMIN' ? '/admin/dashboard' :
    user?.role === 'RECRUITER' ? '/recruiter/dashboard' :
    '/seeker/dashboard'

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 z-40 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Professional Brand Logo */}
        <BrandLogo size="md" to="/" />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#hero" className="hover:text-indigo-400 transition-colors">Home</a>
          <a href="#resume-matcher" className="hover:text-indigo-400 transition-colors flex items-center gap-1 text-cyan-300 font-bold">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" /> Resume Matcher
          </a>
          <a href="#jobs-feed" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5 text-indigo-400" /> Explore Jobs
          </a>
          <a href="#ai-features" className="hover:text-indigo-400 transition-colors">AI Engine</a>
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
        </nav>

        {/* Desktop CTA Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <Link
              to={dashboardPath}
              className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
            </Link>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('recruiter')}
                className="btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-1.5"
              >
                <Briefcase className="h-4 w-4 text-cyan-400" /> Post a Job
              </button>

              <button
                onClick={() => onOpenAuth('seeker')}
                className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2 font-bold"
              >
                <UserCheck className="h-4 w-4" /> Sign In / Register <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenu && (
        <div className="lg:hidden bg-slate-900/95 border-b border-white/10 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <a href="#hero" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">Home</a>
            <a href="#jobs-feed" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">Explore Jobs</a>
            <a href="#ai-features" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">AI Engine</a>
            <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">How It Works</a>
            <a href="#testimonials" onClick={() => setMobileMenu(false)} className="hover:text-white py-1">Reviews</a>
          </nav>

          <div className="pt-4 border-t border-white/10 space-y-2">
            {user ? (
              <Link
                to={dashboardPath}
                className="btn-primary w-full py-3 text-center flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
              </Link>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenu(false); onOpenAuth('seeker'); }}
                  className="btn-primary w-full py-3 text-center flex items-center justify-center gap-2"
                >
                  <UserCheck className="h-4 w-4" /> Sign In / Register
                </button>
                <button
                  onClick={() => { setMobileMenu(false); onOpenAuth('recruiter'); }}
                  className="btn-secondary w-full py-3 text-center flex items-center justify-center gap-2"
                >
                  <Briefcase className="h-4 w-4 text-cyan-400" /> Employer Post Job
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
