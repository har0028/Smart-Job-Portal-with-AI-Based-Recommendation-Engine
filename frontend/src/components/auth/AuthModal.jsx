import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/authApi'
import { Eye, EyeOff, ArrowRight, ShieldCheck, Zap, UserCheck, Briefcase, X, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import BrandLogo from '../common/BrandLogo'

export default function AuthModal({ open, onClose, defaultTab = 'seeker', promptContext = null, onSuccess = null }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [role, setRole] = useState(defaultTab === 'recruiter' ? 'RECRUITER' : 'JOB_SEEKER')

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  // Register form
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: defaultTab === 'recruiter' ? 'RECRUITER' : 'JOB_SEEKER',
    companyName: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  if (!open) return null

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setRegisterForm(prev => ({ ...prev, role: newRole }))
  }

  const validateLogin = () => {
    const e = {}
    if (!loginForm.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) e.email = 'Invalid email address'
    if (!loginForm.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateRegister = () => {
    const e = {}
    if (!registerForm.fullName) e.fullName = 'Full name is required'
    if (!registerForm.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(registerForm.email)) e.email = 'Invalid email address'
    
    if (!registerForm.password) {
      e.password = 'Password is required'
    } else if (registerForm.password.length < 8) {
      e.password = 'Password must be at least 8 characters long'
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(registerForm.password)) {
      e.password = 'Must contain uppercase, lowercase, number & symbol (e.g. Password@123)'
    }

    if (role === 'RECRUITER' && !registerForm.companyName) {
      e.companyName = 'Company name is required for recruiter account'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return
    setLoading(true)
    try {
      const user = await login(loginForm)
      toast.success(`Welcome back, ${user.fullName}! ✨`)
      if (onSuccess) onSuccess(user)
      onClose()

      if (user.role === 'ADMIN') navigate('/admin/dashboard')
      else if (user.role === 'RECRUITER') navigate('/recruiter/dashboard')
      else navigate('/seeker/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    if (!validateRegister()) return
    setLoading(true)
    try {
      const payload = { ...registerForm, role }
      await authApi.register(payload)
      toast.success('Registration successful! Logging you in...')
      
      // Auto login after registration
      const user = await login({ email: registerForm.email, password: registerForm.password })
      if (onSuccess) onSuccess(user)
      onClose()

      if (user.role === 'ADMIN') navigate('/admin/dashboard')
      else if (user.role === 'RECRUITER') navigate('/recruiter/dashboard')
      else navigate('/seeker/dashboard')
    } catch (err) {
      const fieldErrors = err.response?.data?.data
      if (fieldErrors && typeof fieldErrors === 'object') {
        setErrors(fieldErrors)
      }
      const msg = err.response?.data?.message || 'Registration failed. Please check credentials.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const demoLogins = [
    { label: 'Job Seeker', email: 'john.doe@gmail.com', password: 'Password@123', color: 'from-indigo-500/20 to-cyan-500/20 text-indigo-300' },
    { label: 'Recruiter', email: 'recruiter1@techcorp.com', password: 'Password@123', color: 'from-cyan-500/20 to-emerald-500/20 text-cyan-300' },
    { label: 'Admin', email: 'admin@smartjobportal.com', password: 'Admin@123', color: 'from-purple-500/20 to-pink-500/20 text-purple-300' }
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl glass-panel p-6 sm:p-8 border border-white/20 shadow-2xl shadow-indigo-500/20 z-50 overflow-hidden my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Ambient Glows inside modal */}
          <div className="ambient-glow w-64 h-64 bg-indigo-600/20 -top-20 -left-20" />
          <div className="ambient-glow w-64 h-64 bg-purple-600/20 -bottom-20 -right-20" />

          {/* Header Brand */}
          <div className="text-center relative z-10 mb-6">
            <div className="inline-flex justify-center mb-3">
              <BrandLogo size="lg" to={null} />
            </div>

            {/* Prompt context header (e.g. when applying for a job) */}
            {promptContext ? (
              <div className="my-2 p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs font-medium flex items-center gap-2 text-left">
                <Lock className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>{promptContext}</span>
              </div>
            ) : (
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
                {mode === 'login' 
                  ? 'Access your intelligent career & hiring dashboard' 
                  : 'Join thousands of candidates & enterprise recruiters'}
              </p>
            )}
          </div>

          {/* Role selector tabs */}
          <div className="flex bg-slate-950/70 p-1 rounded-2xl border border-white/10 relative z-10 mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('JOB_SEEKER')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                role === 'JOB_SEEKER'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="h-4 w-4" /> Candidate / Seeker
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('RECRUITER')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                role === 'RECRUITER'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-4 w-4" /> Recruiter / Employer
            </button>
          </div>

          {/* Form Switcher */}
          <div className="relative z-10">
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className={`glass-input ${errors.email ? 'border-rose-500' : ''}`}
                    placeholder="you@company.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                  {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className={`glass-input pr-10 ${errors.password ? 'border-rose-500' : ''}`}
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 animate-spin" /> Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 font-bold">
                      Sign In & Continue <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    className={`glass-input ${errors.fullName ? 'border-rose-500' : ''}`}
                    placeholder="Alex Morgan"
                    value={registerForm.fullName}
                    onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  />
                  {errors.fullName && <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className={`glass-input ${errors.email ? 'border-rose-500' : ''}`}
                    placeholder="alex@company.com"
                    value={registerForm.email}
                    onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                  {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                </div>

                {role === 'RECRUITER' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Company Name</label>
                    <input
                      type="text"
                      className={`glass-input ${errors.companyName ? 'border-rose-500' : ''}`}
                      placeholder="TechCorp Innovations"
                      value={registerForm.companyName}
                      onChange={e => setRegisterForm({ ...registerForm, companyName: e.target.value })}
                    />
                    {errors.companyName && <p className="text-xs text-rose-400 mt-1">{errors.companyName}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className={`glass-input pr-10 ${errors.password ? 'border-rose-500' : ''}`}
                      placeholder="e.g. Password@123 (Min 8 chars, Uppercase, Symbol)"
                      value={registerForm.password}
                      onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password}</p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">Requires 8+ chars with Uppercase, Lowercase, Number & Symbol (e.g. Password@123)</p>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 animate-spin" /> Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 font-bold">
                      Create Account & Start <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* Toggle Mode */}
            <div className="mt-5 text-center text-xs text-slate-400">
              {mode === 'login' ? (
                <>
                  New to SmartJobs?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrors({}); }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
                  >
                    Create a free account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrors({}); }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
                  >
                    Sign in to your account
                  </button>
                </>
              )}
            </div>

            {/* 1-Click Demo Logins */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 text-center mb-3.5 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Instant Demo Sign-In
              </p>
              <div className="grid grid-cols-3 gap-2">
                {demoLogins.map(d => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => {
                      setMode('login')
                      setLoginForm({ email: d.email, password: d.password })
                    }}
                    className={`text-[11px] py-2 px-2 rounded-xl border border-white/10 bg-gradient-to-r ${d.color} hover:border-white/30 transition-all font-bold shadow-sm text-center`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
