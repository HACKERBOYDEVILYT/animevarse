import { Link } from "react-router-dom";

export default function EpisodeList({
  anime,
  episodes = [],
  currentEpisode
}) {
  if (!episodes.length) {
    return (
      <div className="state-box">
        <p>
          No episode data available.
        </p>
      </div>
    );
  }

  return (
    <div className="episode-list">
      {episodes.map((episode) => {
        const episodeNumber =
          Number(episode.number);

        const active =
          Number(currentEpisode) ===
          episodeNumber;

        return (
          <Link
            key={episode.id}
            to={`/watch/${anime.id}/${episodeNumber}`}
            className={
              active
                ? "episode active"
                : "episode"
            }
            title={
              episode.title ||
              `Episode ${episodeNumber}`
            }
          >
            <span>
              EP {episodeNumber}
            </span>
          </Link>
        );
    }
