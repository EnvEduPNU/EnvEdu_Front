import { create } from "zustand";

export const useGraphInterpreterStore = create(set => ({
  userData: {
    purpose: "",
    infomation: "",
  },
  changeUserData: (key, value) =>
    set(state => {
      return {
        ...state,
        userData: {
          ...state.userData,
          [key]: value,
        },
      };
    }),
}));
