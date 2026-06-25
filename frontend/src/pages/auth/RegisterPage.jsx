import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BriefcaseIcon, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'JOB_SEEKER', label: 'Job Seeker' },
  { value: 'RECRUITER',  label: 'Recruiter / Employer' },
]

const Field = ({ label, type = 'text', placeholder, required, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      className={`input-field ${error ? 'border-red-400' : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', role: 'JOB_SEEKER',
    companyName: '', companyWebsite: '', designation: '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Min 8 characters'
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])/.test(form.password))
      e.password = 'Must contain uppercase, lowercase, digit and special character'
    if (form.role === 'RECRUITER' && !form.companyName.trim())
      e.companyName = 'Company name is required for recruiters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Account created! Welcome aboard.')
      if (user.role === 'RECRUITER') navigate('/recruiter/dashboard')
      else navigate('/seeker/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4">
            <BriefcaseIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join Smart Job Portal today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a…</label>
              <div className="flex gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors
                      ${form.role === r.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

{/*             <Field label="Full Name"  name="fullName" placeholder="John Doe" required /> */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Full Name <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    className="input-field"
    placeholder="John Doe"
    value={form.fullName}
    onChange={(e) =>
      setForm({ ...form, fullName: e.target.value })
    }
  />
</div>
            <Field
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={set('email')}
              error={errors.email}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min 8 chars with uppercase, digit & symbol"
                  value={form.password}
                  onChange={set('password')}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {form.role === 'RECRUITER' && (
              <>
                <Field
                  label="Company Name"
                  placeholder="Acme Corp"
                  required
                  value={form.companyName}
                  onChange={set('companyName')}
                  error={errors.companyName}
                />
                <Field
                  label="Company Website"
                  placeholder="https://acme.com"
                  value={form.companyWebsite}
                  onChange={set('companyWebsite')}
                  error={errors.companyWebsite}
                />
                <Field
                  label="Your Designation"
                  placeholder="HR Manager"
                  value={form.designation}
                  onChange={set('designation')}
                  error={errors.designation}
                />
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
