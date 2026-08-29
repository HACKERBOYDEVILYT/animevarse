import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import AnimeGrid from "../components/AnimeGrid";
import useLibraryStore from "../store/useLibraryStore";

export default function Watchlist() {
  const watchlist = useLibraryStore(
    (state) => state.watchlist
  );

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>My Watchlist</h1>
        <p className="page-subtitle">
          Anime you want to watch later.
        </p>

        <AnimeGrid anime={watchlist} />
      </main>

      <MobileNav />
    </div>
  );
}
