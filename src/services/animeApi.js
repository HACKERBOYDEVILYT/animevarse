const anime = [
  {
    id: "one-piece",
    title: "One Piece",
    type: "TV",
    year: 1999,
    rating: 9.0,
    episodes: 1120,
    genre: ["Action", "Adventure", "Fantasy"],
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600",
    banner:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1800",
    description:
      "Follow Monkey D. Luffy and his crew on an epic journey across the Grand Line.",
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    type: "TV",
    year: 2019,
    rating: 8.7,
    episodes: 63,
    genre: ["Action", "Fantasy"],
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600",
    banner:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1800",
    description:
      "Tanjiro begins a dangerous journey after tragedy strikes his family.",
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    type: "TV",
    year: 2020,
    rating: 8.8,
    episodes: 47,
    genre: ["Action", "Supernatural"],
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600",
    banner:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1800",
    description:
      "Yuji enters the dangerous world of cursed spirits and sorcerers.",
  },
  {
    id: "naruto",
    title: "Naruto",
    type: "TV",
    year: 2002,
    rating: 8.4,
    episodes: 220,
    genre: ["Action", "Adventure"],
    image:
      "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?w=600",
    banner:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1800",
    description:
      "A young ninja dreams of becoming the strongest leader of his village.",
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    type: "TV",
    year: 2013,
    rating: 9.1,
    episodes: 89,
    genre: ["Action", "Drama"],
    image:
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600",
    banner:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1800",
    description:
      "Humanity fights for survival against mysterious giant Titans.",
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    type: "TV",
    year: 2016,
    rating: 8.0,
    episodes: 160,
    genre: ["Action", "School"],
    image:
      "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600",
    banner:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1800",
    description:
      "Izuku dreams of becoming a hero despite being born without superpowers.",
  },
];

export async function getAnimeList() {
  return anime;
}

export async function getAnimeById(id) {
  return anime.find((item) => item.id === id) || null;
}

export async function searchAnime(query) {
  const q = query.toLowerCase().trim();

  if (!q) return anime;

  return anime.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.genre.some((g) =>
        g.toLowerCase().includes(q)
      )
  );
}

export async function getTrendingAnime() {
  return anime;
}

export async function getPopularAnime() {
  return [...anime].sort((a, b) => b.rating - a.rating);
}

export async function getSeasonalAnime() {
  return [...anime].reverse();
}

export async function getAnimeByGenre(genre) {
  return anime.filter((item) =>
    item.genre.some(
      (g) => g.toLowerCase() === genre.toLowerCase()
    )
  );
}
