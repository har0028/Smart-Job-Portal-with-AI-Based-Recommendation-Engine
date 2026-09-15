const TOKEN_KEY = 'sjp_token'
const USER_KEY  = 'sjp_user'

export const tokenUtils = {
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getToken: ()      => localStorage.getItem(TOKEN_KEY),
  removeToken: ()   => localStorage.removeItem(TOKEN_KEY),

  setUser: (user)   => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },
  removeUser: () => localStorage.removeItem(USER_KEY),

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  isTokenExpired: (token) => {
    if (!token) return true
    try {
      let base64Url = token.split('.')[1]
      if (!base64Url) return true
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      while (base64.length % 4) {
        base64 += '='
      }
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const payload = JSON.parse(jsonPayload)
      return payload.exp ? payload.exp * 1000 < Date.now() : false
    } catch (err) {
      console.warn('JWT parse warning:', err)
      return false
    }
  },
}
