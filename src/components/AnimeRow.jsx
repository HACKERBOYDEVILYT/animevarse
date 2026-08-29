import AnimeCard from "./AnimeCard";

export default function AnimeRow({ anime = [] }) {
  return (
    <div className="anime-row">
      {anime.map((item) => (
        <AnimeCard key={item.id} anime={item} />
      ))}
    </div>
  );
}
