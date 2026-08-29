export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="error-state">
      <div className="error-icon">
        !
      </div>

      <h3>Unable to load</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="retry-button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
