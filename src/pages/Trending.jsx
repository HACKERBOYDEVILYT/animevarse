import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import AnimeGrid from "../components/AnimeGrid";
import { getTrendingAnime } from "../services/api";

export default function Trending() {
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    getTrendingAnime().then(setAnime);
  }, []);

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>Trending Anime</h1>
        <p className="page-subtitle">
          The hottest anime right now.
        </p>

        <AnimeGrid anime={anime} />
      </main>

      <MobileNav />
    </div>
  );
}
