import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, Play, Check } from "lucide-react";

import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import Loading from "../components/Loading";
import AnimeRow from "../components/AnimeRow";
import { getAnimeById, getAnimeList } from "../services/api";
import useLibraryStore from "../store/useLibraryStore";

export default function AnimeDetails() {
  const { id } = useParams();

  const [anime, setAnime] = useState(null);
  const [related, setRelated] = useState([]);

  const watchlist = useLibraryStore(
    (state) => state.watchlist
  );
  const toggleWatchlist = useLibraryStore(
    (state) => state.toggleWatchlist
  );

  const saved = watchlist.some((item) => item.id === id);

  useEffect(() => {
    Promise.all([
      getAnimeById(id),
      getAnimeList(),
    ]).then(([item, list]) => {
      setAnime(item);
      setRelated(
        list.filter((x) => x.id !== id)
      );
    });
  }, [id]);

  if (!anime) return <Loading />;

  return (
    <div className="app">
      <Navbar />

      <main>
        <section className="details-hero">
          <img src={anime.banner} alt="" />

          <div className="details-overlay" />

          <div className="details-content">
            <img
              className="details-poster"
              src={anime.image}
              alt={anime.title}
            />

            <div>
              <span className="hero-label">ANIME</span>

              <h1>{anime.title}</h1>

              <div className="hero-meta">
                <span>{anime.year}</span>
                <span>•</span>
                <span>{anime.type}</span>
                <span>•</span>
                <span>⭐ {anime.rating}</span>
              </div>

              <p>{anime.description}</p>

              <div className="hero-buttons">
                <Link
                  to={`/watch/${anime.id}/1`}
                  className="primary-button"
                >
                  <Play size={18} fill="currentColor" />
                  Start Watching
                </Link>

                <button
                  className="secondary-button"
                  onClick={() => toggleWatchlist(anime)}
                >
                  {saved ? (
                    <Check size={18} />
                  ) : (
                    <Plus size={18} />
                  )}

                  {saved
                    ? "In Watchlist"
                    : "Add to Watchlist"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Genres</h2>

          <div className="genre-pills">
            {anime.genre.map((genre) => (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase()}`}
              >
                {genre}
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section">
          <h2>More Like This</h2>
          <AnimeRow anime={related} />
        </section>
      </main>

      <MobileNav />
    </div>
  );
}
