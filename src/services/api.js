const ANILIST_API = "https://graphql.anilist.co";
const JIKAN_API = "https://api.jikan.moe/v4";

const cache = new Map();
const pendingRequests = new Map();

const CACHE_TIME = 5 * 60 * 1000;
const REQUEST_TIMEOUT = 15000;
const MAX_RETRIES = 2;

/* =========================================================
   GENERIC HELPERS
========================================================= */

function getCache(key) {
  const cached = cache.get(key);

  if (!cached) return null;

  if (
    Date.now() - cached.timestamp >
    CACHE_TIME
  ) {
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

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

async function fetchWithTimeout(
  url,
  options = {},
  timeout = REQUEST_TIMEOUT
) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

/* =========================================================
   ANILIST PRIMARY API
========================================================= */

async function anilistRequest(
  query,
  variables = {},
  cacheKey = null
) {
  const key =
    cacheKey ||
    `anilist:${query}:${JSON.stringify(
      variables
    )}`;

  const cached = getCache(key);

  if (cached) {
    return cached;
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = (async () => {
    let lastError = null;

    for (
      let attempt = 0;
      attempt <= MAX_RETRIES;
      attempt++
    ) {
      try {
        const response =
          await fetchWithTimeout(
            ANILIST_API,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json"
              },

              body: JSON.stringify({
                query,
                variables
              })
            }
          );

        if (!response.ok) {
          throw new Error(
            `AniList HTTP ${response.status}`
          );
        }

        const json =
          await response.json();

        if (
          json.errors &&
          json.errors.length > 0
        ) {
          throw new Error(
            json.errors[0]?.message ||
              "AniList GraphQL error"
          );
        }

        setCache(key, json.data);

        return json.data;
      } catch (error) {
        lastError = error;

        if (attempt < MAX_RETRIES) {
          await sleep(
            700 * (attempt + 1)
          );
        }
      }
    }

    throw lastError;
  })();

  pendingRequests.set(key, promise);

  try {
    return await promise;
  } finally {
    pendingRequests.delete(key);
  }
}

/* =========================================================
   JIKAN FALLBACK API
========================================================= */

async function jikanRequest(
  endpoint,
  options = {}
) {
  const {
    cacheEnabled = true,
    forceRefresh = false
  } = options;

  const cacheKey = `jikan:${endpoint}`;

  if (cacheEnabled && !forceRefresh) {
    const cached = getCache(cacheKey);

    if (cached) {
      return cached;
    }
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const promise = (async () => {
    let lastError = null;

    for (
      let attempt = 0;
      attempt <= MAX_RETRIES;
      attempt++
    ) {
      try {
        const response =
          await fetchWithTimeout(
            `${JIKAN_API}${endpoint}`,
            {
              headers: {
                Accept:
                  "application/json"
              }
            }
          );

        if (!response.ok) {
          throw new Error(
            `Jikan HTTP ${response.status}`
          );
        }

        const json =
          await response.json();

        if (cacheEnabled) {
          setCache(
            cacheKey,
            json
          );
        }

        return json;
      } catch (error) {
        lastError = error;

        if (attempt < MAX_RETRIES) {
          await sleep(
            1000 * (attempt + 1)
          );
        }
      }
    }

    throw lastError;
  })();

  pendingRequests.set(
    cacheKey,
    promise
  );

  try {
    return await promise;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

/* =========================================================
   ANILIST NORMALIZER
========================================================= */

function cleanDescription(description) {
  if (!description) {
    return "No description available.";
  }

  return description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/~!/g, "")
    .replace(/!~/g, "")
    .trim();
}

function normalizeAniListAnime(
  item = {}
) {
  const title =
    item.title?.english ||
    item.title?.romaji ||
    item.title?.native ||
    "Unknown Anime";

  const year =
    item.seasonYear ||
    item.startDate?.year ||
    null;

  const image =
    item.coverImage?.extraLarge ||
    item.coverImage?.large ||
    "";

  const trailer =
    item.trailer?.site ===
      "youtube"
      ? item.trailer?.id
        ? `https://www.youtube.com/watch?v=${item.trailer.id}`
        : null
      : null;

  const streamingEpisodes =
    Array.isArray(
      item.streamingEpisodes
    )
      ? item.streamingEpisodes
          .filter(
            (episode) =>
              episode?.url
          )
          .map((episode) => ({
            title:
              episode.title ||
              "Episode",

            thumbnail:
              episode.thumbnail ||
              null,

            url:
              episode.url,

            site:
              episode.site ||
              "Official"
          }))
      : [];

  return {
    id: String(
      item.idMal ??
        item.id ??
        ""
    ),

    malId:
      item.idMal ??
      null,

    aniListId:
      item.id ??
      null,

    title,

    japaneseTitle:
      item.title?.native ||
      "",

    romajiTitle:
      item.title?.romaji ||
      "",

    image,

    smallImage:
      item.coverImage?.medium ||
      image,

    banner:
      item.bannerImage ||
      image,

    trailer,

    streamingEpisodes,

    description:
      cleanDescription(
        item.description
      ),

    rating:
      item.averageScore
        ? item.averageScore / 10
        : 0,

    popularity:
      item.popularity ||
      0,

    episodes:
      item.episodes ||
      0,

    type:
      item.format ||
      item.type ||
      "Unknown",

    status:
      item.status ||
      "Unknown",

    year,

    season:
      item.season ||
      null,

    genres:
      Array.isArray(item.genres)
        ? item.genres.map(
            (name, index) => ({
              id: index,
              name
            })
          )
        : [],

    studios:
      item.studios?.nodes?.map(
        (studio) =>
          studio.name
      ) || [],

    duration:
      item.duration
        ? `${item.duration} min`
        : null,

    source:
      item.source ||
      null,

    siteUrl:
      item.siteUrl ||
      null
  };
}

/* =========================================================
   JIKAN NORMALIZER
========================================================= */

function normalizeJikanAnime(
  item = {}
) {
  return {
    id: String(
      item.mal_id ??
        ""
    ),

    malId:
      item.mal_id ??
      null,

    aniListId:
      null,

    title:
      item.title_english ||
      item.title ||
      "Unknown Anime",

    japaneseTitle:
      item.title_japanese ||
      "",

    romajiTitle:
      item.title ||
      "",

    image:
      item.images?.webp
        ?.large_image_url ||
      item.images?.jpg
        ?.large_image_url ||
      item.images?.webp
        ?.image_url ||
      item.images?.jpg
        ?.image_url ||
      "",

    smallImage:
      item.images?.webp
        ?.image_url ||
      item.images?.jpg
        ?.image_url ||
      "",

    banner:
      item.trailer?.images
        ?.maximum_image_url ||
      item.trailer?.images
        ?.large_image_url ||
      item.images?.webp
        ?.large_image_url ||
      "",

    trailer:
      item.trailer?.embed_url ||
      item.trailer?.url ||
      null,

    streamingEpisodes:
      [],

    description:
      item.synopsis ||
      "No description available.",

    rating:
      item.score ||
      0,

    popularity:
      item.popularity ||
      0,

    episodes:
      item.episodes ||
      0,

    type:
      item.type ||
      "Unknown",

    status:
      item.status ||
      "Unknown",

    year:
      item.year ||
      item.aired?.prop?.from
        ?.year ||
      null,

    season:
      item.season ||
      null,

    genres:
      item.genres?.map(
        (genre) => ({
          id: genre.mal_id,
          name: genre.name
        })
      ) || [],

    studios:
      item.studios?.map(
        (studio) =>
          studio.name
      ) || [],

    duration:
      item.duration ||
      null,

    source:
      item.source ||
      null,

    siteUrl:
      item.url ||
      null
  };
}

/* =========================================================
   PAGINATION NORMALIZER
========================================================= */

function normalizeAniListPage(
  data
) {
  const page =
    data?.Page;

  return {
    currentPage:
      page?.pageInfo
        ?.currentPage ||
      1,

    lastPage:
      page?.pageInfo
        ?.lastPage ||
      1,

    hasNextPage:
      Boolean(
        page?.pageInfo
          ?.hasNextPage
      ),

    items:
      page?.media?.map(
        normalizeAniListAnime
      ) || []
  };
}

function normalizeJikanPage(
  json
) {
  return {
    currentPage:
      json?.pagination
        ?.current_page ||
      1,

    lastPage:
      json?.pagination
        ?.last_visible_page ||
      1,

    hasNextPage:
      Boolean(
        json?.pagination
          ?.has_next_page
      ),

    items:
      json?.data?.map(
        normalizeJikanAnime
      ) || []
  };
}

/* =========================================================
   COMMON ANILIST MEDIA QUERY
========================================================= */

const MEDIA_FIELDS = `
  id
  idMal

  title {
    romaji
    english
    native
  }

  description(asHtml: false)

  type
  format
  status

  season
  seasonYear

  startDate {
    year
    month
    day
  }

  episodes
  duration

  averageScore
  popularity

  genres

  coverImage {
    medium
    large
    extraLarge
  }

  bannerImage

  trailer {
    id
    site
    thumbnail
  }

  streamingEpisodes {
    title
    thumbnail
    url
    site
  }

  studios {
    nodes {
      name
    }
  }

  source

  siteUrl
`;

/* =========================================================
   TRENDING
   PRIMARY = ANILIST
   FALLBACK = JIKAN
========================================================= */

export async function getTrendingAnime(
  page = 1
) {
  try {
    const query = `
      query ($page: Int) {
        Page(
          page: $page
          perPage: 24
        ) {
          pageInfo {
            currentPage
            lastPage
            hasNextPage
          }

          media(
            type: ANIME
            sort: TRENDING_DESC
            isAdult: false
          ) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data =
      await anilistRequest(
        query,
        { page },
        `trending:${page}`
      );

    const result =
      normalizeAniListPage(data);

    if (result.items.length) {
      return result;
    }

    throw new Error(
      "AniList returned no trending anime."
    );
  } catch (error) {
    console.warn(
      "AniList trending failed. Using Jikan fallback.",
      error
    );

    const json =
      await jikanRequest(
        `/top/anime?filter=airing&limit=24&page=${page}`
      );

    return normalizeJikanPage(json);
  }
}

/* =========================================================
   POPULAR
========================================================= */

export async function getPopularAnime(
  page = 1
) {
  try {
    const query = `
      query ($page: Int) {
        Page(
          page: $page
          perPage: 24
        ) {
          pageInfo {
            currentPage
            lastPage
            hasNextPage
          }

          media(
            type: ANIME
            sort: POPULARITY_DESC
            isAdult: false
          ) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data =
      await anilistRequest(
        query,
        { page },
        `popular:${page}`
      );

    const result =
      normalizeAniListPage(data);

    if (result.items.length) {
      return result;
    }

    throw new Error(
      "AniList returned no popular anime."
    );
  } catch (error) {
    console.warn(
      "AniList popular failed. Using Jikan fallback.",
      error
    );

    const json =
      await jikanRequest(
        `/top/anime?filter=bypopularity&limit=24&page=${page}`
      );

    return normalizeJikanPage(json);
  }
}

/* =========================================================
   CURRENT SEASON
========================================================= */

function getCurrentSeason() {
  const month =
    new Date().getMonth() + 1;

  if (
    month >= 1 &&
    month <= 3
  ) {
    return "WINTER";
  }

  if (
    month >= 4 &&
    month <= 6
  ) {
    return "SPRING";
  }

  if (
    month >= 7 &&
    month <= 9
  ) {
    return "SUMMER";
  }

  return "FALL";
}

export async function getSeasonalAnime(
  page = 1
) {
  const year =
    new Date().getFullYear();

  const season =
    getCurrentSeason();

  try {
    const query = `
      query (
        $page: Int
        $season: MediaSeason
        $year: Int
      ) {
        Page(
          page: $page
          perPage: 24
        ) {
          pageInfo {
            currentPage
            lastPage
            hasNextPage
          }

          media(
            type: ANIME
            season: $season
            seasonYear: $year
            sort: POPULARITY_DESC
            isAdult: false
          ) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data =
      await anilistRequest(
        query,
        {
          page,
          season,
          year
        },
        `seasonal:${season}:${year}:${page}`
      );

    const result =
      normalizeAniListPage(data);

    if (result.items.length) {
      return result;
    }

    throw new Error(
      "AniList returned no seasonal anime."
    );
  } catch (error) {
    console.warn(
      "AniList seasonal failed. Using Jikan fallback.",
      error
    );

    const json =
      await jikanRequest(
        `/seasons/now?limit=24&page=${page}`
      );

    return normalizeJikanPage(json);
  }
}

/* =========================================================
   SEARCH
========================================================= */

export async function searchAnime(
  queryText,
  page = 1
) {
  const search =
    String(queryText || "")
      .trim();

  if (!search) {
    return {
      currentPage: 1,
      lastPage: 1,
      hasNextPage: false,
      items: []
    };
  }

  try {
    const query = `
      query (
        $page: Int
        $search: String
      ) {
        Page(
          page: $page
          perPage: 24
        ) {
          pageInfo {
            currentPage
            lastPage
            hasNextPage
          }

          media(
            type: ANIME
            search: $search
            sort: SEARCH_MATCH
            isAdult: false
          ) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data =
      await anilistRequest(
        query,
        {
          page,
          search
        },
        `search:${search}:${page}`
      );

    const result =
      normalizeAniListPage(data);

    return result;
  } catch (error) {
    console.warn(
      "AniList search failed. Using Jikan fallback.",
      error
    );

    const json =
      await jikanRequest(
        `/anime?q=${encodeURIComponent(
          search
        )}&limit=24&page=${page}&sfw=true`
      );

    return normalizeJikanPage(json);
  }
}

/* =========================================================
   ANIME DETAILS
   PRIMARY = ANILIST USING MAL ID
   FALLBACK = JIKAN
========================================================= */

export async function getAnimeById(
  id
) {
  if (!id) {
    throw new Error(
      "Anime ID is required."
    );
  }

  const malId =
    Number(id);

  try {
    const query = `
      query ($malId: Int) {
        Media(
          idMal: $malId
          type: ANIME
        ) {
          ${MEDIA_FIELDS}
        }
      }
    `;

    const data =
      await anilistRequest(
        query,
        { malId },
        `anime:${malId}`
      );

    if (data?.Media) {
      return normalizeAniListAnime(
        data.Media
      );
    }

    throw new Error(
      "Anime not found on AniList."
    );
  } catch (error) {
    console.warn(
      "AniList anime details failed. Using Jikan fallback.",
      error
    );

    const json =
      await jikanRequest(
        `/anime/${encodeURIComponent(
          id
        )}/full`
      );

    return normalizeJikanAnime(
      json.data
    );
  }
}

/* =========================================================
   EPISODES
   ANILIST DOES NOT PROVIDE A NORMAL EPISODE
   LIST WITH STREAM URLs.
   JIKAN IS USED FOR EPISODE METADATA.
========================================================= */

export async function getAnimeEpisodes(
  id,
  page = 1
) {
  try {
    const json =
      await jikanRequest(
        `/anime/${encodeURIComponent(
          id
        )}/episodes?page=${page}`
      );

    return {
      currentPage:
        json.pagination
          ?.current_page ||
        page,

      lastPage:
        json.pagination
          ?.last_visible_page ||
        page,

      hasNextPage:
        Boolean(
          json.pagination
            ?.has_next_page
        ),

      items:
        json.data?.map(
          (episode) => ({
            id:
              episode.mal_id,

            number:
              episode.mal_id,

            title:
              episode.title ||
              `Episode ${episode.mal_id}`,

            aired:
              episode.aired ||
              null,

            score:
              episode.score ||
              null,

            filler:
              Boolean(
                episode.filler
              ),

            recap:
              Boolean(
                episode.recap
              )
          })
        ) || []
    };
  } catch (error) {
    console.warn(
      "Jikan episodes failed.",
      error
    );

    return {
      currentPage: page,
      lastPage: 1,
      hasNextPage: false,
      items: []
    };
  }
}

/* =========================================================
   GENRES
========================================================= */

export async function getAnimeByGenre(
  genre,
  page = 1
) {
  const genreName =
    decodeURIComponent(
      String(genre || "")
    )
      .replace(/[-_]/g, " ")
      .trim();

  if (!genreName) {
    return {
      currentPage: 1,
      lastPage: 1,
      hasNextPage: false,
      items: []
    };
  }

  try {
    const query = `
      query (
        $page: Int
        $genre: String
      ) {
        Page(
          page: $page
          perPage: 24
        ) {
          pageInfo {
            currentPage
            lastPage
            hasNextPage
          }

          media(
            type: ANIME
            genre: $genre
            sort: POPULARITY_DESC
            isAdult: false
          ) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data =
      await anilistRequest(
        query,
        {
          page,
          genre: genreName
        },
        `genre:${genreName}:${page}`
      );

    const result =
      normalizeAniListPage(data);

    if (result.items.length) {
      return result;
    }

    throw new Error(
      "AniList returned no genre results."
    );
  } catch (error) {
    console.warn(
      "AniList genre failed. Using Jikan fallback.",
      error
    );

    /*
      Jikan needs a numeric genre ID.
    */

    const GENRE_IDS = {
      action: 1,
      adventure: 2,
      cars: 3,
      comedy: 4,
      "avant-garde": 5,
      avantgarde: 5,
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
      sports: 30,
      supernatural: 37,
      "slice-of-life": 36,
      sliceoflife: 36,
      vampire: 32,
      seinen: 42,
      josei: 43,
      thriller: 41,
      suspense: 41
    };

    const genreId =
      GENRE_IDS[
        genreName.toLowerCase()
      ];

    if (!genreId) {
      throw new Error(
        `Unknown anime genre: ${genreName}`
      );
    }

    const json =
      await jikanRequest(
        `/anime?genres=${genreId}&limit=24&page=${page}&sfw=true`
      );

    return normalizeJikanPage(
      json
    );
  }
}

/* =========================================================
   CACHE
========================================================= */

export function clearAnimeCache() {
  cache.clear();
}

export async function refreshAnime(
  endpoint
) {
  return jikanRequest(
    endpoint,
    {
      forceRefresh: true
    }
  );
}
