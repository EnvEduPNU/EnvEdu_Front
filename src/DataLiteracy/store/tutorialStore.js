import { create } from "zustand";
import { tutorials2, tutorials3 } from "../utils/tutorials";

export const usetutorialStroe = create((set, get) => ({
  step: 0,
  totalStepSize: 16,
  isTutorial: false,
  // activeGraphIndex: [3, 6, 7, 8, 9, 10, 11],
  activeGraphIndex: [3, 4, 7, 8, 9, 10, 11, 12],
  currentTutorlal: tutorials3,
  type: "mix",

  isActiveGraph: () => {
    return get().activeGraphIndex.includes(get().step);
  },

  startTutorial: () =>
    set(state => {
      return {
        ...state,
        isTutorial: true,
      };
    }),

  endTutorial: () =>
    set(state => {
      return {
        ...state,
        isTutorial: false,
      };
    }),

  addStep: () => set(state => ({ ...state, step: get().step + 1 })),
  minusStep: () => set(state => ({ ...state, step: get().step - 1 })),
}));
