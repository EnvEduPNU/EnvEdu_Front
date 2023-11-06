import { create } from "zustand";

export const ustTabStore = create(set => ({
  tab: "table",
  changeTab: () =>
    set(state => {
      const newTab = state.tab === "table" ? "graph" : "table";
      return {
        ...state,
        tab: newTab,
      };
    }),
}));
