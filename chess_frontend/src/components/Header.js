import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
function Header({ theme, onThemeToggle }) {
  const { user, onLogout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header
      style={{
        background: "var(--primary, #35495e)",
        color: "#fff",
        padding: "0.7rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "2px solid var(--accent, #e67e22)",
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 28 }}>
        <span role="img" aria-label="Chess">♟️</span>
        Chess Arena
      </div>
      <nav style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}>
        {user ? (
          <>
            <NavLink to="/dashboard" label="Play" />
            <NavLink to="/leaderboard" label="Leaderboard" />
            <NavLink to="/profile" label="Profile" />
            <button
              onClick={() => {
                onLogout();
                if (!["/login", "/register"].includes(location.pathname)) {
                  navigate("/login");
                }
              }}
              style={{
                border: "none",
                background: "var(--accent, #e67e22)",
                color: "#fff",
                padding: "7px 17px",
                borderRadius: 5,
                fontWeight: 600,
                cursor: "pointer",
                marginLeft: 10,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" label="Login" />
            <NavLink to="/register" label="Register" />
          </>
        )}
        <button
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{
            border: "none",
            background: "var(--secondary, #f5f6fa)",
            color: "var(--primary, #35495e)",
            fontWeight: 700,
            borderRadius: 7,
            fontSize: 18,
            marginLeft: 10,
            padding: "7px 15px",
            cursor: "pointer",
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>
    </header>
  );
}
const NavLink = ({ to, label }) => (
  <Link
    to={to}
    style={{
      color: "#fff",
      textDecoration: "none",
      fontWeight: 600,
      fontSize: 17,
      transition: "color 0.2s",
      borderBottom: "2px solid transparent",
      paddingBottom: 2,
    }}
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    {label}
  </Link>
);

export default Header;
