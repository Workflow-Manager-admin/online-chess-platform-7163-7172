import React, { useState, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "./index.css";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import GamePage from "./components/GamePage";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Create a context for auth
export const AuthContext = createContext();

// Utility for getting/setting token from localStorage
const tokenKey = "chess_access_token";
const getToken = () => localStorage.getItem(tokenKey);
const setToken = (token) => localStorage.setItem(tokenKey, token);
const clearToken = () => localStorage.removeItem(tokenKey);

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [authToken, setAuthToken] = useState(getToken());
  const [user, setUser] = useState(null); // User profile (null if not loaded)

  // Set theme CSS variables based on modern light palette
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // On first load or auth change, fetch the profile if authenticated
  useEffect(() => {
    if (authToken) {
      fetch("/users/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((res) => (res.status === 200 ? res.json() : null))
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [authToken]);

  // Provide handlers to login/logout and refresh token
  const handleLogin = (token) => {
    setToken(token);
    setAuthToken(token);
  };
  const handleLogout = () => {
    clearToken();
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token: authToken,
        user,
        onLogin: handleLogin,
        onLogout: handleLogout,
      }}
    >
      <Router>
        <div className="app-root">
          <Header theme={theme} onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}/>
          <main className="main-area">
            <Routes>
              <Route
                path="/"
                element={
                  user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <AuthPage />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" /> : <AuthPage isRegister />}
              />
              <Route
                path="/dashboard"
                element={
                  user ? <Dashboard /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/game/:gameId"
                element={
                  user ? <GamePage /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/leaderboard"
                element={
                  user ? <Leaderboard /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/profile"
                element={
                  user ? <Profile /> : <Navigate to="/login" />
                }
              />
              {/* Fallback 404 */}
              <Route path="*" element={<div style={{ padding: "2rem" }}><h2>Not Found</h2></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
