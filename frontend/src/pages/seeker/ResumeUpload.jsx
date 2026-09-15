import { useEffect, useRef, useState } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage } from '../../components/common/MotionContainer'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import ResumeJobMatcher from '../../components/common/ResumeJobMatcher'

export default function ResumeUpload() {
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    seekerApi.getProfile()
      .then(r => setProfile(r.data.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const uploadFile = async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported for server upload')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must not exceed 5MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    try {
      const res = await seekerApi.uploadResume(formData)
      setProfile(prev => ({ ...prev, resumeUrl: res.data.data }))
      toast.success('Resume uploaded & indexed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Upload className="h-3.5 w-3.5" />
          <span>AI Resume Document Vectorization</span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Resume Upload & Instant Matching</h1>
        <p className="text-slate-400 text-sm mt-1">Upload your PDF resume to index your skills and discover your top vector-matched jobs.</p>
      </div>

      {/* Current Resume Banner */}
      {profile?.resumeUrl && (
        <div className="glass-panel p-6 border border-emerald-500/30 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Resume On File</p>
              <p className="text-xs text-slate-400 truncate max-w-sm">{profile.resumeUrl}</p>
            </div>
          </div>

          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/${profile.resumeUrl}`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-xs flex items-center gap-2 py-2 px-4"
          >
            <FileText className="h-4 w-4 text-indigo-400" /> View Document
          </a>
        </div>
      )}

      {/* Instant AI Resume Matcher Component */}
      <ResumeJobMatcher />

    </MotionPage>
  )
}
