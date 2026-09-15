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
    if (e && e.preventDefault) e.preventDefault()
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
      a: "SmartJobs AI utilizes mathematical vector similarity algorithms (Jaccard Index combined with weighted skill relevance). It parses candidate skill profiles against employer requirements to compute a real-time match precision score."
    },
    {
      q: "Can job seekers explore and apply without fees?",
      a: "Yes! SmartJobs AI is 100% free for job seekers. You can browse thousands of verified openings, save positions, and apply with 1-click intelligent resume submission."
    },
    {
      q: "How do recruiters post jobs and evaluate candidates?",
      a: "Recruiters access a dedicated Command Center dashboard where they can create targeted job postings, define skill vectors, and instantly receive automatically ranked candidates sorted by AI match percentage."
    },
    {
      q: "Is candidate data protected and private?",
      a: "Absolutely. We enforce enterprise JWT encryption and strict data privacy policies. Profiles are only shared with hiring teams when an application is explicitly submitted."
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
    { name: 'Nvidia' }
  ]

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      
      {/* Public Navbar Header */}
      <PublicNavbar onOpenAuth={handleOpenAuthModal} />

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
        promptContext={authModalPrompt}
      />

      {/* ========================================== */}
      {/* 1. PRODUCT HERO SECTION (SPLIT LAYOUT)     */}
      {/* ========================================== */}
      <section id="hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern">
        {/* Ambient Glowing Orbs Background (Preserved VFX) */}
        <div className="ambient-glow w-[500px] h-[500px] bg-indigo-600/15 -top-20 -left-20 animate-pulse-glow" />
        <div className="ambient-glow w-[600px] h-[600px] bg-purple-600/15 top-10 -right-20 animate-pulse-glow" />
        <div className="ambient-glow w-[400px] h-[400px] bg-cyan-600/10 bottom-0 left-1/3 animate-pulse-glow" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Copy, Search, CTAs & Stats */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Product Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Next-Gen AI Job Matching Engine 2.0</span>
                <span className="bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">99.8% Precision</span>
              </motion.div>

              {/* Product Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-[1.1] text-white"
              >
                AI-Powered Job Discovery & <br className="hidden sm:inline" />
                <span className="text-gradient-brand">Intelligent Career Matching.</span>
              </motion.h1>

              {/* Product Subheadline */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl"
              >
                Revolutionizing talent acquisition with <strong className="text-white font-semibold">weighted Jaccard vector similarity scoring</strong>, 1-click intelligent resume applications, and automated recruiter candidate ranking pipelines.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <a
                  href="#jobs-feed"
                  className="btn-glow text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-indigo-600/25"
                >
                  <Search className="h-4 w-4" /> Explore Open Roles
                </a>

                <button
                  onClick={() => handleOpenAuthModal('recruiter')}
                  className="btn-secondary text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 font-medium"
                >
                  <Briefcase className="h-4 w-4 text-cyan-400" /> Employer Command Center
                </button>
              </motion.div>

              {/* Quick Search Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="saas-panel p-3.5 sm:p-4 border border-white/10 shadow-xl max-w-2xl"
              >
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="relative sm:col-span-5">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                    <input
                      type="text"
                      className="glass-input pl-10 py-2.5 text-xs sm:text-sm font-medium"
                      placeholder="Job title, skill (e.g. React, Java)..."
                      value={filters.keyword}
                      onChange={e => setFilters({ ...filters, keyword: e.target.value })}
                    />
                  </div>

                  <div className="relative sm:col-span-4">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                    <input
                      type="text"
                      className="glass-input pl-10 py-2.5 text-xs sm:text-sm font-medium"
                      placeholder="Location or Remote..."
                      value={filters.location}
                      onChange={e => setFilters({ ...filters, location: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="btn-primary w-full h-full py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 rounded-xl"
                    >
                      <Search className="h-4 w-4" /> Search
                    </button>
                  </div>
                </form>

                {/* Trending Tags */}
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Popular:</span>
                  {['Full Stack', 'React.js', 'Java Spring', 'Data Engineer', 'Remote'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setFilters({ ...filters, keyword: tag })
                        handleSearchSubmit({ preventDefault: () => {} })
                      }}
                      className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/40 hover:text-white transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Trust Metric Row */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xl sm:text-2xl font-bold text-white font-display">50,000+</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Verified Open Roles</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-display">98.4%</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">AI Match Accuracy</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xl sm:text-2xl font-bold text-cyan-400 font-display">12,500+</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tech Employers</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xl sm:text-2xl font-bold text-purple-400 font-display">&lt; 24 hrs</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Avg Review Time</p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Product AI Visualization Mock (Preserved Animations & VFX) */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="saas-panel-glowing p-5 sm:p-6 border border-white/20 shadow-2xl relative overflow-hidden group"
              >
                {/* Header bar of Product HUD */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">AI Vector Match Engine</span>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                    LIVE HUD
                  </span>
                </div>

                {/* Candidate Mock Match Card */}
                <div className="space-y-4">
                  
                  {/* Job Target info */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyLogo name="Google" className="h-10 w-10 shrink-0 rounded-lg bg-slate-900 border border-white/15 p-1.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">Senior Full Stack Engineer</p>
                        <p className="text-[11px] text-slate-400">Google Inc. • Mountain View, CA</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                        94% Vector Match
                      </span>
                    </div>
                  </div>

                  {/* Skill breakdown list */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300 text-[11px] font-medium">
                      <span>Jaccard Vector Similarity Score</span>
                      <span className="font-bold text-indigo-300">0.94 / 1.00</span>
                    </div>

                    {/* Animated Match Gauge Progress bar */}
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10 relative">
                      <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full w-[94%] transition-all duration-1000" />
                    </div>

                    {/* Skill chips */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> React.js
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> Spring Boot
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> TypeScript
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> PostgreSQL
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium flex items-center gap-1">
                        + Docker
                      </span>
                    </div>
                  </div>

                  {/* Recruiter Ranking Status Box */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Recruiter Pipeline Rank:</span>
                    <span className="font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/30">
                      #1 Shortlisted Candidate
                    </span>
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. TRUSTED COMPANIES LOGO SECTION          */}
      {/* ========================================== */}
      <section className="py-8 border-y border-white/[0.08] bg-[#090d17] relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">
            Trusted by Talent Teams at Innovative Tech Leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 hover:opacity-100 transition-opacity">
            {topCompanies.map((comp, idx) => (
              <div key={idx} className="flex items-center gap-2 group cursor-pointer">
                <CompanyLogo name={comp.name} className="h-6 w-6 grayscale group-hover:grayscale-0 transition-all" />
                <span className="font-display font-semibold text-slate-300 group-hover:text-white text-sm sm:text-base tracking-tight">
                  {comp.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. INSTANT RESUME JOB MATCHER SPOTLIGHT   */}
      {/* ========================================== */}
      <section id="resume-matcher" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <ResumeJobMatcher onApplyTrigger={handleApplyClick} />
      </section>

      {/* ========================================== */}
      {/* 4. EXPLORE FEATURED JOBS FEED SECTION     */}
      {/* ========================================== */}
      <section id="jobs-feed" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Zap className="h-3.5 w-3.5" /> Featured Job Feed
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Explore Active Positions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Review current open positions or apply instantly with AI resume matching.
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
            description="Try clearing your search filters or trying keywords like 'React', 'Java', or 'Remote'."
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
                    className="btn-primary text-xs w-full py-2.5 flex items-center justify-center gap-1.5 font-semibold"
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
      {/* 5. AI ENGINE & INTERACTIVE SIMULATOR      */}
      {/* ========================================== */}
      <section id="ai-features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-t border-white/[0.08]">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Explanation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Bot className="h-4 w-4 text-purple-400" /> Mathematical Jaccard Vector Engine
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Precision Vector Scoring. <br />
              <span className="text-gradient-violet">Powered by AI Algorithms.</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              No black-box guesses. SmartJobs AI calculates exact mathematical vector overlap between candidate skills and job requirements using weighted Jaccard similarity:
            </p>

            <div className="p-4 rounded-xl bg-[#090d16] border border-white/10 font-mono text-xs text-indigo-300 space-y-1">
              <p className="text-slate-400">// Vector Similarity Formula</p>
              <p className="text-white font-bold">Similarity(Candidate, Job) = |Candidate_Skills ∩ Job_Skills| / |Candidate_Skills ∪ Job_Skills|</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-1">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Weighted Core Skills</h4>
                  <p className="text-xs text-slate-400">Essential required skills receive 2x weight boost over optional tags.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-1">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Experience Decay Factor</h4>
                  <p className="text-xs text-slate-400">Senior positions weigh years of verified experience alongside skill tags.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive AI Simulator Widget */}
          <div className="lg:col-span-6 saas-panel-glowing p-6 sm:p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-400" />
                <span className="font-display font-bold text-white text-base">Live AI Match Simulator</span>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md font-mono font-bold">Interactive</span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Toggle candidate skill tags below to test the live Jaccard vector match calculation against a target Senior Engineer role:
            </p>

            {/* Target Job Skill Requirement */}
            <div className="mb-5 p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">Target Job Requirements (5 Required):</span>
              <div className="flex flex-wrap gap-1.5">
                {targetRequired.map(req => (
                  <span key={req} className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 font-medium">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Candidate Skill Selector */}
            <div className="mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">Candidate Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.map(skill => {
                  const active = simulatedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSimulatedSkill(skill)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                          : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}{skill}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Simulated Result Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-center relative overflow-hidden">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">Calculated AI Match Gauge</p>
              <div className="text-4xl sm:text-5xl font-display font-bold text-white my-1 flex items-center justify-center gap-2">
                <span className={simScore >= 75 ? 'text-emerald-400' : simScore >= 50 ? 'text-cyan-400' : 'text-amber-400'}>
                  {simScore}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden my-3 border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${simScore}%` }}
                  transition={{ duration: 0.4 }}
                  className={`h-full rounded-full ${
                    simScore >= 75 ? 'bg-emerald-400' :
                    simScore >= 50 ? 'bg-cyan-400' :
                    'bg-amber-400'
                  }`}
                />
              </div>

              <p className="text-xs text-slate-300">
                {simScore >= 75 ? '🎉 Strong Candidate Match! Recommended for immediate interview.' :
                 simScore >= 50 ? '⚡ Partial Skill Match. Consider adding complementary skills.' :
                 '⚠️ Low Similarity Score. Explore roles with matching skill tags.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 6. RECRUITER COMMAND CENTER SPOTLIGHT     */}
      {/* ========================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="saas-panel p-8 sm:p-12 border border-white/15 relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Briefcase className="h-4 w-4" /> Employer Command Center
              </div>

              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                Streamline Hiring with <br />
                <span className="text-gradient-brand">Automated Candidate Ranking.</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Recruiters post jobs in minutes. Our pipeline automatically ranks incoming applicants into pipeline stages: <span className="text-amber-300">Pending</span>, <span className="text-cyan-300">Reviewing</span>, <span className="text-indigo-300">Shortlisted</span>, and <span className="text-emerald-300">Hired</span>.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <p className="text-sm font-bold text-white mb-1">Status Updates</p>
                  <p className="text-xs text-slate-400">Instantly notify candidates as they advance in the pipeline.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <p className="text-sm font-bold text-white mb-1">Skill Gap Analytics</p>
                  <p className="text-xs text-slate-400">Identify missing skills across applicant pools.</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenAuthModal('recruiter')}
                className="btn-primary text-xs sm:text-sm py-3 px-6 flex items-center gap-2 font-semibold"
              >
                <span>Access Recruiter Dashboard</span> <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Recruiter Dashboard Graphic */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/15 shadow-2xl space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Applicants (Senior React Engineer)
                  </span>
                  <span className="text-slate-400 text-[11px]">14 Applications</span>
                </div>

                {/* Candidate row 1 */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                      JD
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">John Doe</p>
                      <p className="text-[10px] text-slate-400">john.doe@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      94% Match
                    </span>
                    <span className="badge-shortlisted">Shortlisted</span>
                  </div>
                </div>

                {/* Candidate row 2 */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                      AS
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Alice Smith</p>
                      <p className="text-[10px] text-slate-400">alice.smith@tech.org</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                      82% Match
                    </span>
                    <span className="badge-reviewing">Under Review</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 7. HOW IT WORKS 3-STEP PROCESS             */}
      {/* ========================================== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="h-4 w-4" /> Process Overview
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            How SmartJobs AI Works
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Seamless journey for both job seekers looking for their next role and hiring managers sourcing top talent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="saas-card p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-base flex items-center justify-center">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Create Skill Vector Profile</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Sign up as a Job Seeker and add your technical skills, experience level, and preferred roles to generate your vector profile.
            </p>
          </div>

          <div className="saas-card p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-base flex items-center justify-center">
              02
            </div>
            <h3 className="text-lg font-bold text-white">AI Vector Matching</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Our automated engine matches your skill vectors against open job posts, computing instant similarity scores and alerts.
            </p>
          </div>

          <div className="saas-card p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-mono font-bold text-base flex items-center justify-center">
              03
            </div>
            <h3 className="text-lg font-bold text-white">1-Click Apply & Hire</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Submit your application in seconds. Track real-time status updates directly inside your candidate dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 8. TESTIMONIALS GRID                       */}
      {/* ========================================== */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> User Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Loved by Candidates & Recruiters
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="saas-card p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The AI match score saved me hours of scrolling. SmartJobs AI recommended a Senior React position with a 94% match score, and I landed the job in 2 weeks!"
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                DK
              </div>
              <div>
                <p className="text-xs font-bold text-white">Devon Knox</p>
                <p className="text-[10px] text-slate-400">Lead Frontend Engineer</p>
              </div>
            </div>
          </div>

          <div className="saas-card p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "As a recruiter managing 15+ open roles, candidate ranking is a game-changer. I instantly know which applicants match our core technical requirements."
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                SL
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sarah Lin</p>
                <p className="text-[10px] text-slate-400">VP of Talent Acquisition</p>
              </div>
            </div>
          </div>

          <div className="saas-card p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The interface and real-time skill matching are clean, fast, and transparent. It feels like recruitment software from the future."
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
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
      {/* 9. FAQ ACCORDION                           */}
      {/* ========================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold mb-3">
            <HelpCircle className="h-4 w-4 text-indigo-400" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Have Questions? We Have Answers.</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="saas-card border border-white/10 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-white text-sm sm:text-base hover:text-indigo-300 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="h-5 w-5 text-indigo-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.05] pt-3"
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
      {/* 10. FINAL CTA BANNER & SAAS FOOTER        */}
      {/* ========================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="saas-panel-glowing p-8 sm:p-14 border border-white/20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
              Ready to Accelerate Your <br />
              <span className="text-gradient-brand">Career or Hiring Pipeline?</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Join thousands of job seekers and hiring teams leveraging AI similarity metrics today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleOpenAuthModal('seeker')}
                className="btn-glow text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
              >
                <UserCheck className="h-4 w-4" /> Join as Candidate Free
              </button>

              <button
                onClick={() => handleOpenAuthModal('recruiter')}
                className="btn-secondary text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 font-medium"
              >
                <Briefcase className="h-4 w-4 text-cyan-400" /> Start Hiring Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Column SaaS Footer */}
      <footer className="border-t border-white/10 bg-[#06080d] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-400">
          
          <div className="space-y-3">
            <BrandLogo size="md" to="/" />
            <p className="leading-relaxed">
              Next-Generation AI Job Matching Platform utilizing mathematical Jaccard vector similarity scoring and automated recruiter candidate ranking.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">For Candidates</h4>
            <ul className="space-y-2">
              <li><a href="#jobs-feed" className="hover:text-white">Explore Open Jobs</a></li>
              <li><button onClick={() => handleOpenAuthModal('seeker')} className="hover:text-white">AI Skill Matching</button></li>
              <li><button onClick={() => handleOpenAuthModal('seeker')} className="hover:text-white">Resume Parser</button></li>
              <li><button onClick={() => handleOpenAuthModal('seeker')} className="hover:text-white">My Applications</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">For Employers</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleOpenAuthModal('recruiter')} className="hover:text-white">Post Open Positions</button></li>
              <li><button onClick={() => handleOpenAuthModal('recruiter')} className="hover:text-white">Candidate Ranking HUD</button></li>
              <li><button onClick={() => handleOpenAuthModal('recruiter')} className="hover:text-white">Talent Acquisition</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-3 text-[11px]">Platform SLA</h4>
            <p className="mb-2">Subscribe to our weekly AI job digest & insights.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="you@company.com" className="glass-input text-xs py-2 px-3" />
              <button onClick={() => toast.success('Subscribed!')} className="btn-primary text-xs px-3 py-2">Join</button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SmartJobs AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security SLA</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
