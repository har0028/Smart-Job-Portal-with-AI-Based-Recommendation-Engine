export default function Badge({ status }) {
  const map = {
    PENDING:     'badge-pending',
    REVIEWING:   'badge-reviewing',
    SHORTLISTED: 'badge-shortlisted',
    HIRED:       'badge-hired',
    REJECTED:    'badge-rejected',
    ACTIVE:      'badge-active',
    CLOSED:      'badge-closed',
    DRAFT:       'badge-draft',
    ADMIN:       'bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md',
    RECRUITER:   'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md',
    JOB_SEEKER:  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md',
  }
  return <span className={map[status] || 'badge-pending'}>{status?.replace('_', ' ')}</span>
}
