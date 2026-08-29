import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import SearchBar from "../components/SearchBar";
import AnimeGrid from "../components/AnimeGrid";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";

import useDebounce from "../hooks/useDebounce";
import { searchAnime } from "../services/api";

export default function Search() {
  const [query, setQuery] = useState("");
  const [anime, setAnime] = useState([]);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    hasNextPage: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    let mounted = true;

    async function performSearch() {
      const searchTerm = debouncedQuery.trim();

      if (!searchTerm) {
        setAnime([]);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          hasNextPage: false
        });
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await searchAnime(
          searchTerm,
          page
        );

        if (!mounted) return;

        setAnime(result.items || []);
        setPagination(result);
      } catch (err) {
        console.error("Search error:", err);

        if (mounted) {
          setAnime([]);
          setError(
            err?.message ||
              "Search failed. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    performSearch();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery, page]);

  function handlePageChange(nextPage) {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>Search Anime</h1>

        <p className="page-subtitle">
          Find your next favorite anime.
        </p>

        <SearchBar
          value={query}
          onChange={setQuery}
        />

        {loading && (
          <Loading text="Searching anime..." />
        )}

        {!loading && error && (
          <ErrorState message={error} />
        )}

        {!loading &&
          !error &&
          debouncedQuery.trim() &&
          anime.length === 0 && (
            <div className="state-box">
              No anime found.
            </div>
          )}

        {!loading && !error && anime.length > 0 && (
          <AnimeGrid anime={anime} />
        )}

        {!error && debouncedQuery.trim() && (
          <Pagination
            page={page}
            hasNextPage={pagination.hasNextPage}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </main>

      <MobileNav />
    </div>
  );
}
