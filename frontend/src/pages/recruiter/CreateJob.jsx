import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobApi } from '../../api/jobApi'
import JobForm from '../../components/recruiter/JobForm'
import toast from 'react-hot-toast'

export default function CreateJob() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await jobApi.createJob(data)
      toast.success('Job posted successfully!')
      navigate('/recruiter/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to attract the right candidates</p>
      </div>
      <div className="card">
        <JobForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
