import { create } from "zustand";

export const usetutorialStroe = create((set, get) => ({
  step: 0,
  totalStepSize: 16,
  isTutorial: true,

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
}));
