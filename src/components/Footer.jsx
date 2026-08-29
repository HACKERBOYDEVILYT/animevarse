import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="logo">
          ANIME<span>VERSE</span>
        </div>
        <p>Your anime universe, beautifully organized.</p>
      </div>

      <div className="footer-links">
        <Link to="/popular">Popular</Link>
        <Link to="/seasonal">Seasonal</Link>
        <Link to="/watchlist">Watchlist</Link>
      </div>

      <p className="copyright">
        © {new Date().getFullYear()} AnimeVerse
      </p>
    </footer>
  );
}
