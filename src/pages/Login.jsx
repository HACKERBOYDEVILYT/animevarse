import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import Navbar from "../components/Navbar";
import { login } from "../services/authApi";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      setUser(user);

      navigate("/profile", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="auth-page">
        <div className="auth-background-glow auth-glow-one" />
        <div className="auth-background-glow auth-glow-two" />

        <section className="auth-card">
          <div className="auth-icon">
            <LogIn size={25} />
          </div>

          <div className="auth-heading">
            <h1>Welcome back</h1>
            <p>Sign in to continue to AnimeVerse.</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Email address
            </label>

            <div className="auth-input-wrap">
              <Mail size={18} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <label className="auth-label">
              Password
            </label>

            <div className="auth-input-wrap">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to AnimeVerse?</span>
          </div>

          <Link to="/register" className="auth-secondary-button">
            Create an account
          </Link>
        </section>
      </main>
    </div>
  );
}
