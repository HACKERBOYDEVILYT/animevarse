const API_BASE = "https://api.jikan.moe/v4";

const cache = new Map();
const pendingRequests = new Map();

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

function getCache(key) {
  const cached = cache.get(key);

  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TIME) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

async function request(endpoint, options = {}) {
  const {
    cacheEnabled = true,
    forceRefresh = false,
  } = options;

  const cacheKey = endpoint;

  if (cacheEnabled && !forceRefresh) {
    const cached = getCache(cacheKey);

    if (cached) {
      return cached;
    }
  }

  // Prevent duplicate simultaneous requests
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const promise = fetch(`${API_BASE}${endpoint}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Jikan API error: ${response.status}`
        );
      }

      const json = await response.json();

      if (cacheEnabled) {
        setCache(cacheKey, json);
      }

      return json;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, promise);

  return promise;
}

function normalizeAnime(item) {
  return {
    id: String(item.mal_id),
    malId: item.mal_id,

    title:
      item.title_english ||
      item.title ||
      "Unknown Anime",

    japaneseTitle: item.title_japanese || "",

    image:
      item.images?.webp?.large_image_url ||
      item.images?.jpg?.large_image_url ||
      "",

    smallImage:
      item.images?.webp?.image_url ||
      item.images?.jpg?.image_url ||
      "",

    banner:
      item.trailer?.images?.maximum_image_url ||
      item.trailer?.images?.large_image_url ||
      item.images?.webp?.large_image_url ||
      "",

    trailer:
      item.trailer?.embed_url ||
      item.trailer?.url ||
      null,

    description:
      item.synopsis ||
      "No description available.",

    rating: item.score || 0,

    episodes: item.episodes || 0,

    type: item.type || "Unknown",

    status: item.status || "Unknown",

    year:
      item.year ||
      item.aired?.prop?.from?.year ||
      null,

    genres:
      item.genres?.map((genre) => ({
        id: genre.mal_id,
        name: genre.name,
      })) || [],

    studios:
      item.studios?.map((studio) => studio.name) || [],

    duration: item.duration || null,
  };
}

/* -----------------------------
   Generic paginated response
----------------------------- */

function normalizePagination(json) {
  return {
    currentPage:
      json.pagination?.current_page || 1,

    lastPage:
      json.pagination?.last_visible_page || 1,

    hasNextPage:
      Boolean(json.pagination?.has_next_page),

    items:
      json.data?.map(normalizeAnime) || [],
  };
}

/* -----------------------------
   Trending
----------------------------- */

export async function getTrendingAnime(
  page = 1
) {
  const json = await request(
    `/top/anime?filter=airing&limit=24&page=${page}`
  );

  return normalizePagination(json);
}

/* -----------------------------
   Popular
----------------------------- */

export async function getPopularAnime(
  page = 1
) {
  const json = await request(
    `/top/anime?filter=bypopularity&limit=24&page=${page}`
  );

  return normalizePagination(json);
}

/* -----------------------------
   Seasonal
----------------------------- */

export async function getSeasonalAnime(
  page = 1
) {
  const json = await request(
    `/seasons/now?limit=24&page=${page}`
  );

  return normalizePagination(json);
}

/* -----------------------------
   Search
----------------------------- */

export async function searchAnime(
  query,
  page = 1
) {
  if (!query?.trim()) {
    return {
      currentPage: 1,
      lastPage: 1,
      hasNextPage: false,
      items: [],
    };
  }

  const json = await request(
    `/anime?q=${encodeURIComponent(
      query.trim()
    )}&limit=24&page=${page}&sfw=true`
  );

  return normalizePagination(json);
}

/* -----------------------------
   Anime details
----------------------------- */

export async function getAnimeById(id) {
  const json = await request(
    `/anime/${id}/full`
  );

  return normalizeAnime(json.data);
}

/* -----------------------------
   Episodes
----------------------------- */

export async function getAnimeEpisodes(
  id,
  page = 1
) {
  const json = await request(
    `/anime/${id}/episodes?page=${page}`
  );

  return {
    currentPage:
      json.pagination?.current_page || page,

    lastPage:
      json.pagination?.last_visible_page || page,

    hasNextPage:
      Boolean(json.pagination?.has_next_page),

    items:
      json.data?.map((episode) => ({
        id: episode.mal_id,
        number: episode.mal_id,
        title:
          episode.title ||
          `Episode ${episode.mal_id}`,
        aired: episode.aired,
        score: episode.score,
        filler: episode.filler,
        recap: episode.recap,
      })) || [],
  };
}

/* -----------------------------
   Genre
----------------------------- */

export async function getAnimeByGenre(
  genreId,
  page = 1
) {
  const json = await request(
    `/anime?genres=${genreId}&limit=24&page=${page}&sfw=true`
  );

  return normalizePagination(json);
}

/* -----------------------------
   Clear cache
----------------------------- */

export function clearAnimeCache() {
  cache.clear();
}

/* -----------------------------
   Force refresh helper
----------------------------- */

export async function refreshAnime(
  endpoint
) {
  return request(endpoint, {
    forceRefresh: true,
  });
}
