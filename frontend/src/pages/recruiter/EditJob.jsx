import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { jobApi } from '../../api/jobApi'
import JobForm from '../../components/recruiter/JobForm'
import { PageSpinner } from '../../components/common/Spinner'
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
      toast.success('Job updated successfully!')
      navigate('/recruiter/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-sm text-gray-500 mt-1">{job?.title}</p>
      </div>
      <div className="card">
        <JobForm initial={job} onSubmit={handleSubmit} loading={saving} />
      </div>
    </div>
  )
}
