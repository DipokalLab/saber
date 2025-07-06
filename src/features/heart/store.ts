import { create } from "zustand";

interface HeartState {
  hearts: number;
  maxHearts: number;
  isDead: boolean;
  justHit: boolean;
  decreaseHeart: () => void;
  clearHit: () => void;
  resetHearts: () => void;
}

const INITIAL_HEARTS = 10;

export const useHeartStore = create<HeartState>((set) => ({
  hearts: INITIAL_HEARTS,
  maxHearts: INITIAL_HEARTS,
  isDead: false,
  justHit: false,

  decreaseHeart: () =>
    set((state) => {
      const newHearts = Math.max(0, state.hearts - 1);
      return {
        hearts: newHearts,
        isDead: newHearts === 0,
        justHit: true,
      };
    }),

  clearHit: () => set({ justHit: false }),

  resetHearts: () =>
    set({
      hearts: INITIAL_HEARTS,
      isDead: false,
      justHit: false,
    }),
}));
