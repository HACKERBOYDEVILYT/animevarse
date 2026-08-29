import { Link } from "react-router-dom";

export default function EpisodeList({ anime, currentEpisode }) {
  const count = Math.min(anime?.episodes || 12, 100);

  return (
    <div className="episode-list">
      {Array.from({ length: count }, (_, index) => {
        const episode = index + 1;

        return (
          <Link
            key={episode}
            to={`/watch/${anime.id}/${episode}`}
            className={
              Number(currentEpisode) === episode
                ? "episode active"
                : "episode"
            }
          >
            {episode}
          </Link>
        );
      })}
    </div>
  );
}
