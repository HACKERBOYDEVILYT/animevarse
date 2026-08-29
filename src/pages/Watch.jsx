import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import VideoPlayer from "../components/VideoPlayer";
import EpisodeList from "../components/EpisodeList";

import {
  getAnimeById,
  getAnimeEpisodes,
} from "../services/animeApi";

import useLibraryStore from "../store/useLibraryStore";

export default function Watch() {
  const { animeId, episode } = useParams();

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const addToHistory = useLibraryStore(
    (state) => state.addToHistory
  );

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);

        const [animeData, episodeData] =
          await Promise.all([
            getAnimeById(animeId),
            getAnimeEpisodes(animeId),
          ]);

        if (!active) return;

        setAnime(animeData);
        setEpisodes(episodeData);

        addToHistory(
          animeData,
          Number(episode)
        );
      } catch (error) {
        console.error(error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [animeId, episode, addToHistory]);

  if (loading) {
    return (
      <div className="loading-screen">
        Loading episode...
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="state-box">
        Anime not found.
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
            <p>Episode {episode}</p>
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
