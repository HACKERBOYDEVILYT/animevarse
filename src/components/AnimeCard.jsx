import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";

function AnimeCard({ anime }) {
  return (
    <Link to={`/anime/${anime.id}`} className="anime-card">
      <div className="poster-wrapper">
        <img
          src={anime.image}
          alt={anime.title}
          loading="lazy"
        />

        <div className="poster-overlay">
          <div className="play-button">
            <Play size={20} fill="currentColor" />
          </div>
        </div>

        {anime.episodes && (
          <span className="episode-badge">
            EP {anime.episodes}
          </span>
        )}
      </div>

      <div className="anime-info">
        <h3>{anime.title}</h3>

        <div className="anime-meta">
          {anime.rating && (
            <span>
              <Star size={14} fill="currentColor" />
              {anime.rating}
            </span>
          )}

          {anime.type && <span>{anime.type}</span>}
        </div>
      </div>
    </Link>
  );
}

export default AnimeCard;
