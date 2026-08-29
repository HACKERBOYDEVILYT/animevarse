import { useEffect, useState } from "react";
import { searchAnime } from "../services/api";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import SearchBar from "../components/SearchBar";
import AnimeGrid from "../components/AnimeGrid";
import Loading from "../components/Loading";
import useDebounce from "../hooks/useDebounce";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const debounced = useDebounce(query);
  const result = await searchAnime(
  query,
  page
);

setAnime(result.items);

setPagination(result);

  useEffect(() => {
    setLoading(true);

    searchAnime(debounced)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debounced]);
  <Pagination
  page={page}
  hasNextPage={pagination.hasNextPage}
  onPageChange={(nextPage) => {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }}
  loading={loading}
/>

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <h1>Search Anime</h1>
        <p className="page-subtitle">
          Find your next favorite anime.
        </p>

        <SearchBar value={query} onChange={setQuery} />

        {loading ? <Loading /> : <AnimeGrid anime={results} />}
      </main>

      <MobileNav />
    </div>
  );
}
