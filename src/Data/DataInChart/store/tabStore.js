import { create } from "zustand";

export const useTabStore = create(set => ({
  tab: "table",
  changeTab: newTab =>
    set(state => {
      return {
        ...state,
        tab: newTab,
      };
    }),
}));
