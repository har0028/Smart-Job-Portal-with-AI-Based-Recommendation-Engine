import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, ArrowRight, UserCheck, Briefcase, Menu, X, LayoutDashboard, Search, Cpu, Layers } from 'lucide-react'
import BrandLogo from './BrandLogo'

export default function PublicNavbar({ onOpenAuth }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const dashboardPath =
    user?.role === 'ADMIN' ? '/admin/dashboard' :
    user?.role === 'RECRUITER' ? '/recruiter/dashboard' :
    '/seeker/dashboard'

  return (
    <header className={`fixed top-0 left-0 right-0 h-20 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#07090e]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/50' 
        : 'bg-[#07090e]/70 backdrop-blur-lg border-b border-white/[0.05]'
    }`}>
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <BrandLogo size="md" to="/" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-300">
          <a 
            href="#hero" 
            className="hover:text-white transition-colors py-1 relative group"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-200 group-hover:w-full" />
          </a>

          <a 
            href="#resume-matcher" 
            className="hover:text-white transition-colors py-1 flex items-center gap-1.5 text-cyan-300 font-semibold relative group"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Resume Matcher</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full" />
          </a>

          <a 
            href="#jobs-feed" 
            className="hover:text-white transition-colors py-1 flex items-center gap-1.5 relative group"
          >
            <Search className="h-3.5 w-3.5 text-indigo-400" />
            <span>Explore Jobs</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-200 group-hover:w-full" />
          </a>

          <a 
            href="#ai-features" 
            className="hover:text-white transition-colors py-1 flex items-center gap-1.5 relative group"
          >
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>AI Engine</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-200 group-hover:w-full" />
          </a>

          <a 
            href="#how-it-works" 
            className="hover:text-white transition-colors py-1 relative group"
          >
            <span>How It Works</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-200 group-hover:w-full" />
          </a>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to={dashboardPath}
              className="btn-primary text-xs sm:text-sm py-2 px-4 flex items-center gap-2 font-semibold"
            >
              <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
            </Link>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('recruiter')}
                className="btn-secondary text-xs sm:text-sm py-2 px-3.5 flex items-center gap-1.5 font-medium"
              >
                <Briefcase className="h-3.5 w-3.5 text-cyan-400" /> Post a Job
              </button>

              <button
                onClick={() => onOpenAuth('seeker')}
                className="btn-primary text-xs sm:text-sm py-2 px-4 flex items-center gap-1.5 font-semibold"
              >
                <UserCheck className="h-4 w-4" /> Sign In / Register
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none"
        >
          {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenu && (
        <div className="md:hidden bg-[#0a0d16]/98 border-b border-white/[0.1] backdrop-blur-2xl px-6 py-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <a 
              href="#hero" 
              onClick={() => setMobileMenu(false)} 
              className="hover:text-white py-1.5 border-b border-white/[0.05]"
            >
              Home
            </a>
            <a 
              href="#resume-matcher" 
              onClick={() => setMobileMenu(false)} 
              className="hover:text-cyan-300 py-1.5 text-cyan-400 font-semibold flex items-center gap-2 border-b border-white/[0.05]"
            >
              <Sparkles className="h-4 w-4" /> Resume Matcher
            </a>
            <a 
              href="#jobs-feed" 
              onClick={() => setMobileMenu(false)} 
              className="hover:text-white py-1.5 flex items-center gap-2 border-b border-white/[0.05]"
            >
              <Search className="h-4 w-4 text-indigo-400" /> Explore Jobs
            </a>
            <a 
              href="#ai-features" 
              onClick={() => setMobileMenu(false)} 
              className="hover:text-white py-1.5 flex items-center gap-2 border-b border-white/[0.05]"
            >
              <Cpu className="h-4 w-4 text-purple-400" /> AI Engine
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenu(false)} 
              className="hover:text-white py-1.5 border-b border-white/[0.05]"
            >
              How It Works
            </a>
          </nav>

          <div className="pt-2 space-y-2.5">
            {user ? (
              <Link
                to={dashboardPath}
                onClick={() => setMobileMenu(false)}
                className="btn-primary w-full py-3 text-center flex items-center justify-center gap-2 font-semibold text-sm"
              >
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
              </Link>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenu(false); onOpenAuth('seeker'); }}
                  className="btn-primary w-full py-3 text-center flex items-center justify-center gap-2 font-semibold text-sm"
                >
                  <UserCheck className="h-4 w-4" /> Sign In / Register
                </button>
                <button
                  onClick={() => { setMobileMenu(false); onOpenAuth('recruiter'); }}
                  className="btn-secondary w-full py-3 text-center flex items-center justify-center gap-2 font-medium text-sm"
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
