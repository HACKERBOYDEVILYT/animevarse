export default function Pagination({
  page,
  hasNextPage,
  onPageChange,
  loading = false,
}) {
  return (
    <div className="pagination">
      <button
        type="button"
        disabled={
          page <= 1 || loading
        }
        onClick={() =>
          onPageChange(page - 1)
        }
      >
        ← Previous
      </button>

      <span>
        Page <strong>{page}</strong>
      </span>

      <button
        type="button"
        disabled={
          !hasNextPage || loading
        }
        onClick={() =>
          onPageChange(page + 1)
        }
      >
        Next →
      </button>
    </div>
  );
}
