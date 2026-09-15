import { useEffect, useState } from 'react'
import { jobApi } from '../../api/jobApi'
import { JOB_TYPES } from '../../utils/constants'
import { X, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function JobForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: '', description: '', location: '', jobType: 'FULL_TIME',
    salaryRange: '', yearsExperienceRequired: 0, status: 'ACTIVE',
    expiresAt: '', skillIds: [], optionalSkillIds: [],
    ...initial,
  })
  const [allSkills, setAllSkills] = useState([])
  const [skillSearch, setSkillSearch] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    jobApi.getAllSkills().then(r => setAllSkills(r.data.data || []))
  }, [])

  const set = f => e => setForm({ ...form, [f]: e.target.value })

  const toggleSkill = (id, required) => {
    const field  = required ? 'skillIds' : 'optionalSkillIds'
    const other  = required ? 'optionalSkillIds' : 'skillIds'
    setForm(prev => {
      const inField = prev[field].includes(id)
      return {
        ...prev,
        [field]:  inField ? prev[field].filter(s => s !== id) : [...prev[field], id],
        [other]:  prev[other].filter(s => s !== id),
      }
    })
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (form.skillIds.length === 0) e.skillIds  = 'At least one required skill is needed for AI matching'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      ...form,
      yearsExperienceRequired: Number(form.yearsExperienceRequired),
      expiresAt: form.expiresAt || null,
    }
    onSubmit(payload)
  }

  const filteredSkills = allSkills.filter(s =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  )

  const Field = ({ label, name, type = 'text', placeholder, required: req }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
        {label}{req && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <input type={type} className={`glass-input ${errors[name] ? 'border-rose-500' : ''}`}
        placeholder={placeholder} value={form[name]} onChange={set(name)} />
      {errors[name] && <p className="text-xs text-rose-400 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Field label="Job Title" name="title" placeholder="e.g. Senior Full Stack Engineer" required />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Role Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={5}
            className={`glass-input resize-none ${errors.description ? 'border-rose-500' : ''}`}
            placeholder="Outline position responsibilities, team structure, and qualifications..."
            value={form.description}
            onChange={set('description')}
          />
          {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
        </div>

        <Field label="Location"       name="location"     placeholder="e.g. San Francisco, CA / Remote" />
        <Field label="Salary Range"   name="salaryRange"  placeholder="e.g. $140,000 - $180,000 USD" />
        <Field label="Required Experience (years)" name="yearsExperienceRequired" type="number" placeholder="0" />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Job Type</label>
          <select className="glass-input bg-slate-900" value={form.jobType} onChange={set('jobType')}>
            {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Status</label>
          <select className="glass-input bg-slate-900" value={form.status} onChange={set('status')}>
            <option value="ACTIVE">Active (Published)</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Expiration Date</label>
          <input type="datetime-local" className="glass-input text-slate-300" value={form.expiresAt || ''} onChange={set('expiresAt')} />
        </div>
      </div>

      {/* AI Vector Skills Selection */}
      <div className="pt-4 border-t border-white/10">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-brand-400" /> Required Skills Vector <span className="text-rose-400">*</span>
        </label>
        {errors.skillIds && <p className="text-xs text-rose-400 mb-2">{errors.skillIds}</p>}

        <input
          className="glass-input mb-3"
          placeholder="Filter skills from directory..."
          value={skillSearch}
          onChange={e => setSkillSearch(e.target.value)}
        />

        {/* Selected Skill Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {form.skillIds.map(id => {
            const s = allSkills.find(x => x.id === id)
            return s ? (
              <span key={id} className="flex items-center gap-1.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs px-3 py-1 rounded-xl font-semibold">
                {s.name}
                <button type="button" onClick={() => toggleSkill(id, true)}><X className="h-3.5 w-3.5 hover:text-white" /></button>
              </span>
            ) : null
          })}
          {form.optionalSkillIds.map(id => {
            const s = allSkills.find(x => x.id === id)
            return s ? (
              <span key={id} className="flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-white/10 text-xs px-3 py-1 rounded-xl">
                {s.name} (optional)
                <button type="button" onClick={() => toggleSkill(id, false)}><X className="h-3.5 w-3.5 hover:text-white" /></button>
              </span>
            ) : null
          })}
        </div>

        <div className="glass-panel max-h-56 overflow-y-auto p-2 border border-white/10 space-y-1">
          {filteredSkills.length === 0
            ? <p className="text-xs text-slate-400 text-center py-4">No skills match search query</p>
            : filteredSkills.map(s => {
                const isRequired = form.skillIds.includes(s.id)
                const isOptional = form.optionalSkillIds.includes(s.id)
                return (
                  <div key={s.id} className="flex items-center justify-between py-1.5 px-3 hover:bg-slate-900/60 rounded-xl transition-colors">
                    <span className="text-xs font-medium text-slate-200">{s.name}
                      {s.category && <span className="text-[10px] text-slate-400 ml-1.5">· {s.category}</span>}
                    </span>
                    <div className="flex gap-2">
                      <button type="button"
                        onClick={() => toggleSkill(s.id, true)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all ${
                          isRequired ? 'bg-brand-500/30 border-brand-500 text-brand-300 font-bold' : 'border-white/10 text-slate-400 hover:text-white'
                        }`}>
                        Required
                      </button>
                      <button type="button"
                        onClick={() => toggleSkill(s.id, false)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all ${
                          isOptional ? 'bg-slate-800 border-white/20 text-slate-200 font-bold' : 'border-white/10 text-slate-400 hover:text-white'
                        }`}>
                        Optional
                      </button>
                    </div>
                  </div>
                )
              })
          }
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button type="submit" disabled={loading} className="btn-primary text-xs px-8 py-2.5">
          {loading ? 'Saving Listing...' : 'Publish Position'}
        </button>
      </div>
    </form>
  )
}
