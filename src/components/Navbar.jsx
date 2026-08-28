import { Link, NavLink } from "react-router-dom";
import {
  Search,
  Home,
  Flame,
  Bookmark,
  History,
  User,
} from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/trending", label: "Trending", icon: Flame },
  { to: "/watchlist", label: "Watchlist", icon: Bookmark },
  { to: "/history", label: "History", icon: History },
];

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span>ANIME</span>
        <strong>VERSE</strong>
      </Link>

      <nav className="desktop-nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <Link to="/search" className="icon-button">
          <Search size={21} />
        </Link>

        <Link to="/profile" className="icon-button">
          <User size={21} />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
