import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { jobApi } from '../../api/jobApi'
import JobForm from '../../components/recruiter/JobForm'
import { PageSpinner } from '../../components/common/Spinner'
import { MotionPage } from '../../components/common/MotionContainer'
import { Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    jobApi.getJobById(id)
      .then(r => {
        const j = r.data.data
        setJob({
          ...j,
          skillIds:         j.requiredSkills?.map(s => s.id) || [],
          optionalSkillIds: j.optionalSkills?.map(s => s.id) || [],
        })
      })
      .catch(() => toast.error('Failed to load job'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      await jobApi.updateJob(id, data)
      toast.success('Job position updated successfully!')
      navigate('/recruiter/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <MotionPage className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
          <Edit2 className="h-3.5 w-3.5" />
          <span>Update Listing Attributes</span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Edit Job Position</h1>
        <p className="text-slate-400 text-sm mt-1">{job?.title}</p>
      </div>

      <div className="glass-panel p-8 border border-white/15">
        <JobForm initial={job} onSubmit={handleSubmit} loading={saving} />
      </div>
    </MotionPage>
  )
}
