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

      getProgress: (animeId, episode) => {
        const key = `${animeId}-${episode}`;

        return null;
      },

      clearProgress: (animeId, episode) =>
        set((state) => {
          const copy = { ...state.progress };

          delete copy[
            `${animeId}-${episode}`
          ];

          return {
            progress: copy,
          };
        }),
    }),
    {
      name: "animeverse-player",
    }
  )
);

export default usePlayerStore;
