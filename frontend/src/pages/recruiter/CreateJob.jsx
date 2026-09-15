import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobApi } from '../../api/jobApi'
import JobForm from '../../components/recruiter/JobForm'
import { MotionPage } from '../../components/common/MotionContainer'
import { PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateJob() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await jobApi.createJob(data)
      toast.success('Job position posted successfully!')
      navigate('/recruiter/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MotionPage className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>New Enterprise Position</span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Post a New Job</h1>
        <p className="text-slate-400 text-sm mt-1">Specify role details and required skills to trigger AI candidate matching.</p>
      </div>

      <div className="glass-panel p-8 border border-white/15">
        <JobForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </MotionPage>
  )
}
