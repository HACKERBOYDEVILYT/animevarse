const API_BASE_URL = "https://your-api-url.com";

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export async function getTrendingAnime() {
  return request("/anime/trending");
}

export async function getPopularAnime() {
  return request("/anime/popular");
}

export async function searchAnime(query) {
  return request(
    `/anime/search?q=${encodeURIComponent(query)}`
  );
}

export async function getAnimeById(id) {
  return request(`/anime/${id}`);
}

export async function getSeasonalAnime() {
  return request("/anime/seasonal");
}
