import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found">
      <div>
        <strong>404</strong>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>

        <Link to="/" className="primary-button">
          Back Home
        </Link>
      </div>
    </main>
  );
}
