import { useEffect, useState } from 'react'
import { ClipboardList, Trash2 } from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import Badge from '../../components/common/Badge'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import { formatDate } from '../../utils/dateUtils'
import toast from 'react-hot-toast'

const STATUS_ORDER = ['PENDING', 'REVIEWING', 'SHORTLISTED', 'HIRED', 'REJECTED']

export default function MyApplications() {
  const [apps, setApps]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('ALL')
  const [confirm, setConfirm]   = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    seekerApi.getMyApplications()
      .then(r => setApps(r.data.data || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  const handleWithdraw = async () => {
    setWithdrawing(true)
    try {
      await seekerApi.withdrawApplication(confirm.id)
      setApps(prev => prev.filter(a => a.id !== confirm.id))
      toast.success('Application withdrawn')
    } catch {
      toast.error('Failed to withdraw application')
    } finally {
      setWithdrawing(false)
      setConfirm(null)
    }
  }

  const displayed = filter === 'ALL' ? apps : apps.filter(a => a.status === filter)

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-sm text-gray-500 mt-1">{apps.length} total applications</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', ...STATUS_ORDER].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              filter === s
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {s === 'ALL' ? 'All' : s}
            {s === 'ALL'
              ? ` (${apps.length})`
              : ` (${apps.filter(a => a.status === s).length})`
            }
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications found" description="Start applying to jobs to track your progress here." />
      ) : (
        <div className="space-y-3">
          {displayed.map(app => (
            <div key={app.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{app.jobTitle}</p>
                  <p className="text-sm text-primary-600 font-medium">{app.companyName}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    <span>Applied {formatDate(app.appliedAt)}</span>
                    <span>Match: <strong className="text-gray-600">{app.matchScore?.toFixed(1)}%</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={app.status} />
                  {app.status === 'PENDING' && (
                    <button
                      onClick={() => setConfirm(app)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                      title="Withdraw application"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  {STATUS_ORDER.filter(s => s !== 'REJECTED').map((s, i, arr) => {
                    const currentIdx = arr.indexOf(app.status)
                    const stepIdx    = arr.indexOf(s)
                    const done       = app.status === 'REJECTED'
                      ? false
                      : stepIdx <= currentIdx
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`h-2 rounded-full flex-1 transition-colors ${done ? 'bg-primary-500' : 'bg-gray-200'}`} />
                        {i < arr.length - 1 && <div className="w-1" />}
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Pending</span>
                  <span>Reviewing</span>
                  <span>Shortlisted</span>
                  <span>Hired</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleWithdraw}
        loading={withdrawing}
        title="Withdraw Application"
        message={`Withdraw your application for "${confirm?.jobTitle}"?`}
        confirmLabel="Withdraw"
        danger
      />
    </div>
  )
}
