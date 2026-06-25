import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const execute = useCallback(async (apiFn, { onSuccess, onError, successMsg } = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn()
      if (successMsg) toast.success(successMsg)
      if (onSuccess) onSuccess(res.data.data ?? res.data)
      return res.data.data ?? res.data
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
      if (onError) onError(msg)
      else toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, execute }
}
