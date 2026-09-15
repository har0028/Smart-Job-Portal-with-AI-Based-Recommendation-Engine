import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/authApi'
import { Eye, EyeOff, ArrowRight, Zap, UserCheck, Briefcase, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import BrandLogo from '../../components/common/BrandLogo'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('JOB_SEEKER')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.fullName) e.fullName = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    
    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters long'
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(form.password)) {
      e.password = 'Must contain uppercase, lowercase, number & symbol (e.g. Password@123)'
    }

    if (role === 'RECRUITER' && !form.companyName) {
      e.companyName = 'Company name is required for recruiters'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = { ...form, role }
      await authApi.register(payload)
      toast.success('Registration successful! Logging you in...')
      
      const user = await login({ email: form.email, password: form.password })
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
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

      <div className="w-full max-w-xl glass-panel p-8 lg:p-10 border border-white/20 shadow-2xl relative z-10 my-12">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo size="lg" to="/" />
          </div>

          <h3 className="text-2xl font-display font-black text-white tracking-tight">Create Account</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Join the next-gen AI career matching ecosystem</p>
        </div>

        {/* Role tabs */}
        <div className="flex bg-slate-950/70 p-1 rounded-2xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => setRole('JOB_SEEKER')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'JOB_SEEKER'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="h-4 w-4" /> Candidate
          </button>

          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'RECRUITER'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="h-4 w-4" /> Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              className={`glass-input ${errors.fullName ? 'border-rose-500' : ''}`}
              placeholder="Alex Morgan"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
            />
            {errors.fullName && <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              className={`glass-input ${errors.email ? 'border-rose-500' : ''}`}
              placeholder="alex@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
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
                value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
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
            {errors.password ? (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">Requires 8+ chars with Uppercase, Lowercase, Number & Symbol (e.g. Password@123)</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
            {loading ? (
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-spin" /> Registering...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 font-bold">
                Create Account <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  )
}
