import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { login } from "../services/authApi";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const user = await login(email, password);
      setUser(user);
      navigate("/profile");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="app">
      <Navbar />

      <main className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>
          <p>Sign in to AnimeVerse.</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-button">
            Login
          </button>

          <span>
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </span>
        </form>
      </main>
    </div>
  );
}
