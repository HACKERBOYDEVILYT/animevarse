import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import VideoPlayer from "../components/VideoPlayer";
import EpisodeList from "../components/EpisodeList";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

import {
  getAnimeById,
  getAnimeEpisodes
} from "../services/api";

import useLibraryStore from "../store/useLibraryStore";

export default function Watch() {
  const { animeId, episode } = useParams();

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addToHistory = useLibraryStore(
    (state) => state.addToHistory
  );

  useEffect(() => {
    let mounted = true;

    async function loadWatchPage() {
      try {
        setLoading(true);
        setError("");

        const [animeData, episodeData] =
          await Promise.all([
            getAnimeById(animeId),
            getAnimeEpisodes(animeId)
          ]);

        if (!mounted) return;

        setAnime(animeData);

        // IMPORTANT:
        // getAnimeEpisodes() returns an object
        // with an "items" array.
        setEpisodes(episodeData?.items || []);

        addToHistory(
          animeData,
          Number(episode)
        );
      } catch (err) {
        console.error(
          "Watch page error:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load this anime."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (animeId) {
      loadWatchPage();
    }

    return () => {
      mounted = false;
    };
  }, [animeId, episode, addToHistory]);

  if (loading) {
    return <Loading text="Loading episode..." />;
  }

  if (error || !anime) {
    return (
      <div className="app">
        <Navbar />

        <main className="page">
          <ErrorState
            message={
              error ||
              "Anime not found."
            }
          />
        </main>

        <MobileNav />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main className="watch-page">

        <VideoPlayer
          title={`${anime.title} — Episode ${episode}`}
          trailer={anime.trailer}
        />

        <div className="watch-info">
          <div>
            <h1>{anime.title}</h1>

            <p>
              Episode {episode}
            </p>
          </div>

          <Link
            to={`/anime/${anime.id}`}
            className="secondary-button"
          >
            Back to Details
          </Link>
        </div>

        <section className="episodes-section">
          <h2>Episodes</h2>

          <EpisodeList
            anime={anime}
            episodes={episodes}
            currentEpisode={episode}
          />
        </section>

      </main>

      <MobileNav />
    </div>
    );
}
  
