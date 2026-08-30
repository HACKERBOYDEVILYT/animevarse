import {
  Activity,
  BarChart3,
  ExternalLink,
  Film,
  Globe,
  PlaySquare,
  Plus,
  Server,
  Settings,
  Star,
  Tv,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import useAdminStore from "../../store/useAdminStore";

export default function AdminDashboard() {
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

  const enabledProviders =
    providers.filter(
      (provider) => provider.enabled
    );

  const primaryProvider =
    providers.find(
      (provider) => provider.primary
    ) ||
    [...enabledProviders].sort(
      (a, b) =>
        Number(a.priority || 999) -
        Number(b.priority || 999)
    )[0];

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
      title: "API Providers",
      value: providers.length,
      icon: Server,
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
        <div className="admin-brand">
          <div className="admin-brand-mark">
            A
          </div>

          <div>
            <strong>
              AnimeVerse
            </strong>

            <span>
              Admin Console
            </span>
          </div>
        </div>

        <div className="admin-sidebar-section">
          <span>
            MANAGEMENT
          </span>

          <nav className="admin-nav">
            <Link
              to="/admin"
              className="admin-nav-link active"
            >
              <BarChart3 size={18} />
              Dashboard
            </Link>

            <Link
              to="/admin/anime"
              className="admin-nav-link"
            >
              <Film size={18} />
              Anime
            </Link>

            <Link
              to="/admin/episodes"
              className="admin-nav-link"
            >
              <PlaySquare size={18} />
              Episodes
            </Link>

            <Link
              to="/admin/featured"
              className="admin-nav-link"
            >
              <Star size={18} />
              Featured
            </Link>

            <Link
              to="/admin/providers"
              className="admin-nav-link"
            >
              <Server size={18} />
              API Providers
            </Link>

            <Link
              to="/admin/users"
              className="admin-nav-link"
            >
              <Users size={18} />
              Users
            </Link>
          </nav>
        </div>

        <div className="admin-sidebar-section">
          <span>
            SYSTEM
          </span>

          <nav className="admin-nav">
            <Link
              to="/admin/analytics"
              className="admin-nav-link"
            >
              <Activity size={18} />
              Analytics
            </Link>

            <Link
              to="/admin/settings"
              className="admin-nav-link"
            >
              <Settings size={18} />
              Settings
            </Link>
          </nav>
        </div>

        <Link
          to="/"
          className="admin-view-site"
        >
          <ExternalLink size={17} />
          View Website
        </Link>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <div className="admin-eyebrow">
              ADMINISTRATION
            </div>

            <h1>
              Dashboard
            </h1>

            <p>
              Control your AnimeVerse
              content, providers and
              platform settings.
            </p>
          </div>

          <div className="admin-header-actions">
            <Link
              to="/"
              className="secondary-button"
            >
              <ExternalLink size={17} />
              View Site
            </Link>

            <Link
              to="/admin/providers"
              className="primary-button"
            >
              <Plus size={17} />
              Add API
            </Link>
          </div>
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
                  <span>
                    {title}
                  </span>

                  <strong>
                    {value}
                  </strong>
                </div>
              </Link>
            )
          )}
        </section>

        <section className="admin-dashboard-grid">
          <div className="admin-panel admin-hero-panel">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-label">
                  API ROUTING
                </div>

                <h2>
                  Provider Network
                </h2>

                <p>
                  Your anime data can use
                  multiple providers with
                  automatic priority fallback.
                </p>
              </div>

              <div className="admin-live">
                <span />
                LIVE
              </div>
            </div>

            <div className="provider-network">
              {providers.length === 0 ? (
                <div className="admin-empty-small">
                  <Server size={28} />

                  <span>
                    No providers configured.
                  </span>
                </div>
              ) : (
                [...providers]
                  .sort(
                    (a, b) =>
                      Number(
                        a.priority || 999
                      ) -
                      Number(
                        b.priority || 999
                      )
                  )
                  .slice(0, 5)
                  .map(
                    (provider) => (
                      <div
                        className="provider-network-row"
                        key={
                          provider.id
                        }
                      >
                        <div className="provider-network-number">
                          {provider.priority ||
                            "—"}
                        </div>

                        <div className="provider-network-icon">
                          <Globe
                            size={17}
                          />
                        </div>

                        <div className="provider-network-info">
                          <strong>
                            {
                              provider.name
                            }
                          </strong>

                          <span>
                            {
                              provider.baseUrl
                            }
                          </span>
                        </div>

                        <div
                          className={`provider-status ${
                            provider.enabled
                              ? "online"
                              : "offline"
                          }`}
                        >
                          <span />

                          {provider.enabled
                            ? "Enabled"
                            : "Disabled"}
                        </div>

                        {provider.primary && (
                          <span className="api-badge primary">
                            PRIMARY
                          </span>
                        )}
                      </div>
                    )
                  )
              )}
            </div>

            <Link
              to="/admin/providers"
              className="admin-panel-footer-link"
            >
              Manage all API providers →
            </Link>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-label">
                  QUICK ACTIONS
                </div>

                <h2>
                  Manage Content
                </h2>
              </div>
            </div>

            <div className="admin-quick-actions">
              <Link
                to="/admin/anime?action=add"
                className="admin-quick-action"
              >
                <Film size={20} />

                <div>
                  <strong>
                    Add Anime
                  </strong>

                  <span>
                    Create a new title
                  </span>
                </div>
              </Link>

              <Link
                to="/admin/episodes?action=add"
                className="admin-quick-action"
              >
                <PlaySquare size={20} />

                <div>
                  <strong>
                    Add Episode
                  </strong>

                  <span>
                    Add watchable episode
                  </span>
                </div>
              </Link>

              <Link
                to="/admin/providers"
                className="admin-quick-action"
              >
                <Server size={20} />

                <div>
                  <strong>
                    Add API
                  </strong>

                  <span>
                    Connect another provider
                  </span>
                </div>
              </Link>

              <Link
                to="/admin/featured"
                className="admin-quick-action"
              >
                <Star size={20} />

                <div>
                  <strong>
                    Featured
                  </strong>

                  <span>
                    Manage homepage content
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="admin-bottom-grid">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-label">
                  SYSTEM STATUS
                </div>

                <h2>
                  Health Overview
                </h2>
              </div>
            </div>

            <div className="health-list">
              <div>
                <span>
                  API Providers
                </span>

                <b className="status-ok">
                  {enabledProviders.length}{" "}
                  active
                </b>
              </div>

              <div>
                <span>
                  Primary Provider
                </span>

                <b className="status-ok">
                  {primaryProvider?.name ||
                    "Not configured"}
                </b>
              </div>

              <div>
                <span>
                  Anime Records
                </span>

                <b>
                  {anime.length}
                </b>
              </div>

              <div>
                <span>
                  Episodes
                </span>

                <b>
                  {episodes.length}
                </b>
              </div>

              <div>
                <span>
                  Storage
                </span>

                <b className="status-warning">
                  Local
                </b>
              </div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-label">
                  PLATFORM
                </div>

                <h2>
                  Current Statistics
                </h2>
              </div>
            </div>

            <div className="mini-stat-grid">
              <div>
                <Tv size={18} />

                <strong>
                  {providers.length}
                </strong>

                <span>
                  APIs
                </span>
              </div>

              <div>
                <Film size={18} />

                <strong>
                  {anime.length}
                </strong>

                <span>
                  Anime
                </span>
              </div>

              <div>
                <PlaySquare size={18} />

                <strong>
                  {episodes.length}
                </strong>

                <span>
                  Episodes
                </span>
              </div>

              <div>
                <Users size={18} />

                <strong>
                  {users.length}
                </strong>

                <span>
                  Users
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
