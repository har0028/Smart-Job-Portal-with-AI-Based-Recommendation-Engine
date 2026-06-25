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
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  },
}
