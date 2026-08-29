import { Link } from "react-router-dom";

export default function EpisodeList({
  anime,
  episodes = [],
  currentEpisode,
}) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="state-box">
        <p>No episode data available.</p>
      </div>
    );
  }

  return (
    <div className="episode-list">
      {episodes.map((episode) => {
        const episodeNumber = Number(
          episode.number
        );

        const isActive =
          Number(currentEpisode) ===
          episodeNumber;

        return (
          <Link
            key={
              episode.id ??
              `episode-${episodeNumber}`
            }
            to={`/watch/${anime.id}/${episodeNumber}`}
            className={
              isActive
                ? "episode active"
                : "episode"
            }
            title={
              episode.title ||
              `Episode ${episodeNumber}`
            }
          >
            <span>
              Episode {episodeNumber}
            </span>
          </Link>
        );
      })}
    </div>
    );
}
 
