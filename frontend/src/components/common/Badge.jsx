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
    ADMIN:       'bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
    RECRUITER:   'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
    JOB_SEEKER:  'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
  }
  return <span className={map[status] || 'badge-pending'}>{status?.replace('_', ' ')}</span>
}
