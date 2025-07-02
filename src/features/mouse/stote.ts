import { create } from "zustand";

interface MouseState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  isDown: boolean;
  isLocked: boolean;
  setMouse: (state: Partial<MouseState>) => void;
}

export const useMouseStore = create<MouseState>((set) => ({
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  isDown: false,
  isLocked: false,
  setMouse: (newState) => set(newState),
}));
