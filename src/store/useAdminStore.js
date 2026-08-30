import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_SETTINGS = {
  siteName: "AnimeVerse",
  maintenanceMode: false,
  allowRegistration: true,
  allowGuestWatching: true,
};

const DEFAULT_PROVIDERS = [
  {
    id: "anilist",
    name: "AniList",
    type: "graphql",
    baseUrl: "https://graphql.anilist.co",
    apiKey: "",
    authType: "none",
    authHeader: "",
    customHeaders: {},
    enabled: true,
    primary: true,
    priority: 1,
    corsMode: "direct",
    animeEndpoint: "/",
    searchEndpoint: "/",
    detailsEndpoint: "/",
    episodesEndpoint: "/",
    description: "Primary anime metadata provider",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "jikan",
    name: "Jikan",
    type: "rest",
    baseUrl: "https://api.jikan.moe/v4",
    apiKey: "",
    authType: "none",
    authHeader: "",
    customHeaders: {},
    enabled: true,
    primary: false,
    priority: 2,
    corsMode: "auto",
    animeEndpoint: "/anime",
    searchEndpoint: "/anime?q={query}",
    detailsEndpoint: "/anime/{id}",
    episodesEndpoint: "/anime/{id}/episodes",
    description: "Fallback MyAnimeList API",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const useAdminStore = create(
  persist(
    (set, get) => ({
      admin: {
        id: "admin",
        name: "Administrator",
        role: "admin",
      },

      anime: [],
      episodes: [],
      featured: [],
      providers: DEFAULT_PROVIDERS,
      users: [],

      settings: DEFAULT_SETTINGS,

      addAnime: (anime) =>
        set((state) => ({
          anime: [
            ...state.anime,
            {
              ...anime,
              id: anime.id || crypto.randomUUID(),
              enabled: true,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),

      updateAnime: (id, updates) =>
        set((state) => ({
          anime: state.anime.map((item) =>
            String(item.id) === String(id)
              ? {
                  ...item,
                  ...updates,
                  updatedAt: Date.now(),
                }
              : item
          ),
        })),

      deleteAnime: (id) =>
        set((state) => ({
          anime: state.anime.filter(
            (item) => String(item.id) !== String(id)
          ),
          episodes: state.episodes.filter(
            (item) => String(item.animeId) !== String(id)
          ),
          featured: state.featured.filter(
            (item) => String(item.animeId) !== String(id)
          ),
        })),

      toggleAnime: (id) =>
        set((state) => ({
          anime: state.anime.map((item) =>
            String(item.id) === String(id)
              ? {
                  ...item,
                  enabled: !item.enabled,
                  updatedAt: Date.now(),
                }
              : item
          ),
        })),

      addEpisode: (episode) =>
        set((state) => ({
          episodes: [
            ...state.episodes,
            {
              ...episode,
              id: episode.id || crypto.randomUUID(),
              createdAt: Date.now(),
            },
          ],
        })),

      updateEpisode: (id, updates) =>
        set((state) => ({
          episodes: state.episodes.map((item) =>
            String(item.id) === String(id)
              ? { ...item, ...updates }
              : item
          ),
        })),

      deleteEpisode: (id) =>
        set((state) => ({
          episodes: state.episodes.filter(
            (item) => String(item.id) !== String(id)
          ),
        })),

      addFeatured: (animeId) =>
        set((state) => {
          if (
            state.featured.some(
              (item) => String(item.animeId) === String(animeId)
            )
          ) {
            return state;
          }

          return {
            featured: [
              ...state.featured,
              {
                animeId,
                position: state.featured.length + 1,
                enabled: true,
              },
            ],
          };
        }),

      removeFeatured: (animeId) =>
        set((state) => ({
          featured: state.featured.filter(
            (item) => String(item.animeId) !== String(animeId)
          ),
        })),

      setFeatured: (items) =>
        set({
          featured: items,
        }),

      // =========================
      // API PROVIDERS
      // =========================

      addProvider: (provider) =>
        set((state) => ({
          providers: [
            ...state.providers,
            {
              ...provider,
              id: provider.id || crypto.randomUUID(),
              enabled: provider.enabled ?? true,
              primary: provider.primary ?? false,
              priority:
                Number(provider.priority) ||
                state.providers.length + 1,
              customHeaders:
                provider.customHeaders || {},
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),

      updateProvider: (id, updates) =>
        set((state) => ({
          providers: state.providers.map((item) =>
            String(item.id) === String(id)
              ? {
                  ...item,
                  ...updates,
                  updatedAt: Date.now(),
                }
              : item
          ),
        })),

      deleteProvider: (id) =>
        set((state) => ({
          providers: state.providers.filter(
            (item) => String(item.id) !== String(id)
          ),
        })),

      toggleProvider: (id) =>
        set((state) => ({
          providers: state.providers.map((item) =>
            String(item.id) === String(id)
              ? {
                  ...item,
                  enabled: !item.enabled,
                  updatedAt: Date.now(),
                }
              : item
          ),
        })),

      setPrimaryProvider: (id) =>
        set((state) => ({
          providers: state.providers.map((item) => ({
            ...item,
            primary: String(item.id) === String(id),
            updatedAt:
              String(item.id) === String(id)
                ? Date.now()
                : item.updatedAt,
          })),
        })),

      updateProviderPriority: (id, priority) =>
        set((state) => ({
          providers: state.providers.map((item) =>
            String(item.id) === String(id)
              ? {
                  ...item,
                  priority: Number(priority) || 999,
                  updatedAt: Date.now(),
                }
              : item
          ),
        })),

      // =========================
      // USERS
      // =========================

      setUsers: (users) =>
        set({
          users,
        }),

      // =========================
      // SETTINGS
      // =========================

      updateSettings: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
          },
        })),

      // =========================
      // EXPORT
      // =========================

      exportData: () => {
        const state = get();

        return {
          anime: state.anime,
          episodes: state.episodes,
          featured: state.featured,
          providers: state.providers,
          users: state.users,
          settings: state.settings,
          exportedAt: new Date().toISOString(),
        };
      },

      resetAdminData: () =>
        set({
          anime: [],
          episodes: [],
          featured: [],
          providers: DEFAULT_PROVIDERS,
          users: [],
          settings: DEFAULT_SETTINGS,
        }),
    }),
    {
      name: "animeverse-admin",
    }
  )
);

export default useAdminStore;
