const API = "https://api.jikan.moe/v4";

async function request(endpoint) {
  const response = await fetch(`${API}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

function normalizeAnime(item) {
  return {
    id: String(item.mal_id),
    malId: item.mal_id,

    title:
      item.title_english ||
      item.title ||
      "Unknown Anime",

    japaneseTitle: item.title_japanese,

    type: item.type || "Unknown",

    year:
      item.year ||
      item.aired?.prop?.from?.year ||
      null,

    rating: item.score || 0,

    episodes: item.episodes || 0,

    status: item.status || "Unknown",

    image:
      item.images?.webp?.large_image_url ||
      item.images?.jpg?.large_image_url ||
      "",

    banner:
      item.trailer?.images?.maximum_image_url ||
      item.trailer?.images?.large_image_url ||
      item.images?.webp?.large_image_url ||
      "",

    trailer: item.trailer?.embed_url || null,

    description:
      item.synopsis ||
      "No description available.",

    genres:
      item.genres?.map((genre) => genre.name) || [],

    studios:
      item.studios?.map((studio) => studio.name) || [],

    source: item.source || null,

    duration: item.duration || null,
  };
}

/* Trending / top */

export async function getTrendingAnime() {
  const data = await request(
    "/top/anime?filter=airing&limit=12"
  );

  return data.map(normalizeAnime);
}

/* Popular */

export async function getPopularAnime() {
  const data = await request(
    "/top/anime?filter=bypopularity&limit=24"
  );

  return data.map(normalizeAnime);
}

/* Seasonal */

export async function getSeasonalAnime() {
  const data = await request(
    "/seasons/now?limit=24"
  );

  return data.map(normalizeAnime);
}

/* Search */

export async function searchAnime(query) {
  if (!query?.trim()) {
    return [];
  }

  const data = await request(
    `/anime?q=${encodeURIComponent(
      query
    )}&limit=24&sfw=true`
  );

  return data.map(normalizeAnime);
}

/* Details */

export async function getAnimeById(id) {
  const data = await request(
    `/anime/${id}/full`
  );

  return normalizeAnime(data);
}

/* Episodes */

export async function getAnimeEpisodes(id, page = 1) {
  const data = await request(
    `/anime/${id}/episodes?page=${page}`
  );

  return data.map((episode) => ({
    id: episode.mal_id,
    number: episode.mal_id,
    title:
      episode.title ||
      `Episode ${episode.mal_id}`,
    aired: episode.aired,
    score: episode.score,
    filler: episode.filler,
    recap: episode.recap,
  }));
}

/* Genre */

export async function getAnimeByGenre(genreId) {
  const data = await request(
    `/anime?genres=${genreId}&limit=24&sfw=true`
  );

  return data.map(normalizeAnime);
}
