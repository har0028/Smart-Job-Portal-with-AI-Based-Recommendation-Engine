import { useEffect, useState } from 'react'
import { jobApi } from '../../api/jobApi'
import { JOB_TYPES } from '../../utils/constants'
import { X } from 'lucide-react'
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
    if (form.skillIds.length === 0) e.skillIds  = 'At least one required skill needed'
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{req && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input type={type} className={`input-field ${errors[name] ? 'border-red-400' : ''}`}
        placeholder={placeholder} value={form[name]} onChange={set(name)} />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Field label="Job Title" name="title" placeholder="e.g. Senior Java Developer" required />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
            placeholder="Describe the role, responsibilities, and requirements…"
            value={form.description}
            onChange={set('description')}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        <Field label="Location"       name="location"     placeholder="e.g. Bangalore / Remote" />
        <Field label="Salary Range"   name="salaryRange"  placeholder="e.g. 15-25 LPA" />
        <Field label="Min Experience (years)" name="yearsExperienceRequired" type="number" placeholder="0" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
          <select className="input-field" value={form.jobType} onChange={set('jobType')}>
            {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select className="input-field" value={form.status} onChange={set('status')}>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
          <input type="datetime-local" className="input-field" value={form.expiresAt || ''} onChange={set('expiresAt')} />
        </div>
      </div>

      {/* Skills selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills <span className="text-red-500">*</span>
        </label>
        {errors.skillIds && <p className="text-xs text-red-500 mb-2">{errors.skillIds}</p>}

        <input
          className="input-field mb-3"
          placeholder="Search skills…"
          value={skillSearch}
          onChange={e => setSkillSearch(e.target.value)}
        />

        {/* Selected skills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {form.skillIds.map(id => {
            const s = allSkills.find(x => x.id === id)
            return s ? (
              <span key={id} className="flex items-center gap-1 bg-primary-100 text-primary-700 text-xs px-2.5 py-1 rounded-full">
                {s.name}
                <button type="button" onClick={() => toggleSkill(id, true)}><X className="h-3 w-3" /></button>
              </span>
            ) : null
          })}
          {form.optionalSkillIds.map(id => {
            const s = allSkills.find(x => x.id === id)
            return s ? (
              <span key={id} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                {s.name} (optional)
                <button type="button" onClick={() => toggleSkill(id, false)}><X className="h-3 w-3" /></button>
              </span>
            ) : null
          })}
        </div>

        <div className="border border-gray-200 rounded-lg max-h-52 overflow-y-auto p-2">
          {filteredSkills.length === 0
            ? <p className="text-xs text-gray-400 text-center py-4">No skills found</p>
            : filteredSkills.map(s => {
                const isRequired = form.skillIds.includes(s.id)
                const isOptional = form.optionalSkillIds.includes(s.id)
                return (
                  <div key={s.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{s.name}
                      {s.category && <span className="text-xs text-gray-400 ml-1">· {s.category}</span>}
                    </span>
                    <div className="flex gap-2">
                      <button type="button"
                        onClick={() => toggleSkill(s.id, true)}
                        className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                          isRequired ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-400 hover:text-primary-600'
                        }`}>
                        Required
                      </button>
                      <button type="button"
                        onClick={() => toggleSkill(s.id, false)}
                        className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                          isOptional ? 'bg-gray-200 text-gray-700 font-medium' : 'text-gray-400 hover:text-gray-600'
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

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary px-8">
          {loading ? 'Saving…' : 'Save Job'}
        </button>
      </div>
    </form>
  )
}
