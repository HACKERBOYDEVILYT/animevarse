import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Search from "../pages/Search";
import AnimeDetails from "../pages/AnimeDetails";
import Watch from "../pages/Watch";
import Trending from "../pages/Trending";
import Popular from "../pages/Popular";
import Seasonal from "../pages/Seasonal";
import Genre from "../pages/Genre";
import Watchlist from "../pages/Watchlist";
import History from "../pages/History";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
      <Route
        path="/watch/:animeId/:episode"
        element={<Watch />}
      />
      <Route path="/trending" element={<Trending />} />
      <Route path="/popular" element={<Popular />} />
      <Route path="/seasonal" element={<Seasonal />} />
      <Route path="/genre/:genre" element={<Genre />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile />} />

      {/* Admin - NO LOGIN */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
