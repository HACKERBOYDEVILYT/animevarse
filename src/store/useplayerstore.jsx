import { create } from "zustand";

const usePlayerStore = create((set) => ({
  playing: false,
  volume: 1,
  progress: 0,

  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),

  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
}));

export default usePlayerStore;
