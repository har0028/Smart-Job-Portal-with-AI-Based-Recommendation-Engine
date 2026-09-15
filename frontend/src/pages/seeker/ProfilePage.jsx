import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { User, Save, FileText, MapPin, Phone, Briefcase, Sparkles, ShieldCheck, Crown, ArrowRight, Camera, Upload, Trash2, CheckCircle2 } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage } from '../../components/common/MotionContainer'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const AI_AVATARS = [
  { id: 'avatar-1', label: 'Cyber Tech', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: 'avatar-2', label: 'AI Engineer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 'avatar-3', label: 'Lead Architect', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { id: 'avatar-4', label: 'Code Ninja', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 'avatar-5', label: 'UI Specialist', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' },
  { id: 'avatar-6', label: 'Data Wizard', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80' },
]

export default function ProfilePage() {
  const { user, updateUserAvatar } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm]       = useState({ phone: '', location: '', bio: '', yearsExperience: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [errors, setErrors]   = useState({})
  const fileInputRef          = useRef(null)

  useEffect(() => {
    seekerApi.getProfile()
      .then(r => {
        const p = r.data.data
        setProfile(p)
        setForm({
          phone:           p.phone           || '',
          location:        p.location        || '',
          bio:             p.bio             || '',
          yearsExperience: p.yearsExperience || 0,
        })
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const validate = () => {
    const e = {}
    if (form.yearsExperience < 0 || form.yearsExperience > 50)
      e.yearsExperience = 'Experience must be between 0 and 50 years'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const res = await seekerApi.updateProfile(form)
      setProfile(res.data.data)
      toast.success('Professional profile vector saved successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WebP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      updateUserAvatar(reader.result)
      toast.success('Profile picture updated successfully!')
    }
    reader.readAsDataURL(file)
  }

  const handleSelectPreset = (url) => {
    updateUserAvatar(url)
    toast.success('AI Avatar preset applied!')
  }

  const handleRemoveAvatar = () => {
    updateUserAvatar(null)
    toast.success('Profile picture removed')
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  if (loading) return <PageSpinner />

  // Calculate profile completeness score
  const hasPhone = form.phone ? 20 : 0
  const hasLocation = form.location ? 20 : 0
  const hasBio = form.bio ? 20 : 0
  const hasExp = form.yearsExperience > 0 ? 20 : 10
  const hasAvatar = user?.avatar ? 20 : 0
  const completeness = hasPhone + hasLocation + hasBio + hasExp + hasAvatar

  const expTiers = [
    { label: '🌱 Junior (0-2 Yrs)', value: 2 },
    { label: '⚡ Mid-Level (3-5 Yrs)', value: 4 },
    { label: '🔥 Senior (6-9 Yrs)', value: 7 },
    { label: '👑 Lead / Architect (10+ Yrs)', value: 10 },
  ]

  return (
    <MotionPage className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageUpload} 
      />

      {/* Holographic Header Banner with Cyber Avatar */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glowing p-8 sm:p-10 relative overflow-hidden border border-white/20 shadow-2xl"
      >
        {/* Background Mesh Ambient VFX */}
        <div className="ambient-glow w-96 h-96 bg-indigo-600/30 -top-20 -left-20 animate-pulse-glow" />
        <div className="ambient-glow w-96 h-96 bg-purple-600/25 -bottom-20 -right-20 animate-pulse-glow" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
            {/* Interactive Avatar Container with Camera Overlay */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative shrink-0 cursor-pointer group"
              title="Click to change profile picture"
            >
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 p-1 shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-transform group-hover:scale-105">
                <div className="h-full w-full bg-slate-950 rounded-[22px] overflow-hidden flex items-center justify-center font-display font-black text-white text-3xl relative">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile Avatar" className="h-full w-full object-cover" />
                  ) : (
                    profile?.fullName?.charAt(0)
                  )}

                  {/* Hover Camera Overlay */}
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Camera className="h-6 w-6 text-indigo-400 animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-wider mt-1 text-indigo-200">Upload</span>
                  </div>
                </div>
              </div>

              <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-indigo-600 border-2 border-slate-950 shadow-[0_0_10px_#6366f1] flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <Camera className="h-3.5 w-3.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                  {profile?.fullName}
                </h1>
                {user?.isProUser ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <Crown className="h-3.5 w-3.5 text-amber-400 animate-bounce" /> VIP Pro Candidate
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Verified Seeker
                  </span>
                )}
              </div>
              
              <p className="text-xs font-semibold text-slate-400 font-mono">{profile?.email}</p>

              <div className="flex items-center gap-4 mt-3 text-xs text-slate-300 font-bold flex-wrap">
                <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-xl border border-white/10">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400" /> {form.location || 'Location Not Set'}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-xl border border-white/10">
                  <Briefcase className="h-3.5 w-3.5 text-cyan-400" /> {form.yearsExperience} Years Exp.
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile?.resumeUrl && (
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/${profile.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-xs font-extrabold flex items-center gap-2 py-3 px-5 shadow-lg"
                >
                  <FileText className="h-4 w-4 text-cyan-400" /> View Resume PDF
                </motion.button>
              </a>
            )}

            {!user?.isProUser && (
              <Link to="/seeker/pro-upgrade">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-glow text-xs font-black flex items-center gap-2 py-3 px-5 shadow-xl"
                >
                  <Crown className="h-4 w-4 text-amber-300" /> Get VIP Pass
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* AI Profile Vector Readiness Meter */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
            <h2 className="text-base font-black text-white font-display">AI Profile Vector Completeness</h2>
          </div>
          <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
            {completeness}% Complete
          </span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]"
          />
        </div>

        <p className="text-xs text-slate-400 mt-3 font-medium">
          A 100% complete profile increases your AI Job Match accuracy score by <strong className="text-emerald-400">up to 35%</strong>.
        </p>
      </motion.div>

      {/* Profile Picture Uploader & AI Avatar Presets Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-black font-display text-white tracking-tight flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-400" /> Profile Picture & AI Avatar Studio
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Upload your custom photo or choose a high-tech AI avatar preset</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-glow text-xs font-black py-2.5 px-4 flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Upload className="h-3.5 w-3.5" /> Upload Custom Photo
            </button>

            {user?.avatar && (
              <button
                onClick={handleRemoveAvatar}
                className="btn-secondary text-xs font-extrabold py-2.5 px-4 flex items-center gap-2 text-rose-400 hover:text-rose-300 border-rose-500/30 hover:border-rose-500/60 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* AI Avatar Presets Selection */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Quick Select AI Avatar Presets
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {AI_AVATARS.map((av) => {
              const isSelected = user?.avatar === av.url
              return (
                <motion.div
                  key={av.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectPreset(av.url)}
                  className={`relative p-2 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center group ${
                    isSelected 
                      ? 'bg-indigo-600/25 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]' 
                      : 'bg-slate-950/60 border-white/10 hover:border-white/30 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/20">
                    <img src={av.url} alt={av.label} className="h-full w-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/40 backdrop-blur-[1px] flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {av.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Profile Form Glass Panel with VFX */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 sm:p-10 border border-white/15 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-black font-display text-white tracking-tight flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" /> Edit Profile Attributes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Keep contact details, location, and bio updated for recruiters</p>
          </div>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-2.5 flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400" /> Phone Number
              </label>
              <input 
                className="glass-input py-3.5 text-sm font-semibold border-white/15 focus:border-indigo-500 shadow-inner" 
                placeholder="+91-9876543210" 
                value={form.phone} 
                onChange={set('phone')} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-2.5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" /> Current Location / City
              </label>
              <input 
                className="glass-input py-3.5 text-sm font-semibold border-white/15 focus:border-cyan-500 shadow-inner" 
                placeholder="Bangalore, Hyderabad, Remote..." 
                value={form.location} 
                onChange={set('location')} 
              />
            </div>
          </div>

          {/* Years of Experience Input & Tier Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-400" /> Years of Total Experience
              </span>
              <span className="text-emerald-400 font-mono font-black text-sm">{form.yearsExperience} Years</span>
            </label>
            
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap mb-3">
              <input
                type="number" min={0} max={50}
                className={`glass-input w-36 py-3 text-sm font-extrabold font-mono text-center ${errors.yearsExperience ? 'border-rose-500' : ''}`}
                value={form.yearsExperience}
                onChange={set('yearsExperience')}
              />

              {/* Preset Experience Tier Buttons */}
              <div className="flex flex-wrap gap-2">
                {expTiers.map(t => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setForm({ ...form, yearsExperience: t.value })}
                    className="text-xs font-extrabold px-3 py-2 rounded-xl border border-white/10 bg-slate-950/60 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-slate-300 transition-all cursor-pointer"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {errors.yearsExperience && <p className="text-xs text-rose-400 mt-1">{errors.yearsExperience}</p>}
          </div>

          {/* Professional Summary / Bio */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-400" /> Professional Summary & Tech Bio
              </span>
              <span className="text-[11px] font-mono text-slate-400">{form.bio.length} characters</span>
            </label>
            <textarea
              rows={4}
              className="glass-input resize-none py-3 text-sm font-medium leading-relaxed border-white/15 focus:border-purple-500 shadow-inner"
              placeholder="Highlight your core technical achievements, programming languages, framework expertise, and target career goals..."
              value={form.bio}
              onChange={set('bio')}
            />
          </div>

          {/* Form Action Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Link to="/seeker/skills" className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
                Update Skill Matrix <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={saving} 
              className="btn-glow text-xs font-black py-3.5 px-8 flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Updating Vector...' : 'Save Profile Changes'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </MotionPage>
  )
}
