import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobApi } from '../../api/jobApi'
import PublicNavbar from '../../components/common/PublicNavbar'
import AuthModal from '../../components/auth/AuthModal'
import JobCard from '../../components/common/JobCard'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import ResumeJobMatcher from '../../components/common/ResumeJobMatcher'
import CompanyLogo from '../../components/common/CompanyLogo'
import BrandLogo from '../../components/common/BrandLogo'

import { 
  Sparkles, Search, MapPin, Briefcase, Bot, ShieldCheck, Zap, ArrowRight, 
  TrendingUp, Users, Building2, Award, CheckCircle2, Star, ChevronDown, 
  ChevronUp, SlidersHorizontal, ArrowUpRight, Cpu, Layers, BarChart3, HelpCircle,
  FileCheck, Target, HeartHandshake, Check, UserCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab]   = useState('seeker')
  const [authModalPrompt, setAuthModalPrompt] = useState(null)

  // Live Job Feed State
  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [filters, setFilters] = useState({ keyword: '', location: '', jobType: '' })
  const [selectedSkill, setSelectedSkill] = useState(null)

  // Interactive AI Match Simulator State
  const [simulatedSkills, setSimulatedSkills] = useState(['React.js', 'Spring Boot', 'TypeScript'])
  const availableSkills = ['React.js', 'Spring Boot', 'TypeScript', 'Docker', 'Python', 'PostgreSQL', 'AWS', 'GraphQL']

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0)

  // Fetch initial public jobs
  useEffect(() => {
    const fetchPublicJobs = async () => {
      setLoadingJobs(true)
      try {
        const res = await jobApi.searchJobs({ page: 0, size: 6 })
        setJobs(res.data?.data?.content || [])
      } catch (err) {
        console.error('Failed to load jobs feed:', err)
      } finally {
        setLoadingJobs(false)
      }
    }
    fetchPublicJobs()
  }, [])

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    setLoadingJobs(true)
    try {
      const res = await jobApi.searchJobs({
        keyword: filters.keyword || undefined,
        location: filters.location || undefined,
        jobType: filters.jobType || undefined,
        page: 0,
        size: 6
      })
      setJobs(res.data?.data?.content || [])
      // Scroll smoothly to jobs feed
      const jobsElem = document.getElementById('jobs-feed')
      if (jobsElem) jobsElem.scrollIntoView({ behavior: 'smooth' })
    } catch {
      toast.error('Failed to search jobs')
    } finally {
      setLoadingJobs(false)
    }
  }

  const handleOpenAuthModal = (tab = 'seeker', promptMsg = null) => {
    setAuthModalTab(tab)
    setAuthModalPrompt(promptMsg)
    setAuthModalOpen(true)
  }

  const handleApplyClick = (job) => {
    if (!user) {
      handleOpenAuthModal('seeker', `Sign in or create an account to apply for "${job.title}" at ${job.companyName}`)
    } else if (user.role === 'JOB_SEEKER') {
      navigate(`/seeker/jobs/${job.id}`)
    } else {
      toast.error('Please log in with a Job Seeker account to apply for jobs.')
    }
  }

  const toggleSimulatedSkill = (skill) => {
    if (simulatedSkills.includes(skill)) {
      setSimulatedSkills(simulatedSkills.filter(s => s !== skill))
    } else {
      setSimulatedSkills([...simulatedSkills, skill])
    }
  }

  // Calculate simulated match score
  const targetRequired = ['React.js', 'Spring Boot', 'TypeScript', 'Docker', 'PostgreSQL']
  const intersection = simulatedSkills.filter(s => targetRequired.includes(s)).length
  const union = new Set([...simulatedSkills, ...targetRequired]).size
  const simScore = Math.round((intersection / union) * 100)

  const faqs = [
    {
      q: "How does the AI Resume & Skill Matching Engine work?",
      a: "SmartJobs AI utilizes advanced mathematical vector similarity algorithms (Jaccard Index combined with weighted skill relevance). It parses your verified skill profile against employer requirements to compute a real-time match precision score (e.g., 94% Vector Match)."
    },
    {
      q: "Can I explore and apply for jobs without paying any fees?",
      a: "Yes! SmartJobs AI is 100% free for job seekers. You can browse thousands of verified openings, save positions, and apply with 1-click intelligent resume submission."
    },
    {
      q: "How do recruiters post jobs and evaluate candidates?",
      a: "Recruiters access a dedicated Command Center dashboard where they can create targeted job postings, define skill vectors, and instantly receive automatically ranked candidates sorted by AI match percentage."
    },
    {
      q: "Is my personal data and application history private?",
      a: "Absolutely. We enforce enterprise-grade JWT encryption and strict data protection policies. Your profile is only shared with hiring teams when you explicitly submit an application."
    }
  ]

  const topCompanies = [
    { name: 'Google' },
    { name: 'Microsoft' },
    { name: 'Amazon' },
    { name: 'Meta' },
    { name: 'Apple' },
    { name: 'Netflix' },
    { name: 'Spotify' },
    { name: 'Uber' },
    { name: 'Airbnb' },
    { name: 'Nvidia' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Public Navbar Header */}
      <PublicNavbar onOpenAuth={handleOpenAuthModal} />

      {/* Innovative Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
        promptContext={authModalPrompt}
      />

      {/* ========================================== */}
      {/* 1. HERO SECTION (BIG TYPOGRAPHY & VFX)    */}
      {/* ========================================== */}
      <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Glowing Orbs Background */}
        <div className="ambient-glow w-[600px] h-[600px] bg-indigo-600/20 -top-32 -left-32 animate-pulse-glow" />
        <div className="ambient-glow w-[700px] h-[700px] bg-purple-600/20 top-20 -right-40 animate-pulse-glow" />
        <div className="ambient-glow w-[500px] h-[500px] bg-cyan-600/15 bottom-0 left-1/3 animate-pulse-glow" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Top Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md shadow-lg shadow-indigo-500/10"
            >
              <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
              <span>Next-Gen AI Job Matching Engine v2.0 Active</span>
              <span className="bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full text-[11px] font-bold">99.8% Precision</span>
            </motion.div>

            {/* BIG BOLD HERO HEADLINE */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight leading-[1.08] mb-8 text-white"
            >
              Where Talent Meets <br className="hidden sm:inline" />
              <span className="text-gradient-brand">Intelligent Career Match.</span>
            </motion.h1>

            {/* SUBTITLE */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10"
            >
              Revolutionizing recruitment with <strong className="text-white font-semibold">Jaccard vector scoring</strong>, 1-click smart job applications, and automated recruiter candidate ranking.
            </motion.p>

            {/* Hero Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-16"
            >
              <a
                href="#jobs-feed"
                className="btn-glow text-base px-8 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-2xl shadow-indigo-500/30"
              >
                <Search className="h-5 w-5" /> Explore Open Roles Now
              </a>

              <button
                onClick={() => handleOpenAuthModal('recruiter')}
                className="btn-secondary text-base px-7 py-4 rounded-2xl flex items-center gap-2.5 font-bold"
              >
                <Briefcase className="h-5 w-5 text-cyan-400" /> Employer? Post Jobs
              </button>
            </motion.div>

            {/* Hero Interactive Quick Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="glass-panel-glowing p-4 sm:p-6 max-w-4xl mx-auto shadow-2xl shadow-indigo-500/20 border border-white/20"
            >
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="relative sm:col-span-5">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                  <input
                    type="text"
                    className="glass-input pl-12 py-3.5 text-sm sm:text-base font-medium"
                    placeholder="Job title, skills (e.g. React, Java, AI)..."
                    value={filters.keyword}
                    onChange={e => setFilters({ ...filters, keyword: e.target.value })}
                  />
                </div>

                <div className="relative sm:col-span-4">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
                  <input
                    type="text"
                    className="glass-input pl-12 py-3.5 text-sm sm:text-base font-medium"
                    placeholder="Location or Remote..."
                    value={filters.location}
                    onChange={e => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="btn-primary w-full h-full py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 rounded-xl"
                  >
                    <Search className="h-5 w-5" /> Search Jobs
                  </button>
                </div>
              </form>

              {/* Popular Tags */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Trending Searches:</span>
                {['Full Stack Engineer', 'Frontend React', 'Java Developer', 'Data Scientist', 'Remote Jobs'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setFilters({ ...filters, keyword: tag })
                      handleSearchSubmit({ preventDefault: () => {} })
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:text-white transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Live Floating Feature Stats Badges */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center">
                <p className="text-2xl sm:text-3xl font-display font-black text-white">50,000+</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Verified Open Roles</p>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center">
                <p className="text-2xl sm:text-3xl font-display font-black text-emerald-400">98.4%</p>
                <p className="text-xs text-slate-400 font-medium mt-1">AI Match Score Accuracy</p>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center">
                <p className="text-2xl sm:text-3xl font-display font-black text-cyan-400">12,500+</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Enterprise Employers</p>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/10 text-center">
                <p className="text-2xl sm:text-3xl font-display font-black text-purple-400">&lt; 24 hrs</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Avg Application Review</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. TOP COMPANIES MARQUEE TICKER            */}
      {/* ========================================== */}
      <section className="py-10 border-y border-white/10 bg-slate-900/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Trusted by Hiring Teams at World-Class Tech Leaders
          </p>
        </div>

        <div className="flex overflow-hidden relative">
          <div className="animate-marquee flex gap-8 items-center shrink-0">
            {[...topCompanies, ...topCompanies].map((comp, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shrink-0 hover:border-indigo-500/40 transition-all group"
              >
                <CompanyLogo name={comp.name} className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="font-display font-bold text-white text-base tracking-tight">{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2.5 INSTANT RESUME JOB MATCHER SECTION    */}
      {/* ========================================== */}
      <section id="resume-matcher" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <ResumeJobMatcher onApplyTrigger={handleApplyClick} />
      </section>

      {/* ========================================== */}
      {/* 3. LIVE EXPLORE JOBS FEED SECTION          */}
      {/* ========================================== */}
      <section id="jobs-feed" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Zap className="h-3.5 w-3.5" /> Live Job Openings
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              Explore Featured Open Positions
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Click any position to review details or apply instantly with AI resume matching.
            </p>
          </div>

          <button
            onClick={() => handleOpenAuthModal('seeker')}
            className="btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 shrink-0"
          >
            <span>View All 50,000+ Jobs</span>
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </button>
        </div>

        {/* Jobs Grid */}
        {loadingJobs ? (
          <PageSpinner />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No open positions match your search"
            description="Try clearing your filters or searching for different keywords like 'React', 'Java', or 'Remote'."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                actions={
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="btn-primary text-xs w-full py-2.5 flex items-center justify-center gap-1.5 font-bold"
                  >
                    View & Apply <ArrowUpRight className="h-4 w-4" />
                  </button>
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* ========================================== */}
      {/* 4. SCROLLABLE FEATURE 1: AI MATCH ENGINE  */}
      {/* ========================================== */}
      <section id="ai-features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="ambient-glow w-96 h-96 bg-indigo-600/15 top-1/2 -left-20" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Bot className="h-4 w-4 text-purple-400" /> Mathematical Jaccard Vector Engine
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
              Instant Precision Scoring <br />
              <span className="text-gradient-violet">Powered by AI Algorithms.</span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Say goodbye to black-box keyword filtering. SmartJobs AI calculates exact mathematical vector overlap between candidate skills and job requirements using weighted Jaccard similarity metrics:
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 font-mono text-xs text-indigo-300 space-y-1 shadow-inner">
              <p className="text-slate-400">// Vector Similarity Formula</p>
              <p className="text-white font-bold">Similarity(Candidate, Job) = |Candidate_Skills ∩ Job_Skills| / |Candidate_Skills ∪ Job_Skills|</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mt-1">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Weighted Skill Multipliers</h4>
                  <p className="text-xs text-slate-400">Core required skills receive 2x weight boost over bonus skills.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 mt-1">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Experience Decay Factor</h4>
                  <p className="text-xs text-slate-400">Senior roles dynamically weigh years of industry experience alongside skill tags.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive AI Simulator Widget */}
          <div className="lg:col-span-6 glass-panel-glowing p-6 sm:p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
                <span className="font-display font-bold text-white text-base">Live AI Match Simulator</span>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-mono font-bold">Interactive</span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Toggle candidate skills below to test the live Jaccard vector match calculation against a target Senior Engineer role:
            </p>

            {/* Target Job Skill Requirement */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Target Job Requirements (5 Required):</span>
              <div className="flex flex-wrap gap-2">
                {targetRequired.map(req => (
                  <span key={req} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 font-semibold">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Candidate Skill Selector */}
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Your Candidate Profile Skills:</span>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => {
                  const active = simulatedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSimulatedSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}{skill}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Simulated Result Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 text-center relative overflow-hidden">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-1">Calculated AI Match Gauge</p>
              <div className="text-5xl font-display font-black text-white my-2 flex items-center justify-center gap-2">
                <span className={simScore >= 75 ? 'text-emerald-400' : simScore >= 50 ? 'text-cyan-400' : 'text-amber-400'}>
                  {simScore}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden my-3 border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${simScore}%` }}
                  transition={{ duration: 0.4 }}
                  className={`h-full rounded-full ${
                    simScore >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                    simScore >= 50 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                    'bg-gradient-to-r from-amber-500 to-rose-500'
                  }`}
                />
              </div>

              <p className="text-xs text-slate-300 mt-2">
                {simScore >= 75 ? '🎉 Strong Candidate Match! Recommended for immediate interview.' :
                 simScore >= 50 ? '⚡ Partial Skill Match. Consider adding complementary skills.' :
                 '⚠️ Low Similarity Score. Explore roles with matching skill tags.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 5. SCROLLABLE FEATURE 2: RECRUITER HUD     */}
      {/* ========================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="glass-panel p-8 sm:p-12 border border-white/15 relative overflow-hidden">
          <div className="ambient-glow w-96 h-96 bg-cyan-600/15 bottom-0 right-0" />

          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Briefcase className="h-4 w-4" /> Recruiter Command Center
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight">
                Streamline Hiring with <br />
                <span className="text-gradient-brand">Automated Candidate Ranking.</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Recruiters can post jobs in minutes and let our intelligent ranking pipeline categorize incoming applicants into pipeline stages: <span className="text-amber-300">Pending</span>, <span className="text-cyan-300">Reviewing</span>, <span className="text-indigo-300">Shortlisted</span>, and <span className="text-emerald-300">Hired</span>.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xl font-bold text-white mb-1">1-Click Status Update</p>
                  <p className="text-xs text-slate-400">Instantly notify candidates as they advance in the pipeline.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xl font-bold text-white mb-1">Skill Gap Analytics</p>
                  <p className="text-xs text-slate-400">Identify top missing skills across candidate pools.</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenAuthModal('recruiter')}
                className="btn-primary text-sm py-3 px-6 flex items-center gap-2 font-bold"
              >
                <span>Access Recruiter Dashboard</span> <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Recruiter Dashboard UI Graphic Mock */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/15 shadow-2xl space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    Incoming Applicants (Senior React Engineer)
                  </span>
                  <span className="text-slate-400">14 Applications Today</span>
                </div>

                {/* Candidate row 1 */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">
                      JD
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">John Doe</p>
                      <p className="text-[10px] text-slate-400">john.doe@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      94% Match
                    </span>
                    <span className="badge-shortlisted">Shortlisted</span>
                  </div>
                </div>

                {/* Candidate row 2 */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">
                      AS
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Alice Smith</p>
                      <p className="text-[10px] text-slate-400">alice.smith@tech.org</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                      82% Match
                    </span>
                    <span className="badge-reviewing">Under Review</span>
                  </div>
                </div>

                {/* Candidate row 3 */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 opacity-75">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold text-xs">
                      RJ
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Robert Johnson</p>
                      <p className="text-[10px] text-slate-400">robert.j@dev.net</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full">
                      68% Match
                    </span>
                    <span className="badge-pending">Pending</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 6. HOW IT WORKS 3-STEP TIMELINE           */}
      {/* ========================================== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="h-4 w-4" /> Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            How SmartJobs AI Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Seamless journey for both job seekers looking for their dream role and hiring teams seeking top-tier talent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="glass-card p-8 border border-white/10 relative hover:border-indigo-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-display font-black text-xl flex items-center justify-center mb-6">
              01
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create Skill Profile</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Sign up as a Job Seeker and add your technical skills, experience level, and preferred roles to generate your vector profile.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-8 border border-white/10 relative hover:border-cyan-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-display font-black text-xl flex items-center justify-center mb-6">
              02
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Vector Matching</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Our automated engine matches your skill vectors against open job posts, providing instant similarity scores and alerts.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-8 border border-white/10 relative hover:border-purple-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-display font-black text-xl flex items-center justify-center mb-6">
              03
            </div>
            <h3 className="text-xl font-bold text-white mb-2">1-Click Apply & Hire</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Submit your application in seconds. Track real-time status changes directly in your seeker dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 7. TESTIMONIALS CAROUSEL / GRID           */}
      {/* ========================================== */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> User Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            Loved by Developers & HR Managers
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The AI Match score saved me hours of scrolling! SmartJobs AI recommended a Senior React position with a 92% match score, and I landed the job within 2 weeks!"
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                DK
              </div>
              <div>
                <p className="text-xs font-bold text-white">Devon Knox</p>
                <p className="text-[10px] text-slate-400">Lead Frontend Engineer at TechCorp</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "As a recruiter managing 20+ open tech roles, the candidate ranking pipeline is a game-changer. I instantly know which candidates match our core skill vectors."
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                SL
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sarah Lin</p>
                <p className="text-[10px] text-slate-400">VP of Talent Acquisition at Innovate</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The glassmorphic UI and real-time skill matching are unlike any traditional job portal. It feels like hiring from the future!"
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                MR
              </div>
              <div>
                <p className="text-xs font-bold text-white">Marcus Roy</p>
                <p className="text-[10px] text-slate-400">Full Stack Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 8. FAQ ACCORDION SECTION                  */}
      {/* ========================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold mb-3">
            <HelpCircle className="h-4 w-4 text-indigo-400" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-display font-black text-white">Have Questions? We Have Answers.</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card border border-white/10 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-white text-sm sm:text-base hover:text-indigo-300 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="h-5 w-5 text-indigo-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 9. HIGH-IMPACT FINAL CTA BANNER           */}
      {/* ========================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel-glowing p-10 sm:p-16 border border-white/20 text-center relative overflow-hidden">
          <div className="ambient-glow w-96 h-96 bg-indigo-600/30 -top-20 left-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
              Ready to Accelerate Your <br />
              <span className="text-gradient-brand">Career or Hiring Process?</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Join thousands of job seekers and top recruiters leveraging AI similarity metrics today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => handleOpenAuthModal('seeker')}
                className="btn-glow text-base px-8 py-4 rounded-2xl flex items-center gap-2 font-bold"
              >
                <UserCheck className="h-5 w-5" /> Join as Candidate Free
              </button>

              <button
                onClick={() => handleOpenAuthModal('recruiter')}
                className="btn-secondary text-base px-7 py-4 rounded-2xl flex items-center gap-2 font-bold"
              >
                <Briefcase className="h-5 w-5 text-cyan-400" /> Start Hiring Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 10. FOOTER                                */}
      {/* ========================================== */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-400">
          
          <div className="space-y-4">
            <BrandLogo size="md" to="/" />
            <p className="leading-relaxed">
              Next-Generation AI Job Matching Platform utilizing mathematical Jaccard vector similarity scoring and weighted recruiter pipelines.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">For Candidates</h4>
            <ul className="space-y-2">
              <li><a href="#jobs-feed" className="hover:text-white">Explore Open Jobs</a></li>
              <li><button onClick={() => handleOpenAuthModal('seeker')} className="hover:text-white">AI Skill Matching</button></li>
              <li><button onClick={() => handleOpenAuthModal('seeker')} className="hover:text-white">Resume Optimizer</button></li>
              <li><button onClick={() => handleOpenAuthModal('seeker')} className="hover:text-white">My Applications</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">For Recruiters</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleOpenAuthModal('recruiter')} className="hover:text-white">Post Open Roles</button></li>
              <li><button onClick={() => handleOpenAuthModal('recruiter')} className="hover:text-white">Candidate Ranking HUD</button></li>
              <li><button onClick={() => handleOpenAuthModal('recruiter')} className="hover:text-white">Enterprise Talent Sourcing</button></li>
              <li><button onClick={() => handleOpenAuthModal('recruiter')} className="hover:text-white">Recruiter Analytics</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Platform SLA</h4>
            <p className="mb-3">Subscribe to our weekly AI job digest & tech career insights.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="you@domain.com" className="glass-input text-xs py-2 px-3" />
              <button onClick={() => toast.success('Subscribed to job digest!')} className="btn-primary text-xs px-3 py-2">Join</button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SmartJobs AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
