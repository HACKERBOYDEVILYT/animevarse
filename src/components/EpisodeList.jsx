import { Link } from "react-router-dom";

export default function EpisodeList({
  anime,
  episodes = [],
  currentEpisode,
}) {
  if (!episodes.length) {
    return (
      <div className="state-box">
        <p>No episode data available.</p>
      </div>
    );
  }

  return (
    <div className="episode-list">
      {episodes.map((episode) => (
        <Link
          key={episode.id}
          to={`/watch/${anime.id}/${episode.number}`}
          className={
            Number(currentEpisode) === episode.number
              ? "episode active"
              : "episode"
          }
          title={episode.title}
        >
          {episode.number}
        </Link>
      ))}
    </div>
  );
}
