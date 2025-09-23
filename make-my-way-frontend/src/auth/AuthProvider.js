import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  refresh as refreshApi,
} from "../services/api";
import {API} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      if (token) await logoutApi(token);
      localStorage.removeItem("token");
        delete API.defaults.headers.common["Authorization"];
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setActiveUser(null);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  };
  
  useEffect(() => {
    // try refreshing token on mount
    const tryRefresh = async () => {
      if (refreshToken) {
        try {
          const data = await refreshApi(refreshToken);
          if (data.token) {
            localStorage.setItem("token", data.token);
            API.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${data.token}`;

            setActiveUser(data.user);
          }
        } catch (err) {
          console.error("Refresh failed", err);
          await handleLogout();
        }
      }
      setLoading(false);
    };
    tryRefresh();
  }, [refreshToken, handleLogout]);

  const handleLogin = async (email, password) => {
    try {
      const data = await loginApi({ email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
        API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        setActiveUser(data.user);
        return data.user;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      const data = await registerApi({ username, email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        return data;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  

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
  );
}

export const useAuth = () => useContext(AuthContext);
