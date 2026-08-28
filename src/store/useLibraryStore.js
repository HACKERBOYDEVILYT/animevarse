import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLibraryStore = create(
  persist(
    (set) => ({
      watchlist: [],
      history: [],

      addToWatchlist: (anime) =>
        set((state) => {
          const exists = state.watchlist.some(
            (item) => item.id === anime.id
          );

          if (exists) return state;

          return {
            watchlist: [...state.watchlist, anime],
          };
        }),

      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter(
            (item) => item.id !== id
          ),
        })),

      toggleWatchlist: (anime) =>
        set((state) => {
          const exists = state.watchlist.some(
            (item) => item.id === anime.id
          );

          return {
            watchlist: exists
              ? state.watchlist.filter(
                  (item) => item.id !== anime.id
                )
              : [...state.watchlist, anime],
          };
        }),

      addToHistory: (anime, episode) =>
        set((state) => {
          const filtered = state.history.filter(
            (item) => item.id !== anime.id
          );

          return {
            history: [
              {
                ...anime,
                episode,
                watchedAt: Date.now(),
              },
              ...filtered,
            ].slice(0, 50),
          };
        }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "animeverse-library",
    }
  )
);

export default useLibraryStore;
