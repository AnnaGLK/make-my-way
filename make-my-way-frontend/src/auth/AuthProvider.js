import { createContext, useContext, useEffect, useState } from "react"
import { login as loginApi, register as registerApi, logout as logoutApi } from "../services/api"
import { API } from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    try {
      await logoutApi()
      delete API.defaults.headers.common["Authorization"]
    } catch (err) {
      console.error("Logout error", err)
    } finally {
      setActiveUser(null)
      setToken(null)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me", { withCredentials: true })
        setActiveUser(res.data.user)
        setToken("cookie")
      } catch (err) {
        // 👉 глушим именно 401
        if (err.response?.status !== 401) {
          console.error("Auth check error:", err)
        }
        setActiveUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (email, password) => {
    try {
      const data = await loginApi({ email, password })
      if (data.user) {
        setActiveUser(data.user)
        setToken("cookie")
        return data.user
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleRegister = async (username, email, password) => {
    try {
      const data = await registerApi({ username, email, password })
      if (data.user) {
        setActiveUser(data.user)
        setToken("cookie")
        return data.user
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        activeUser,
        token,
        loading,
        onLogin: handleLogin,
        onRegister: handleRegister,
        onLogout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
