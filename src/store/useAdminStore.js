import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_SETTINGS = {
  siteName: "AnimeVerse",
  maintenanceMode: false,
  allowRegistration: true,
  allowGuestWatching: true,
};

const useAdminStore = create(
  persist(
    (set, get) => ({
      isAdmin: false,

      admin: null,

      anime: [],

      episodes: [],

      featured: [],

      providers: [],

      users: [],

      settings: DEFAULT_SETTINGS,

      loginAdmin: (admin) =>
        set({
          isAdmin: true,
          admin,
        }),

      logoutAdmin: () =>
        set({
          isAdmin: false,
          admin: null,
        }),

      addAnime: (anime) =>
        set((state) => ({
          anime: [
            ...state.anime,
            {
              ...anime,
              id:
                anime.id ||
                crypto.randomUUID(),
              createdAt:
                Date.now(),
              updatedAt:
                Date.now(),
              enabled: true,
            },
          ],
        })),

      updateAnime: (id, updates) =>
        set((state) => ({
          anime: state.anime.map(
            (item) =>
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
            (item) =>
              String(item.id) !== String(id)
          ),
          episodes:
            state.episodes.filter(
              (item) =>
                String(item.animeId) !==
                String(id)
            ),
          featured:
            state.featured.filter(
              (item) =>
                String(item.animeId) !==
                String(id)
            ),
        })),

      toggleAnime: (id) =>
        set((state) => ({
          anime: state.anime.map(
            (item) =>
              String(item.id) === String(id)
                ? {
                    ...item,
                    enabled:
                      !item.enabled,
                    updatedAt:
                      Date.now(),
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
              id:
                episode.id ||
                crypto.randomUUID(),
              createdAt: Date.now(),
            },
          ],
        })),

      updateEpisode: (
        id,
        updates
      ) =>
        set((state) => ({
          episodes:
            state.episodes.map(
              (item) =>
                String(item.id) ===
                String(id)
                  ? {
                      ...item,
                      ...updates,
                    }
                  : item
            ),
        })),

      deleteEpisode: (id) =>
        set((state) => ({
          episodes:
            state.episodes.filter(
              (item) =>
                String(item.id) !==
                String(id)
            ),
        })),

      setFeatured: (items) =>
        set({
          featured: items,
        }),

      addFeatured: (animeId) =>
        set((state) => {
          if (
            state.featured.some(
              (item) =>
                String(item.animeId) ===
                String(animeId)
            )
          ) {
            return state;
          }

          return {
            featured: [
              ...state.featured,
              {
                animeId,
                position:
                  state.featured.length + 1,
                enabled: true,
              },
            ],
          };
        }),

      removeFeatured: (animeId) =>
        set((state) => ({
          featured:
            state.featured.filter(
              (item) =>
                String(item.animeId) !==
                String(animeId)
            ),
        })),

      addProvider: (provider) =>
        set((state) => ({
          providers: [
            ...state.providers,
            {
              ...provider,
              id:
                provider.id ||
                crypto.randomUUID(),
              enabled: true,
              createdAt:
                Date.now(),
            },
          ],
        })),

      updateProvider: (
        id,
        updates
      ) =>
        set((state) => ({
          providers:
            state.providers.map(
              (item) =>
                String(item.id) ===
                String(id)
                  ? {
                      ...item,
                      ...updates,
                    }
                  : item
            ),
        })),

      deleteProvider: (id) =>
        set((state) => ({
          providers:
            state.providers.filter(
              (item) =>
                String(item.id) !==
                String(id)
            ),
        })),

      updateSettings: (
        updates
      ) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
          },
        })),

      resetAdminData: () =>
        set({
          anime: [],
          episodes: [],
          featured: [],
          providers: [],
          users: [],
          settings:
            DEFAULT_SETTINGS,
        }),

      exportData: () => {
        const state = get();

        return {
          anime: state.anime,
          episodes:
            state.episodes,
          featured:
            state.featured,
          providers:
            state.providers,
          users: state.users,
          settings:
            state.settings,
          exportedAt:
            new Date().toISOString(),
        };
      },
    }),
    {
      name: "animeverse-admin",
    }
  )
);

export default useAdminStore;
