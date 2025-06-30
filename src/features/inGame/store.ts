import { create } from "zustand";

export interface InGameState {
  isStart: boolean;
  controlMode: "mouse" | "hand";
  setIsStart: (isStart: boolean) => void;
  setControlMode: (controlMode: "mouse" | "hand") => void;
}

export const useInGameStore = create<InGameState>((set) => ({
  isStart: false,
  controlMode: "mouse",
  setIsStart: (isStart: boolean) => set({ isStart }),
  setControlMode: (controlMode: "mouse" | "hand") => set({ controlMode }),
}));
