import { create } from "zustand";

export const usetutorialStroe = create((set, get) => ({
  step: 0,
  totalStepSize: 16,
  isTutorial: true,
  activeGraphIndex: [3, 6, 7, 8, 9, 10, 11, 12],

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
