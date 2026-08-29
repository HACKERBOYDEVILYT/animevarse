import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { register } from "../services/authApi";
import useAuthStore from "../store/useAuthStore";

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const user = await register(
        name,
        email,
        password
      );

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
          <h1>Create Account</h1>
          <p>Join AnimeVerse today.</p>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            Create Account
          </button>

          <span>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </span>
        </form>
      </main>
    </div>
  );
}
