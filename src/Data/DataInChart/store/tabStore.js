import { create } from "zustand";

export const useTabStore = create((set) => ({
  tab: "table",
  changeTab: (newTab) =>
    set(() => {
      return {
        tab: newTab,
      };
    }),
}));
