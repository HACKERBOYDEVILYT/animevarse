import { Link } from "react-router-dom";
import { Play, Plus, Info } from "lucide-react";

function Hero({ anime }) {
  if (!anime) return null;

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(
          90deg,
          rgba(5,5,8,1) 0%,
          rgba(5,5,8,.85) 40%,
          rgba(5,5,8,.2) 100%
        ), url(${anime.banner})`,
      }}
    >
      <div className="hero-content">
        <span className="hero-label">#1 TRENDING</span>

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
            <Play size={19} fill="currentColor" />
            Watch Now
          </Link>

          <Link
            to={`/anime/${anime.id}`}
            className="secondary-button"
          >
            <Info size={19} />
            Details
          </Link>

          <button className="circle-button">
            <Plus size={21} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
