import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/authApi'
import { tokenUtils } from '../utils/tokenUtils'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token     = tokenUtils.getToken()
    const savedUser = tokenUtils.getUser()
    if (token && savedUser && !tokenUtils.isTokenExpired(token)) {
      setUser(savedUser)
    } else {
      tokenUtils.clearAll()
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials)
    const { accessToken, ...userData } = res.data.data
    tokenUtils.setToken(accessToken)
    tokenUtils.setUser(userData)
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (formData) => {
    const res = await authApi.register(formData)
    const { accessToken, ...userData } = res.data.data
    tokenUtils.setToken(accessToken)
    tokenUtils.setUser(userData)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    tokenUtils.clearAll()
    setUser(null)
  }, [])

  const isAdmin     = user?.role === 'ADMIN'
  const isRecruiter = user?.role === 'RECRUITER'
  const isSeeker    = user?.role === 'JOB_SEEKER'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isRecruiter, isSeeker }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
