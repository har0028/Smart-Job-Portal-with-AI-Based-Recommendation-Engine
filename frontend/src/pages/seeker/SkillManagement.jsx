import { useEffect, useState } from 'react'
import { Star, Plus, Trash2, Search } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import { jobApi } from '../../api/jobApi'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { PROFICIENCY_LABELS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function SkillManagement() {
  const [mySkills, setMySkills]   = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [adding, setAdding]       = useState(null)   // skillId being added
  const [removing, setRemoving]   = useState(null)   // skillId being removed
  const [proficiency, setProficiency] = useState({}) // skillId -> level

  useEffect(() => {
    Promise.all([seekerApi.getMySkills(), jobApi.getAllSkills()])
      .then(([mine, all]) => {
        setMySkills(mine.data.data || [])
        setAllSkills(all.data.data || [])
      })
      .catch(() => toast.error('Failed to load skills'))
      .finally(() => setLoading(false))
  }, [])

  const mySkillIds = new Set(mySkills.map(s => s.skillId))

  const availableSkills = allSkills.filter(s =>
    !mySkillIds.has(s.id) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (skill) => {
    const level = proficiency[skill.id] || 1
    setAdding(skill.id)
    try {
      const res = await seekerApi.addSkill({ skillId: skill.id, proficiencyLevel: level })
      setMySkills(prev => [...prev, res.data.data])
      toast.success(`${skill.name} added!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill')
    } finally {
      setAdding(null)
    }
  }

  const handleRemove = async (skillId) => {
    setRemoving(skillId)
    try {
      await seekerApi.removeSkill(skillId)
      setMySkills(prev => prev.filter(s => s.skillId !== skillId))
      toast.success('Skill removed')
    } catch {
      toast.error('Failed to remove skill')
    } finally {
      setRemoving(null)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add skills that match your expertise — they power the AI recommendation engine
        </p>
      </div>

      {/* Current skills */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Current Skills ({mySkills.length})
        </h2>
        {mySkills.length === 0 ? (
          <EmptyState icon={Star} title="No skills added yet" description="Add skills below to improve your job recommendations." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {mySkills.map(s => (
              <div key={s.id}
                className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full pl-3 pr-2 py-1.5">
                <span className="text-sm font-medium text-primary-700">{s.skillName}</span>
                <span className="text-xs text-primary-500">
                  {PROFICIENCY_LABELS[s.proficiencyLevel] || 'L' + s.proficiencyLevel}
                </span>
                <button
                  onClick={() => handleRemove(s.skillId)}
                  disabled={removing === s.skillId}
                  className="p-0.5 rounded-full hover:bg-primary-200 text-primary-500 hover:text-primary-700 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add skills */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Add Skills</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Search skills to add..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {availableSkills.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            {search ? 'No matching skills found' : 'All available skills already added!'}
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {availableSkills.map(skill => (
              <div key={skill.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{skill.name}</p>
                  {skill.category && <p className="text-xs text-gray-400">{skill.category}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <select
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-400"
                    value={proficiency[skill.id] || 1}
                    onChange={e => setProficiency({ ...proficiency, [skill.id]: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(l => (
                      <option key={l} value={l}>{PROFICIENCY_LABELS[l]}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAdd(skill)}
                    disabled={adding === skill.id}
                    className="flex items-center gap-1 text-xs btn-primary py-1.5 px-3"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {adding === skill.id ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
