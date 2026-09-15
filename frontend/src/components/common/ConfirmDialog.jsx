import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-slate-300 text-xs leading-relaxed">{message}</p>
      <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-white/10">
        <button onClick={onClose} className="btn-secondary text-xs" disabled={loading}>Cancel</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={danger ? 'btn-danger text-xs' : 'btn-primary text-xs'}
        >
          {loading ? 'Processing…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
