import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobApi } from '../../api/jobApi'
import { parseResumeFile, extractSkillsFromText, calculateJobMatch } from '../../utils/resumeParser'
import JobCard from './JobCard'
import { PageSpinner } from './Spinner'

import { 
  FileText, UploadCloud, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, 
  RefreshCw, Zap, Plus, X, Search, Award, Check, Layers, Cpu
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ResumeJobMatcher({ onApplyTrigger }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [file, setFile]                 = useState(null)
  const [parsing, setParsing]           = useState(false)
  const [resumeData, setResumeData]     = useState(null)
  const [allJobs, setAllJobs]           = useState([])
  const [matchedJobs, setMatchedJobs]   = useState([])
  const [loadingJobs, setLoadingJobs]   = useState(false)

  const [pasteMode, setPasteMode]       = useState(false)
  const [rawText, setRawText]           = useState('')
  const [customSkillInput, setCustomSkillInput] = useState('')

  // Load public jobs for matching
  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoadingJobs(true)
      try {
        const res = await jobApi.searchJobs({ page: 0, size: 20 })
        setAllJobs(res.data?.data?.content || [])
      } catch (err) {
        console.error('Failed to load jobs for resume matching:', err)
      } finally {
        setLoadingJobs(false)
      }
    }
    fetchAllJobs()
  }, [])

  // Re-calculate job matches whenever resumeData or extractedSkills change
  useEffect(() => {
    if (!resumeData || !resumeData.extractedSkills || allJobs.length === 0) return

    const scored = allJobs.map(job => {
      const match = calculateJobMatch(resumeData.extractedSkills, job)
      return {
        ...job,
        matchScore: match.matchPercentage,
        matchedSkillsList: match.matchedSkills,
        missingSkillsList: match.missingSkills
      }
    }).sort((a, b) => b.matchScore - a.matchScore)

    setMatchedJobs(scored)
  }, [resumeData, allJobs])

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setParsing(true)
    try {
      const data = await parseResumeFile(uploadedFile)
      setResumeData(data)
      toast.success(`Resume parsed! Extracted ${data.extractedSkills.length} core skills ✨`)
    } catch {
      toast.error('Failed to parse resume file')
    } finally {
      setParsing(false)
    }
  }

  const handlePasteSubmit = (e) => {
    e.preventDefault()
    if (!rawText.trim()) return
    setParsing(true)
    setTimeout(() => {
      const skills = extractSkillsFromText(rawText)
      setResumeData({
        fileName: 'Pasted Resume Text',
        extractedSkills: skills,
        yearsExperience: 3,
        textPreview: rawText.slice(0, 200)
      })
      setParsing(false)
      toast.success(`Extracted ${skills.length} skills from resume text! ✨`)
    }, 400)
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!customSkillInput.trim() || !resumeData) return
    const newSkills = Array.from(new Set([...resumeData.extractedSkills, customSkillInput.trim()]))
    setResumeData({ ...resumeData, extractedSkills: newSkills })
    setCustomSkillInput('')
    toast.success(`Added skill tag "${customSkillInput}"`)
  }

  const handleRemoveSkill = (skillToRemove) => {
    if (!resumeData) return
    const filtered = resumeData.extractedSkills.filter(s => s !== skillToRemove)
    setResumeData({ ...resumeData, extractedSkills: filtered })
  }

  const handleJobClick = (job) => {
    if (onApplyTrigger) {
      onApplyTrigger(job)
    } else if (!user) {
      toast.error('Please sign in or register to apply for jobs')
    } else if (user.role === 'JOB_SEEKER') {
      navigate(`/seeker/jobs/${job.id}`)
    }
  }

  return (
    <div className="w-full space-y-10">
      
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Instant AI Resume Parser & Matcher
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
          Upload Resume. Discover AI Matches.
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Our AI engine parses your resume, extracts your skill vectors, and ranks open positions based on mathematical Jaccard similarity.
        </p>
      </div>

      {/* Upload Box / Input Card */}
      <div className="saas-panel-glowing p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
        
        {/* Toggle Mode: File Upload vs Text Paste */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            type="button"
            onClick={() => setPasteMode(!pasteMode)}
            className="text-xs font-medium text-indigo-300 hover:text-white transition-colors"
          >
            {pasteMode ? '← Switch to File Upload' : 'Or Paste Resume Text directly →'}
          </button>
        </div>

        {!pasteMode ? (
          /* File Dropzone */
          <div className="relative border-2 border-dashed border-indigo-500/30 hover:border-indigo-400 bg-[#07090e]/80 rounded-2xl p-8 sm:p-10 text-center transition-all group">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.doc"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />

            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
              <div className="h-14 w-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                <UploadCloud className="h-7 w-7 text-indigo-400" />
              </div>

              <div>
                <p className="text-sm sm:text-base font-bold text-white">
                  Drop your Resume (PDF, DOCX, TXT) here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  or click to select file from your computer
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">PDF</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">DOCX</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">TXT</span>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>
        ) : (
          /* Paste Raw Resume Text */
          <form onSubmit={handlePasteSubmit} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Paste Resume Text / Summary
            </label>
            <textarea
              rows={5}
              className="glass-input resize-none"
              placeholder="Paste your resume content, experience summary, or technical skills list here..."
              value={rawText}
              onChange={e => setRawText(e.target.value)}
            />
            <button type="submit" disabled={!rawText.trim() || parsing} className="btn-primary text-xs w-full py-3 font-bold">
              {parsing ? 'Extracting Skills...' : 'Analyze Resume Text & Match Jobs'}
            </button>
          </form>
        )}

        {/* Parsing Loader State */}
        {parsing && (
          <div className="mt-6 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center space-y-3">
            <div className="flex justify-center">
              <Sparkles className="h-7 w-7 text-cyan-400 animate-spin" />
            </div>
            <p className="text-sm font-bold text-white">AI Parsing Resume & Vectorizing Skills...</p>
            <p className="text-xs text-indigo-300">Comparing your skill vectors against active open roles</p>
          </div>
        )}

        {/* Extracted Resume Summary & Skill Tags */}
        {resumeData && !parsing && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">{resumeData.fileName}</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30 font-semibold">
                  Parsed Successfully
                </span>
              </div>

              <button
                type="button"
                onClick={() => setResumeData(null)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset Resume
              </button>
            </div>

            {/* Extracted Skill Badges List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Extracted Skill Vectors ({resumeData.extractedSkills.length}):
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {resumeData.extractedSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/[0.1] text-indigo-200 text-xs font-medium"
                  >
                    <Check className="h-3 w-3 text-emerald-400" />
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-400 ml-1 text-slate-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add custom skill input */}
              <form onSubmit={handleAddSkill} className="mt-3 flex gap-2">
                <input
                  type="text"
                  className="glass-input text-xs py-2 px-3 flex-1"
                  placeholder="Add missing skill (e.g. AWS, Docker)..."
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                />
                <button type="submit" className="btn-secondary text-xs px-3 py-2 flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </form>
            </div>
          </motion.div>
        )}

      </div>

      {/* Matched Jobs Section */}
      {resumeData && !parsing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-4 max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="h-6 w-6 text-amber-400" />
                Matching Roles Found ({matchedJobs.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sorted by highest Jaccard Vector Match percentage based on your uploaded resume.
              </p>
            </div>
          </div>

          {loadingJobs ? (
            <PageSpinner />
          ) : matchedJobs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No matching jobs found. Try adding more skills above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedJobs.map(job => (
                <div key={job.id} className="relative group">
                  <JobCard
                    job={job}
                    actions={
                      <div className="w-full space-y-3">
                        {/* Matched skills highlight summary */}
                        {job.matchedSkillsList && job.matchedSkillsList.length > 0 && (
                          <div className="text-[11px] text-slate-300 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl">
                            <span className="font-bold text-emerald-400">Matched Skills:</span>{' '}
                            {job.matchedSkillsList.join(', ')}
                          </div>
                        )}

                        <button
                          onClick={() => handleJobClick(job)}
                          className="btn-primary text-xs w-full py-2.5 flex items-center justify-center gap-1.5 font-semibold"
                        >
                          View & Apply Position <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

    </div>
  )
}
