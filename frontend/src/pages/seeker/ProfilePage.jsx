import { useEffect, useState } from 'react'
import { User, Save } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import { PageSpinner } from '../../components/common/Spinner'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [form, setForm]       = useState({ phone: '', location: '', bio: '', yearsExperience: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [errors, setErrors]   = useState({})

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
      e.yearsExperience = 'Experience must be between 0 and 50'
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
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Keep your profile up to date for better recommendations</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-2xl bg-primary-100 flex items-center justify-center">
            <User className="h-7 w-7 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{profile?.fullName}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
          </div>
        </div>
        {profile?.resumeUrl && (
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/${profile.resumeUrl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:underline"
          >
            View uploaded resume
          </a>
        )}
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Edit Details</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className="input-field" placeholder="+91-9876543210" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input className="input-field" placeholder="Bangalore, India" value={form.location} onChange={set('location')} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number" min={0} max={50}
              className={`input-field w-32 ${errors.yearsExperience ? 'border-red-400' : ''}`}
              value={form.yearsExperience}
              onChange={set('yearsExperience')}
            />
            {errors.yearsExperience && <p className="text-xs text-red-500 mt-1">{errors.yearsExperience}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={4}
              className="input-field resize-none"
              placeholder="Tell recruiters about yourself..."
              value={form.bio}
              onChange={set('bio')}
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
