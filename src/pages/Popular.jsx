import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import AnimeGrid from "../components/AnimeGrid";
import { getPopularAnime } from "../services/api";

export default function Popular() {
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    getPopularAnime().then(setAnime);
  }, []);

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>Popular Anime</h1>
        <p className="page-subtitle">
          Highest-rated fan favorites.
        </p>

        <AnimeGrid anime={anime} />
      </main>

      <MobileNav />
    </div>
  );
}
