import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, RefreshCw, MapPin, Briefcase, DollarSign,
  CheckCircle, AlertTriangle, TrendingUp
} from 'lucide-react'
import { seekerApi } from '../../api/seekerApi'
import EmptyState from '../../components/common/EmptyState'
import { PageSpinner } from '../../components/common/Spinner'
import toast from 'react-hot-toast'

function MatchGauge({ pct }) {
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
  const label = pct >= 75 ? 'Strong Match' : pct >= 50 ? 'Good Match' : 'Partial Match'
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 100 60" className="w-24" aria-label={`${pct}% match`}>
        <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M10 55 A40 40 0 0 1 90 55"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 125.6} 125.6`}
        />
        <text x="50" y="52" textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>{pct.toFixed(0)}%</text>
      </svg>
      <span className="text-xs font-medium" style={{ color }}>{label}</span>
    </div>
  )
}

function RecommendationCard({ rec }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start gap-4 flex-wrap">
        {/* Rank badge */}
        <div className="shrink-0 h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <span className="text-sm font-bold text-primary-700">#{rec.rank}</span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-semibold text-gray-900 text-base">{rec.jobTitle}</h3>
              <p className="text-sm text-primary-600 font-medium">{rec.companyName}</p>
            </div>
            <MatchGauge pct={rec.matchPercentage} />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            {rec.location   && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{rec.location}</span>}
            {rec.jobType    && <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{rec.jobType.replace('_', ' ')}</span>}
            {rec.salaryRange && <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{rec.salaryRange}</span>}
          </div>

          {/* Matched skills */}
          {rec.matchedSkills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {rec.matchedSkills.slice(0, 6).map(s => (
                <span key={s} className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" />{s}
                </span>
              ))}
              {rec.matchedSkills.length > 6 && (
                <span className="text-xs text-gray-400">+{rec.matchedSkills.length - 6} more</span>
              )}
            </div>
          )}

          {/* Missing skills */}
          {rec.missingSkills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {rec.missingSkills.map(s => (
                <span key={s} className="flex items-center gap-1 bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full">
                  <AlertTriangle className="h-3 w-3" />{s}
                </span>
              ))}
            </div>
          )}

          {/* Recommendation reason */}
          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary-600 hover:underline flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {expanded ? 'Hide' : 'Show'} AI explanation
            </button>
            {expanded && (
              <div className="mt-2 p-3 bg-purple-50 rounded-xl text-sm text-purple-800 leading-relaxed">
                {rec.recommendationReason}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <Link to={`/seeker/jobs/${rec.jobId}`} className="btn-primary text-sm">
          View & Apply
        </Link>
      </div>
    </div>
  )
}

export default function Recommendations() {
  const [recs, setRecs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await seekerApi.getRecommendations()
      setRecs(res.data.data || [])
      if (isRefresh) toast.success('Recommendations refreshed!')
    } catch {
      toast.error('Failed to load recommendations')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            AI Job Recommendations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Jobs ranked by skill match, experience fit, and recency
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Info banner */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
          <div className="text-sm text-purple-800">
            <p className="font-medium">How recommendations work</p>
            <p className="mt-1 text-purple-700">
              Your skill match score = skills you have ÷ skills required × 100. 
              Final ranking also considers your experience level and how recently the job was posted.
              Add more skills in <Link to="/seeker/skills" className="underline font-medium">My Skills</Link> to improve results.
            </p>
          </div>
        </div>
      </div>

      {recs.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No recommendations yet"
          description="Add skills to your profile so the AI engine can find matching jobs for you."
          action={
            <Link to="/seeker/skills" className="btn-primary text-sm">
              Add Skills
            </Link>
          }
        />
      ) : (
        <>
          <p className="text-sm text-gray-500">{recs.length} recommended jobs ranked by relevance</p>
          <div className="space-y-4">
            {recs.map(rec => <RecommendationCard key={rec.jobId} rec={rec} />)}
          </div>
        </>
      )}
    </div>
  )
}
