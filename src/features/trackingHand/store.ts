import { create } from "zustand";
import type { NormalizedLandmarkList } from "@mediapipe/hands";

interface HandState {
  landmarks: NormalizedLandmarkList[];
  setLandmarks: (landmarks: NormalizedLandmarkList[]) => void;
}

export const useHandStore = create<HandState>((set) => ({
  landmarks: [],
  setLandmarks: (landmarks) => set({ landmarks }),
}));
