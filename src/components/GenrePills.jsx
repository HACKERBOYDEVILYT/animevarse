import { Link } from "react-router-dom";

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Romance",
  "School",
  "Supernatural",
];

export default function GenrePills() {
  return (
    <div className="genre-pills">
      {genres.map((genre) => (
        <Link
          key={genre}
          to={`/genre/${genre.toLowerCase()}`}
        >
          {genre}
        </Link>
      ))}
    </div>
  );
}
