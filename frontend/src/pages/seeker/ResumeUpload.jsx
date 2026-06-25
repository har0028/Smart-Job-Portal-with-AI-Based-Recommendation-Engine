import { useEffect, useRef, useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import { PageSpinner } from '../../components/common/Spinner'
import toast from 'react-hot-toast'

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
      toast.error('Only PDF files are allowed')
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
      toast.success('Resume uploaded successfully!')
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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume Upload</h1>
        <p className="text-sm text-gray-500 mt-1">Upload your resume in PDF format (max 5MB)</p>
      </div>

      {/* Current resume */}
      {profile?.resumeUrl && (
        <div className="card flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">Resume on file</p>
            <p className="text-xs text-gray-400 truncate">{profile.resumeUrl}</p>
          </div>
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/${profile.resumeUrl}`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-sm flex items-center gap-1.5 shrink-0"
          >
            <FileText className="h-4 w-4" /> View
          </a>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`card cursor-pointer border-2 border-dashed transition-colors text-center py-14
          ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Upload className="h-7 w-7 text-primary-600" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">
              {uploading ? 'Uploading...' : 'Drop your resume here or click to browse'}
            </p>
            <p className="text-sm text-gray-400 mt-1">PDF only, maximum 5MB</p>
          </div>
          {!uploading && (
            <button type="button" className="btn-primary text-sm px-6">
              Choose File
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={e => uploadFile(e.target.files[0])}
        />
      </div>

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 space-y-1">
            <p className="font-medium">Resume tips</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-700">
              <li>Use a clean, ATS-friendly format</li>
              <li>Include all relevant skills and experience</li>
              <li>Keep it to 1–2 pages</li>
              <li>Use PDF to preserve formatting across devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
