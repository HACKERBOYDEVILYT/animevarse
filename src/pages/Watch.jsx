import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import VideoPlayer from "../components/VideoPlayer";
import EpisodeList from "../components/EpisodeList";
import { getAnimeById } from "../services/api";
import useLibraryStore from "../store/useLibraryStore";

export default function Watch() {
  const { animeId, episode } = useParams();
  const [anime, setAnime] = useState(null);

  const addToHistory = useLibraryStore(
    (state) => state.addToHistory
  );

  useEffect(() => {
    getAnimeById(animeId).then((item) => {
      setAnime(item);

      if (item) {
        addToHistory(item, Number(episode));
      }
    });
  }, [animeId, episode, addToHistory]);

  if (!anime) return null;

  return (
    <div className="app">
      <Navbar />

      <main className="watch-page">
        <VideoPlayer
          title={`${anime.title} — Episode ${episode}`}
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
            currentEpisode={episode}
          />
        </section>
      </main>

      <MobileNav />
    </div>
  );
}
