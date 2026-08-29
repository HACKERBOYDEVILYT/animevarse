import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";

import useAuthStore from "../store/useAuthStore";
import useLibraryStore from "../store/useLibraryStore";

export default function Profile() {
  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const watchlist = useLibraryStore(
    (state) => state.watchlist
  );

  const history = useLibraryStore(
    (state) => state.history
  );

  return (
    <div className="app">
      <Navbar />

      <main className="page profile-page">

        {!user ? (
          <div className="profile-card">

            <div className="avatar">
              👤
            </div>

            <h1>
              Welcome to AnimeVerse
            </h1>

            <p>
              Login or create an account
              to manage your anime library.
            </p>

            <div className="hero-buttons">

              <Link
                to="/login"
                className="primary-button"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="secondary-button"
              >
                Create Account
              </Link>

            </div>
          </div>
        ) : (
          <>
            <div className="profile-card">

              <div className="avatar">
                {user.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <h1>
                {user.name}
              </h1>

              <p>
                {user.email}
              </p>

              <button
                type="button"
                className="secondary-button"
                onClick={logout}
              >
                Logout
              </button>

            </div>

            <div className="stats-grid">

              <div>
                <strong>
                  {watchlist.length}
                </strong>

                <span>
                  Watchlist
                </span>
              </div>

              <div>
                <strong>
                  {history.length}
                </strong>

                <span>
                  History
                </span>
              </div>

            </div>
          </>
        )}

        <div className="profile-links">

          <Link
            to="/watchlist"
            className="secondary-button"
          >
            My Watchlist
          </Link>

          <Link
            to="/history"
            className="secondary-button"
          >
            Watch History
          </Link>

        </div>

      </main>

      <MobileNav />
    </div>
    );
}
    
