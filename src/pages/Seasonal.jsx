import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import AnimeGrid from "../components/AnimeGrid";
import { getSeasonalAnime } from "../services/api";

export default function Seasonal() {
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    getSeasonalAnime().then(setAnime);
  }, []);

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>Seasonal Anime</h1>
        <p className="page-subtitle">
          Discover the latest releases.
        </p>

        <AnimeGrid anime={anime} />
      </main>

      <MobileNav />
    </div>
  );
}
