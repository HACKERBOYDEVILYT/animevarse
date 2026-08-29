import {
  Film,
  Tv,
  Star,
  Users,
  PlaySquare,
  BarChart3,
  ExternalLink,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

import useAdminStore from "../../store/useAdminStore";

export default function AdminDashboard() {
  const admin = useAdminStore(
    (state) => state.admin
  );

  const anime = useAdminStore(
    (state) => state.anime
  );

  const episodes = useAdminStore(
    (state) => state.episodes
  );

  const featured = useAdminStore(
    (state) => state.featured
  );

  const providers = useAdminStore(
    (state) => state.providers
  );

  const users = useAdminStore(
    (state) => state.users
  );

  const logoutAdmin =
    useAdminStore(
      (state) => state.logoutAdmin
    );

  const stats = [
    {
      title: "Anime",
      value: anime.length,
      icon: Film,
      link: "/admin/anime",
    },
    {
      title: "Episodes",
      value: episodes.length,
      icon: PlaySquare,
      link: "/admin/episodes",
    },
    {
      title: "Featured",
      value: featured.length,
      icon: Star,
      link: "/admin/featured",
    },
    {
      title: "Providers",
      value: providers.length,
      icon: Tv,
      link: "/admin/providers",
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      link: "/admin/users",
    },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Anime<span>Verse</span>
        </div>

        <nav>
          <Link to="/admin">
            Dashboard
          </Link>

          <Link to="/admin/anime">
            Anime
          </Link>

          <Link to="/admin/episodes">
            Episodes
          </Link>

          <Link to="/admin/featured">
            Featured
          </Link>

          <Link to="/admin/providers">
            Providers
          </Link>

          <Link to="/admin/users">
            Users
          </Link>

          <Link to="/admin/analytics">
            Analytics
          </Link>

          <Link to="/admin/settings">
            Settings
          </Link>
        </nav>

        <button
          className="admin-logout"
          onClick={logoutAdmin}
        >
          <LogOut size={17} />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back,{" "}
              {admin?.name ||
                "Administrator"}
            </p>
          </div>

          <Link
            to="/"
            className="secondary-button"
          >
            <ExternalLink
              size={17}
            />
            View Site
          </Link>
        </header>

        <section className="admin-stats">
          {stats.map(
            ({
              title,
              value,
              icon: Icon,
              link,
            }) => (
              <Link
                key={title}
                to={link}
                className="admin-stat-card"
              >
                <div className="admin-stat-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <strong>
                    {value}
                  </strong>

                  <span>
                    {title}
                  </span>
                </div>
              </Link>
            )
          )}
        </section>

        <section className="admin-grid">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>
                Quick Actions
              </h2>
            </div>

            <div className="admin-actions">
              <Link
                to="/admin/anime?action=add"
                className="primary-button"
              >
                + Add Anime
              </Link>

              <Link
                to="/admin/episodes?action=add"
                className="secondary-button"
              >
                + Add Episode
              </Link>

              <Link
                to="/admin/providers?action=add"
                className="secondary-button"
              >
                + Add Provider
              </Link>

              <Link
                to="/admin/featured"
                className="secondary-button"
              >
                Manage Featured
              </Link>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>
                System Status
              </h2>
            </div>

            <div className="health-list">
              <div>
                <span>
                  AniList API
                </span>

                <b className="status-ok">
                  Primary
                </b>
              </div>

              <div>
                <span>
                  Jikan API
                </span>

                <b className="status-ok">
                  Fallback
                </b>
              </div>

              <div>
                <span>
                  Admin storage
                </span>

                <b className="status-warning">
                  Local
                </b>
              </div>

              <div>
                <span>
                  Database
                </span>

                <b className="status-warning">
                  Not connected
                </b>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>
                Recommended Next Step
              </h2>

              <p>
                Connect a real database before
                using Admin in production.
              </p>
            </div>
          </div>

          <div className="admin-notice">
            Your current anime data comes
            primarily from AniList/Jikan.
            Admin-created records are stored
            locally until a backend database
            is connected.
          </div>
        </section>
      </main>
    </div>
  );
}
