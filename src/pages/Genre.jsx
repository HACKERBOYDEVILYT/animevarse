import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import AnimeGrid from "../components/AnimeGrid";
import { getAnimeByGenre } from "../services/api";

export default function Genre() {
  const { genre } = useParams();
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    getAnimeByGenre(genre).then(setAnime);
  }, [genre]);

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>
          {genre.charAt(0).toUpperCase() + genre.slice(1)}
        </h1>

        <p className="page-subtitle">
          Anime in this genre.
        </p>

        <AnimeGrid anime={anime} />
      </main>

      <MobileNav />
    </div>
  );
}
