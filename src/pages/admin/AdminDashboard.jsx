import {
  Film,
  PlaySquare,
  Star,
  Tv,
  Users,
  BarChart3,
  ExternalLink,
  Settings,
  Plus,
  Trash2,
  Edit3,
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

  const deleteAnime = useAdminStore(
    (state) => state.deleteAnime
  );

  const toggleAnime = useAdminStore(
    (state) => state.toggleAnime
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

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this anime and all its episodes?"
    );

    if (confirmed) {
      deleteAnime(id);
    }
  }

  return (
    <div className="admin-layout">
      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="admin-sidebar">
        <div className="admin-logo">
          Anime<span>Verse</span>
        </div>

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
            <Tv size={18} />
            Providers
          </Link>

          <Link
            to="/admin/users"
            className="admin-nav-link"
          >
            <Users size={18} />
            Users
          </Link>

          <Link
            to="/admin/analytics"
            className="admin-nav-link"
          >
            <BarChart3 size={18} />
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

        <Link
          to="/"
          className="admin-site-link"
        >
          <ExternalLink size={17} />
          View Website
        </Link>
      </aside>

      {/* =========================
          MAIN
      ========================== */}

      <main className="admin-main">
        {/* HEADER */}

        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>

            <p>
              Manage your AnimeVerse website
            </p>
          </div>

          <Link
            to="/admin/anime?action=add"
            className="primary-button"
          >
            <Plus size={18} />
            Add Anime
          </Link>
        </header>

        {/* STATS */}

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
                  <Icon size={22} />
                </div>

                <div className="admin-stat-content">
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

        {/* QUICK ACTIONS */}

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your content quickly.
              </p>
            </div>
          </div>

          <div className="admin-actions">
            <Link
              to="/admin/anime?action=add"
              className="primary-button"
            >
              <Plus size={17} />
              Add Anime
            </Link>

            <Link
              to="/admin/episodes?action=add"
              className="secondary-button"
            >
              <Plus size={17} />
              Add Episode
            </Link>

            <Link
              to="/admin/providers?action=add"
              className="secondary-button"
            >
              <Plus size={17} />
              Add Provider
            </Link>

            <Link
              to="/admin/featured"
              className="secondary-button"
            >
              <Star size={17} />
              Manage Featured
            </Link>
          </div>
        </section>

        {/* ANIME TABLE */}

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>
                Anime Management
              </h2>

              <p>
                Recently added anime.
              </p>
            </div>

            <Link
              to="/admin/anime"
              className="secondary-button"
            >
              View All
            </Link>
          </div>

          {anime.length === 0 ? (
            <div className="admin-empty">
              <Film size={36} />

              <h3>
                No anime added yet
              </h3>

              <p>
                Add your first anime from
                the Anime Manager.
              </p>

              <Link
                to="/admin/anime?action=add"
                className="primary-button"
              >
                <Plus size={17} />
                Add Anime
              </Link>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      Anime
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Episodes
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {anime
                    .slice(0, 10)
                    .map((item) => {
                      const episodeCount =
                        episodes.filter(
                          (episode) =>
                            String(
                              episode.animeId
                            ) ===
                            String(item.id)
                        ).length;

                      return (
                        <tr
                          key={item.id}
                        >
                          <td>
                            <div className="admin-anime-cell">
                              {item.cover ||
                              item.image ? (
                                <img
                                  src={
                                    item.cover ||
                                    item.image
                                  }
                                  alt={
                                    item.title ||
                                    "Anime"
                                  }
                                />
                              ) : (
                                <div className="admin-image-placeholder">
                                  <Film
                                    size={18}
                                  />
                                </div>
                              )}

                              <div>
                                <strong>
                                  {item.title ||
                                    item.name ||
                                    "Untitled"}
                                </strong>

                                <small>
                                  ID:{" "}
                                  {item.id}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <button
                              type="button"
                              className={
                                item.enabled
                                  ? "status-ok"
                                  : "status-off"
                              }
                              onClick={() =>
                                toggleAnime(
                                  item.id
                                )
                              }
                            >
                              {item.enabled
                                ? "Active"
                                : "Disabled"}
                            </button>
                          </td>

                          <td>
                            {episodeCount}
                          </td>

                          <td>
                            <div className="admin-row-actions">
                              <Link
                                to={`/admin/anime/edit/${item.id}`}
                                className="icon-button"
                                title="Edit"
                              >
                                <Edit3
                                  size={17}
                                />
                              </Link>

                              <button
                                type="button"
                                className="icon-button danger"
                                title="Delete"
                                onClick={() =>
                                  handleDelete(
                                    item.id
                                  )
                                }
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SYSTEM STATUS */}

        <section className="admin-grid">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>
                  API Status
                </h2>

                <p>
                  Anime data providers.
                </p>
              </div>
            </div>

            <div className="health-list">
              <div>
                <span>
                  AniList
                </span>

                <b className="status-ok">
                  Primary
                </b>
              </div>

              <div>
                <span>
                  Jikan
                </span>

                <b className="status-ok">
                  Fallback
                </b>
              </div>

              <div>
                <span>
                  Providers
                </span>

                <b className="status-ok">
                  {providers.length}
                </b>
              </div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>
                  Statistics
                </h2>

                <p>
                  Current local data.
                </p>
              </div>
            </div>

            <div className="health-list">
              <div>
                <span>
                  Anime
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
                  Users
                </span>

                <b>
                  {users.length}
                </b>
              </div>

              <div>
                <span>
                  Featured
                </span>

                <b>
                  {featured.length}
                </b>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
