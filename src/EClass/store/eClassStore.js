import { create } from "zustand";

export const useEClassStore = create((set, get) => ({
  eClass: [[]],

  appendActivity: (pageNumber, activity) =>
    set(state => {
      const newEclass = get().eClass.map(page => [...page]);
      newEclass[pageNumber].push(activity);

      return {
        ...state,
        eClass: newEclass,
      };
    }),

  appendPage: () =>
    set(state => {
      const newEclass = get().eClass.map(page => [...page]);
      newEclass.push([]);

      return {
        ...state,
        eClass: newEclass,
      };
    }),
}));
