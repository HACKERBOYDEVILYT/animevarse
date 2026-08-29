import {
  useEffect,
  useState,
} from "react";

import AnimeGrid from "../components/AnimeGrid";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";

import { getPopularAnime } from "../services/api";

export default function Popular() {
  const [anime, setAnime] = useState([]);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState({
      hasNextPage: false,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  async function loadAnime(
    currentPage = 1
  ) {
    try {
      setLoading(true);
      setError(null);

      const result =
        await getPopularAnime(
          currentPage
        );

      setAnime(result.items);

      setPagination(result);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load popular anime."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnime(page);
  }, [page]);

  const handlePageChange = (
    nextPage
  ) => {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="page">
      <div className="page-header">
        <span>DISCOVER</span>
        <h1>Popular Anime</h1>
        <p>
          The most popular anime right now.
        </p>
      </div>

      {loading && (
        <Loading text="Loading anime..." />
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={() =>
            loadAnime(page)
          }
        />
      )}

      {!loading &&
        !error &&
        anime.length > 0 && (
          <>
            <AnimeGrid anime={anime} />

            <Pagination
              page={page}
              hasNextPage={
                pagination.hasNextPage
              }
              onPageChange={
                handlePageChange
              }
              loading={loading}
            />
          </>
        )}
    </main>
  );
}
