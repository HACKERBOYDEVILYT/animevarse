import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import useAuthStore from "../store/useAuthStore";
import useLibraryStore from "../store/useLibraryStore";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

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
        <div className="profile-card">
          <div className="avatar">
            {user?.name?.charAt(0) || "G"}
          </div>

          <h1>{user?.name || "Guest User"}</h1>

          <p>
            {user?.email || "Sign in to sync your library."}
          </p>

          {user ? (
            <button
              className="secondary-button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <div className="hero-buttons">
              <Link to="/login" className="primary-button">
                Login
              </Link>
              <Link
                to="/register"
                className="secondary-button"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="stats-grid">
          <div>
            <strong>{watchlist.length}</strong>
            <span>Watchlist</span>
          </div>

          <div>
            <strong>{history.length}</strong>
            <span>History</span>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
