import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePlayerStore = create(
  persist(
    (set) => ({
      progress: {},

      saveProgress: (
        animeId,
        episode,
        seconds,
        duration
      ) =>
        set((state) => ({
          progress: {
            ...state.progress,

            [`${animeId}-${episode}`]: {
              animeId,
              episode,
              seconds,
              duration,
              updatedAt: Date.now(),
            },
          },
        })),

      clearProgress: (
        animeId,
        episode
      ) =>
        set((state) => {
          const progress = {
            ...state.progress,
          };

          delete progress[
            `${animeId}-${episode}`
          ];

          return { progress };
        }),

      clearAllProgress: () =>
        set({
          progress: {},
        }),
    }),
    {
      name: "anime-app-player",
    }
  )
);

export default usePlayerStore;
