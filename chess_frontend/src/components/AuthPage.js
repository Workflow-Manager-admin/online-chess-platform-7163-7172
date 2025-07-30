import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
function AuthPage({ isRegister }) {
  const { onLogin } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Login API (POST /users/login), returns { access_token, token_type }
    try {
      const payload = new URLSearchParams();
      payload.append("username", form.username);
      payload.append("password", form.password);
      const response = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload,
      });
      if (!response.ok) {
        throw new Error("Invalid credentials.");
      }
      const data = await response.json();
      onLogin(data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 5)
      return setError("Password must be at least 5 characters.");
    if (form.password !== form.password2)
      return setError("Passwords do not match.");
    setLoading(true);
    try {
      // POST /users/register expects {username, email, password}
      const response = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(
          err?.detail?.map((d) => d.msg).join("; ") || "Cannot register"
        );
      }
      // On register, auto-redirect to login.
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2 style={{ color: "var(--primary, #35495e)" }}>
        {isRegister ? "Register" : "Login"}
      </h2>
      <form
        onSubmit={isRegister ? submitRegister : submitLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.1rem",
          marginTop: 20,
        }}
      >
        {isRegister && (
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
        )}
        <input
          name="username"
          type="text"
          placeholder="Username"
          required
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
        />
        {isRegister && (
          <input
            name="password2"
            type="password"
            placeholder="Confirm Password"
            required
            value={form.password2}
            onChange={handleChange}
            style={inputStyle}
          />
        )}
        {error && (
          <div style={{ color: "#e67e22", fontWeight: "bold" }}>{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "var(--accent, #e67e22)",
            color: "#fff",
            border: "none",
            padding: "12px",
            fontWeight: 700,
            fontSize: 17,
            borderRadius: 6,
            marginTop: 5,
            cursor: "pointer",
          }}
        >
          {loading
            ? isRegister
              ? "Registering..."
              : "Logging in..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>
      </form>
      <div style={{ marginTop: 16 }}>
        {isRegister
          ? (
            <>
              Already have an account?{" "}
              <span
                style={{ color: "var(--accent, #e67e22)", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </>
          )
          : (
            <>
              Don't have an account?{" "}
              <span
                style={{ color: "var(--accent, #e67e22)", cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </>
          )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1.5px solid var(--primary, #35495e)",
  borderRadius: 6,
  fontSize: 15,
  fontWeight: 500,
};

export default AuthPage;
