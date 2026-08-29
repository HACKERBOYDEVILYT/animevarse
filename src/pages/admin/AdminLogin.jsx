import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import useAdminStore from "../../store/useAdminStore";

export default function AdminLogin() {
  const navigate = useNavigate();

  const isAdmin = useAdminStore(
    (state) => state.isAdmin
  );

  const loginAdmin = useAdminStore(
    (state) => state.loginAdmin
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  if (isAdmin) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    /*
      IMPORTANT:
      This is only a frontend demo gate.
      Do NOT use a real production password
      here. Production auth must be handled
      by a backend/Supabase/Firebase/etc.
    */

    const adminEmail =
      import.meta.env
        .VITE_ADMIN_EMAIL;

    const adminPassword =
      import.meta.env
        .VITE_ADMIN_PASSWORD;

    if (
      !adminEmail ||
      !adminPassword
    ) {
      setError(
        "Admin credentials are not configured."
      );

      return;
    }

    if (
      email.trim().toLowerCase() !==
        adminEmail.toLowerCase() ||
      password !== adminPassword
    ) {
      setError(
        "Invalid admin credentials."
      );

      return;
    }

    loginAdmin({
      id: "admin",
      name: "Administrator",
      email,
      role: "admin",
    });

    navigate("/admin", {
      replace: true,
    });
  }

  return (
    <div className="admin-auth-page">
      <form
        className="admin-auth-card"
        onSubmit={handleSubmit}
      >
        <div className="admin-brand">
          Anime<span>Verse</span>
        </div>

        <h1>Admin Panel</h1>

        <p>
          Sign in to manage AnimeVerse.
        </p>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <label>
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Admin email"
          autoComplete="username"
          required
        />

        <label>
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          placeholder="Admin password"
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          className="primary-button"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
