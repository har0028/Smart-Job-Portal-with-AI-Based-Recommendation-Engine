import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, ArrowRight, ShieldCheck, Zap, UserCheck, Briefcase, ArrowLeft, Sparkles, AlertCircle, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import BrandLogo from '../../components/common/BrandLogo'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('JOB_SEEKER')
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setLoginFailed(false)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.fullName}! ✨`)
      if (user.role === 'ADMIN') navigate('/admin/dashboard')
      else if (user.role === 'RECRUITER') navigate('/recruiter/dashboard')
      else navigate('/seeker/dashboard')
    } catch (err) {
      setLoginFailed(true)
      const serverMsg = err.response?.data?.message
      if (serverMsg && serverMsg !== 'Bad credentials') {
        toast.error(serverMsg)
      } else {
        toast.error('Account not registered or invalid password. Please Create an Account first!')
      }
    } finally {
      setLoading(false)
    }
  }

  const demoLogins = [
    { label: 'Job Seeker', email: 'john.doe@gmail.com', password: 'Password@123', color: 'from-indigo-500/20 to-cyan-500/20 text-indigo-300', role: 'JOB_SEEKER' },
    { label: 'Recruiter', email: 'recruiter1@techcorp.com', password: 'Password@123', color: 'from-cyan-500/20 to-emerald-500/20 text-cyan-300', role: 'RECRUITER' },
    { label: 'Admin', email: 'admin@smartjobportal.com', password: 'Admin@123', color: 'from-purple-500/20 to-pink-500/20 text-purple-300', role: 'ADMIN' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background Glowing Mesh */}
      <div className="ambient-glow w-[600px] h-[600px] bg-indigo-600/20 -top-20 -left-20 animate-pulse-glow" />
      <div className="ambient-glow w-[600px] h-[600px] bg-purple-600/20 -bottom-20 -right-20 animate-pulse-glow" />

      {/* Navigation link to Home Landing page */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-white/20 backdrop-blur-md transition-all shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Landing Page
        </Link>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center relative z-10 my-12">
        
        {/* Left Hero Brand Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 hidden lg:flex flex-col justify-between p-10 rounded-3xl glass-panel-glowing border border-white/15 relative overflow-hidden min-h-[540px]"
        >
          <div>
            <div className="mb-8">
              <BrandLogo size="lg" to="/" />
            </div>

            <h2 className="text-3xl lg:text-4xl font-display font-black text-white leading-tight mb-4">
              Innovative <br />
              <span className="text-gradient-brand">AI Matching Platform</span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Skill vector matching powered by Jaccard similarity matrices, weighted candidate ranking, and instant enterprise hiring workflows.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Candidates</h4>
                  <p className="text-xs text-slate-400">1-Click Smart Apply & Profile Analytics</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Recruiters</h4>
                  <p className="text-xs text-slate-400">Automated Pipeline & Candidate Scoring</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="h-4 w-4" /> 99.8% AI Match Accuracy
            </span>
            <span className="font-mono">v2.0 Enterprise</span>
          </div>
        </motion.div>

        {/* Right Sign-In Form Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 glass-panel p-8 lg:p-10 border border-white/20 shadow-2xl relative"
        >
          <div className="text-center lg:text-left mb-6">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-black text-xl text-white">SmartJobs AI</span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-display font-black text-white tracking-tight">Sign In</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Access your intelligent candidate or employer dashboard</p>
          </div>

          {/* If login failed, show a helpful alert card to guide user to Create Account or use Demo */}
          {loginFailed && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2"
            >
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Account Not Registered or Invalid Password</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                If you are a new user, you must create an account first. Or use the 1-Click Demo buttons below!
              </p>
              <Link 
                to="/register" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 font-bold text-amber-300 text-xs transition-all mt-1"
              >
                <UserPlus className="h-3.5 w-3.5" /> Create New Account Now →
              </Link>
            </motion.div>
          )}

          {/* Role selector tabs */}
          <div className="flex bg-slate-950/70 p-1 rounded-2xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setRole('JOB_SEEKER')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'JOB_SEEKER'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" /> Candidate
            </button>

            <button
              type="button"
              onClick={() => setRole('RECRUITER')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'RECRUITER'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Recruiter
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                className={`glass-input ${errors.email ? 'border-rose-500' : ''}`}
                placeholder="name@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
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
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 animate-spin" /> Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 font-bold">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
              Create an Account
            </Link>
          </p>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 text-center mb-3">
              One-Click Demo Login Presets
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoLogins.map(d => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => {
                    setRole(d.role)
                    setForm({ email: d.email, password: d.password })
                    setLoginFailed(false)
                  }}
                  className={`text-xs py-2 px-2 rounded-xl border border-white/10 bg-gradient-to-r ${d.color} hover:border-white/30 transition-all font-bold shadow-sm cursor-pointer`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
