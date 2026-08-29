import { NavLink } from "react-router-dom";
import { Home, Search, Flame, Bookmark, User } from "lucide-react";

const items = [
  ["/", "Home", Home],
  ["/search", "Search", Search],
  ["/trending", "Trending", Flame],
  ["/watchlist", "Library", Bookmark],
  ["/profile", "Profile", User],
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {items.map(([path, label, Icon]) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            isActive ? "mobile-link active" : "mobile-link"
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
