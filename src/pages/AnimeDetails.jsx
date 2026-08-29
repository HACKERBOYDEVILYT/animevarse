import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Plus,
  Play,
  Check
} from "lucide-react";

import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import AnimeRow from "../components/AnimeRow";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

import {
  getAnimeById,
  getPopularAnime
} from "../services/api";

import useLibraryStore from "../store/useLibraryStore";

export default function AnimeDetails() {
  const { id } = useParams();

  const [anime, setAnime] = useState(null);
  const [related, setRelated] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const watchlist = useLibraryStore(
    (state) => state.watchlist
  );

  const toggleWatchlist = useLibraryStore(
    (state) => state.toggleWatchlist
  );

  const isSaved = watchlist.some(
    (item) => String(item.id) === String(id)
  );

  useEffect(() => {
    let mounted = true;

    async function loadAnime() {
      try {
        setLoading(true);
        setError("");

        const animeData = await getAnimeById(id);

        if (!mounted) return;

        setAnime(animeData);

        try {
          const popularData =
            await getPopularAnime(1);

          if (!mounted) return;

          const relatedAnime =
            (popularData.items || [])
              .filter(
                (item) =>
                  String(item.id) !== String(id)
              )
              .slice(0, 12);

          setRelated(relatedAnime);
        } catch (relatedError) {
          console.warn(
            "Related anime failed:",
            relatedError
          );

          setRelated([]);
        }
      } catch (err) {
        console.error(
          "Anime details error:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load anime details."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadAnime();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading text="Loading anime..." />;
  }

  return (
    <div className="app">
      <Navbar />

      {error || !anime ? (
        <main className="page">
          <ErrorState
            message={
              error || "Anime not found."
            }
          />
        </main>
      ) : (
        <main>
          <section
            className="details-hero"
            style={{
              backgroundImage: anime.banner
                ? `url(${anime.banner})`
                : undefined
            }}
          >
            <div className="details-overlay" />

            <div className="details-content">
              <img
                className="details-poster"
                src={anime.image}
                alt={anime.title}
                loading="eager"
              />

              <div className="details-info">
                <span className="hero-label">
                  ANIME
                </span>

                <h1>{anime.title}</h1>

                <div className="hero-meta">
                  <span>
                    {anime.year || "N/A"}
                  </span>

                  <span>•</span>

                  <span>
                    {anime.type || "Unknown"}
                  </span>

                  <span>•</span>

                  <span>
                    ⭐ {anime.rating || "N/A"}
                  </span>
                </div>

                <p>
                  {anime.description ||
                    "No description available."}
                </p>

                <div className="hero-buttons">
                  <Link
                    to={`/watch/${anime.id}/1`}
                    className="primary-button"
                  >
                    <Play
                      size={18}
                      fill="currentColor"
                    />

                    Start Watching
                  </Link>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      toggleWatchlist(anime)
                    }
                  >
                    {isSaved ? (
                      <Check size={18} />
                    ) : (
                      <Plus size={18} />
                    )}

                    {isSaved
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
              {anime.genres?.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${encodeURIComponent(
                    genre.name.toLowerCase()
                  )}`}
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section className="content-section">
              <h2>More Like This</h2>

              <AnimeRow anime={related} />
            </section>
          )}
        </main>
      )}

      <MobileNav />
    </div>
    );
}
    
