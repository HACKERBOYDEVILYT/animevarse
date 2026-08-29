const API_BASE = "https://api.jikan.moe/v4";

const cache = new Map();
const pendingRequests = new Map();

const CACHE_TIME = 5 * 60 * 1000;
const REQUEST_TIMEOUT = 15000;

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
    timestamp: Date.now()
  });
}

async function request(endpoint, options = {}) {
  const {
    cacheEnabled = true,
    forceRefresh = false
  } = options;

  const cacheKey = endpoint;

  if (cacheEnabled && !forceRefresh) {
    const cached = getCache(cacheKey);

    if (cached) {
      return cached;
    }
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  const promise = fetch(`${API_BASE}${endpoint}`, {
    signal: controller.signal,
    headers: {
      Accept: "application/json"
    }
  })
    .then(async (response) => {
      if (!response.ok) {
        let message = `Jikan API error: ${response.status}`;

        try {
          const body = await response.json();

          if (body?.message) {
            message = body.message;
          }
        } catch {}

        throw new Error(message);
      }

      const json = await response.json();

      if (cacheEnabled) {
        setCache(cacheKey, json);
      }

      return json;
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        throw new Error(
          "The anime API request timed out. Please try again."
        );
      }

      throw error;
    })
    .finally(() => {
      clearTimeout(timeout);
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, promise);

  return promise;
}

export function normalizeAnime(item = {}) {
  return {
    id: String(item.mal_id ?? ""),
    malId: item.mal_id ?? null,

    title:
      item.title_english ||
      item.title ||
      "Unknown Anime",

    japaneseTitle: item.title_japanese || "",

    image:
      item.images?.webp?.large_image_url ||
      item.images?.jpg?.large_image_url ||
      item.images?.webp?.image_url ||
      item.images?.jpg?.image_url ||
      "",

    smallImage:
      item.images?.webp?.image_url ||
      item.images?.jpg?.image_url ||
      "",

    banner:
      item.trailer?.images?.maximum_image_url ||
      item.trailer?.images?.large_image_url ||
      item.images?.webp?.large_image_url ||
      item.images?.jpg?.large_image_url ||
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
        name: genre.name
      })) || [],

    studios:
      item.studios?.map((studio) => studio.name) || [],

    duration: item.duration || null,

    source: item.source || null
  };
}

function normalizePagination(json = {}) {
  return {
    currentPage:
      json.pagination?.current_page || 1,

    lastPage:
      json.pagination?.last_visible_page || 1,

    hasNextPage:
      Boolean(json.pagination?.has_next_page),

    items:
      json.data?.map(normalizeAnime) || []
  };
}

export async function getTrendingAnime(page = 1) {
  const json = await request(
    `/top/anime?filter=airing&limit=24&page=${page}`
  );

  return normalizePagination(json);
}

export async function getPopularAnime(page = 1) {
  const json = await request(
    `/top/anime?filter=bypopularity&limit=24&page=${page}`
  );

  return normalizePagination(json);
}

export async function getSeasonalAnime(page = 1) {
  const json = await request(
    `/seasons/now?limit=24&page=${page}`
  );

  return normalizePagination(json);
}

export async function searchAnime(query, page = 1) {
  if (!query?.trim()) {
    return {
      currentPage: 1,
      lastPage: 1,
      hasNextPage: false,
      items: []
    };
  }

  const json = await request(
    `/anime?q=${encodeURIComponent(
      query.trim()
    )}&limit=24&page=${page}&sfw=true`
  );

  return normalizePagination(json);
}

export async function getAnimeById(id) {
  if (!id) {
    throw new Error("Anime ID is required.");
  }

  const json = await request(
    `/anime/${encodeURIComponent(id)}/full`
  );

  return normalizeAnime(json.data);
}

export async function getAnimeEpisodes(id, page = 1) {
  if (!id) {
    throw new Error("Anime ID is required.");
  }

  const json = await request(
    `/anime/${encodeURIComponent(id)}/episodes?page=${page}`
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
        recap: episode.recap
      })) || []
  };
}

const GENRE_IDS = {
  action: 1,
  adventure: 2,
  cars: 3,
  comedy: 4,
  avantgarde: 5,
  "avant-garde": 5,
  demons: 6,
  mystery: 7,
  drama: 8,
  ecchi: 9,
  fantasy: 10,
  game: 11,
  historical: 13,
  horror: 14,
  kids: 15,
  martialarts: 17,
  "martial-arts": 17,
  mecha: 18,
  music: 19,
  parody: 20,
  samurai: 21,
  romance: 22,
  school: 23,
  scifi: 24,
  "sci-fi": 24,
  shoujo: 25,
  girlslove: 26,
  "girls-love": 26,
  shounen: 27,
  seinen: 42,
  josei: 43,
  sports: 30,
  supernatural: 37,
  suspense: 41,
  thriller: 41,
  vampire: 32,
  "slice-of-life": 36,
  sliceoflife: 36
};

export async function getAnimeByGenre(
  genre,
  page = 1
) {
  const raw = String(genre || "")
    .trim()
    .toLowerCase();

  const genreId =
    GENRE_IDS[raw] ||
    (/^\d+$/.test(raw) ? raw : null);

  if (!genreId) {
    throw new Error(
      `Unknown anime genre: ${genre}`
    );
  }

  const json = await request(
    `/anime?genres=${genreId}&limit=24&page=${page}&sfw=true`
  );

  return normalizePagination(json);
}

export function clearAnimeCache() {
  cache.clear();
}

export async function refreshAnime(endpoint) {
  return request(endpoint, {
    forceRefresh: true
  });
}
