import { useEffect, useState } from 'react'
import { 
  Star, Plus, Trash2, Search, Sparkles, Zap, ShieldCheck, Flame, 
  Layers, Code2, Cpu, CheckCircle2, Sliders, TrendingUp, RefreshCw, X 
} from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import { jobApi } from '../../api/jobApi'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { PROFICIENCY_LABELS } from '../../utils/constants'
import { MotionPage } from '../../components/common/MotionContainer'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// Tech Stack Preset Bundles for quick 1-click addition
const TECH_STACK_PRESETS = [
  {
    title: '⚡ Java Enterprise Specialist',
    role: 'Backend Engineer',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'Docker'],
    gradient: 'from-amber-500/20 via-orange-500/10 to-red-500/20',
    border: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    title: '⚛️ Modern Web Frontend',
    role: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'Tailwind CSS'],
    gradient: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/20',
    border: 'border-cyan-500/30',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  },
  {
    title: '🤖 AI & Data Science',
    role: 'AI Engineer',
    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow'],
    gradient: 'from-purple-500/20 via-pink-500/10 to-indigo-500/20',
    border: 'border-purple-500/30',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  {
    title: '☁️ Cloud & DevOps Ninja',
    role: 'DevOps Architect',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD'],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    border: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  }
]

export default function SkillManagement() {
  const [mySkills, setMySkills]       = useState([])
  const [allSkills, setAllSkills]     = useState([])
  const [search, setSearch]           = useState('')
  const [selectedCategory, setCategory]= useState('ALL')
  const [loading, setLoading]         = useState(true)
  const [adding, setAdding]           = useState(null)
  const [removing, setRemoving]       = useState(null)
  const [updatingId, setUpdatingId]   = useState(null)
  const [proficiency, setProficiency] = useState({})

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = () => {
    setLoading(true)
    Promise.all([seekerApi.getMySkills(), jobApi.getAllSkills()])
      .then(([mine, all]) => {
        setMySkills(mine.data.data || [])
        setAllSkills(all.data.data || [])
      })
      .catch(() => toast.error('Failed to load skills vector matrix'))
      .finally(() => setLoading(false))
  }

  const mySkillIds = new Set(mySkills.map(s => s.skillId))

  // Categories extraction
  const categories = ['ALL', ...Array.from(new Set(allSkills.map(s => s.category).filter(Boolean)))]

  // Directory Filtering
  const availableSkills = allSkills.filter(s => {
    const notAdded = !mySkillIds.has(s.id)
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.category && s.category.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory
    return notAdded && matchesSearch && matchesCategory
  })

  // Add individual skill
  const handleAdd = async (skill, customLevel) => {
    const level = customLevel || proficiency[skill.id] || 3
    setAdding(skill.id)
    try {
      const res = await seekerApi.addSkill({ skillId: skill.id, proficiencyLevel: level })
      setMySkills(prev => [...prev, res.data.data])
      toast.success(`⚡ ${skill.name} added to your AI vector!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill')
    } finally {
      setAdding(null)
    }
  }

  // Add entire stack preset
  const handleAddPreset = async (preset) => {
    const skillsToAdd = allSkills.filter(s => preset.skills.includes(s.name) && !mySkillIds.has(s.id))
    if (skillsToAdd.length === 0) {
      toast.info('All skills in this preset are already added!')
      return
    }

    const toastId = toast.loading(`Adding ${skillsToAdd.length} skills from ${preset.title}...`)
    try {
      for (const skill of skillsToAdd) {
        const res = await seekerApi.addSkill({ skillId: skill.id, proficiencyLevel: 4 })
        setMySkills(prev => [...prev, res.data.data])
      }
      toast.success(`Stack added! ${skillsToAdd.length} new skill vectors configured.`, { id: toastId })
    } catch {
      toast.error('Partial failure adding stack skills', { id: toastId })
    }
  }

  // Level Update (Increment / Decrement)
  const handleLevelChange = async (skillItem, newLevel) => {
    if (newLevel < 1 || newLevel > 5) return
    setUpdatingId(skillItem.skillId)
    try {
      await seekerApi.addSkill({ skillId: skillItem.skillId, proficiencyLevel: newLevel })
      setMySkills(prev => prev.map(s => s.skillId === skillItem.skillId ? { ...s, proficiencyLevel: newLevel } : s))
      toast.success(`${skillItem.skillName} level updated to ${PROFICIENCY_LABELS[newLevel]}`)
    } catch {
      toast.error('Failed to update proficiency level')
    } finally {
      setUpdatingId(null)
    }
  }

  // Remove skill
  const handleRemove = async (skillId, skillName) => {
    setRemoving(skillId)
    try {
      await seekerApi.removeSkill(skillId)
      setMySkills(prev => prev.filter(s => s.skillId !== skillId))
      toast.success(`${skillName || 'Skill'} removed from matrix`)
    } catch {
      toast.error('Failed to remove skill')
    } finally {
      setRemoving(null)
    }
  }

  if (loading) return <PageSpinner />

  // Vector Completeness & Power Index Calculation
  const totalProficiencySum = mySkills.reduce((acc, curr) => acc + (curr.proficiencyLevel || 1), 0)
  const maxPossible = Math.max(mySkills.length * 5, 1)
  const vectorPowerScore = Math.min(Math.round((mySkills.length * 10) + (totalProficiencySum * 4)), 100)

  return (
    <MotionPage className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Cyber Hero Banner with Holographic VFX */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glowing p-8 sm:p-10 relative overflow-hidden border border-white/20 shadow-2xl"
      >
        <div className="ambient-glow w-96 h-96 bg-indigo-600/30 -top-20 -left-20 animate-pulse-glow" />
        <div className="ambient-glow w-96 h-96 bg-cyan-600/25 -bottom-20 -right-20 animate-pulse-glow" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Zap className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>AI Vector Engine v2.0</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              My Skill Matrix & Vector Studio
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Train your candidate skill vector matrix to maximize Jaccard similarity scoring across top recruiters and automated AI job matching algorithms.
            </p>
          </div>

          {/* Vector Power Card Telemetry */}
          <div className="shrink-0 glass-panel p-5 border border-white/20 bg-slate-950/80 rounded-2xl min-w-[240px] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-400" /> Vector Power
              </span>
              <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {vectorPowerScore}/100
              </span>
            </div>

            {/* Glowing Score Bar */}
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${vectorPowerScore}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>Configured Vectors: <strong className="text-white font-mono">{mySkills.length} Skills</strong></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Vector Skills Grid Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-black font-display text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" /> Active Vector Skills ({mySkills.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Skills currently active in your AI matching matrix</p>
          </div>

          <span className="text-xs font-mono font-extrabold text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-500/30">
            Weighted Jaccard Active
          </span>
        </div>

        {mySkills.length === 0 ? (
          <EmptyState 
            icon={Star} 
            title="No Skills Added Yet" 
            description="Explore the directory below or use our 1-Click Tech Stack Presets to build your profile matrix." 
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {mySkills.map(s => {
                const level = s.proficiencyLevel || 1
                return (
                  <motion.div 
                    key={s.id || s.skillId}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel-glowing p-4 border border-white/15 bg-slate-950/70 rounded-2xl flex flex-col justify-between space-y-3 group hover:border-indigo-500/40 transition-all shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                          <Code2 className="h-4 w-4 text-cyan-400" /> {s.skillName}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 font-mono mt-0.5 block">
                          Level {level} of 5
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemove(s.skillId, s.skillName)}
                        disabled={removing === s.skillId}
                        className="p-1.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                        title="Remove Skill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Star Rating & Level Increment Controls */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star}
                            className={`h-3.5 w-3.5 cursor-pointer transition-transform hover:scale-125 ${
                              star <= level 
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
                                : 'text-slate-700'
                            }`}
                            onClick={() => handleLevelChange(s, star)}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => handleLevelChange(s, level - 1)}
                          disabled={level <= 1 || updatingId === s.skillId}
                          className="text-xs font-black text-slate-400 hover:text-white px-1 disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-mono font-bold text-indigo-300 px-1">
                          {PROFICIENCY_LABELS[level] || `L${level}`}
                        </span>
                        <button
                          onClick={() => handleLevelChange(s, level + 1)}
                          disabled={level >= 5 || updatingId === s.skillId}
                          className="text-xs font-black text-slate-400 hover:text-white px-1 disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* 1-Click Tech Stack Presets Studio */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-black font-display text-white tracking-tight flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-400" /> 1-Click AI Tech Stack Presets
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Add complete industry-standard tech stack skill bundles in one click</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TECH_STACK_PRESETS.map((preset) => (
            <motion.div
              key={preset.title}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${preset.gradient} border ${preset.border} shadow-xl flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-black text-white font-display">{preset.title}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${preset.badgeColor}`}>
                    {preset.role}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {preset.skills.map(sk => {
                    const isAdded = mySkills.some(m => m.skillName === sk)
                    return (
                      <span 
                        key={sk} 
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 ${
                          isAdded 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                            : 'bg-slate-950/60 text-slate-300 border-white/10'
                        }`}
                      >
                        {isAdded && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                        {sk}
                      </span>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={() => handleAddPreset(preset)}
                className="btn-glow text-xs font-black py-2.5 px-4 w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Plus className="h-4 w-4" /> Add Full Tech Stack
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Directory Skill Search & Interactive Catalog */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-black font-display text-white tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" /> Skill Directory Catalog
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Search and select individual skills with customized proficiency levels</p>
          </div>

          {/* Search Box with Clear Button */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="glass-input pl-10 pr-9 py-2.5 text-xs font-semibold"
              placeholder="Search skills (Java, React, AWS...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                  : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Available Skill Rows */}
        {availableSkills.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Cpu className="h-10 w-10 text-slate-600 mx-auto animate-bounce" />
            <p className="text-xs font-semibold text-slate-400">
              {search ? `No skills matching "${search}" in catalog` : 'All skills in this directory category have been added to your profile!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {availableSkills.map(skill => (
              <div 
                key={skill.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all flex-wrap gap-3 group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 font-bold group-hover:border-indigo-500/40">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">{skill.name}</h4>
                    {skill.category && (
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {skill.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Proficiency Selector Dropdown */}
                  <select
                    className="text-xs bg-slate-900 border border-white/15 text-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
                    value={proficiency[skill.id] || 3}
                    onChange={e => setProficiency({ ...proficiency, [skill.id]: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(l => (
                      <option key={l} value={l}>Level {l} - {PROFICIENCY_LABELS[l]}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleAdd(skill)}
                    disabled={adding === skill.id}
                    className="btn-glow text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {adding === skill.id ? 'Adding...' : 'Add Skill'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </MotionPage>
  )
}
