import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import AnimeGrid from "../components/AnimeGrid";
import useLibraryStore from "../store/useLibraryStore";

export default function History() {
  const history = useLibraryStore(
    (state) => state.history
  );

  const clearHistory = useLibraryStore(
    (state) => state.clearHistory
  );

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <div className="page-title-row">
          <div>
            <h1>Watch History</h1>
            <p className="page-subtitle">
              Continue where you left off.
            </p>
          </div>

          {history.length > 0 && (
            <button
              className="secondary-button"
              onClick={clearHistory}
            >
              Clear History
            </button>
          )}
        </div>

        <AnimeGrid anime={history} />
      </main>

      <MobileNav />
    </div>
  );
}
