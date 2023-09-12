import { create } from "zustand";

export const useSelectedVariable = create(set => ({
  selectedVariable: JSON.parse(localStorage.getItem("drawGraph"))
    ?.selectedVariable
    ? JSON.parse(localStorage.getItem("drawGraph"))?.selectedVariable
    : [],
  changeSelectedVariable: variableIdx =>
    set(state => {
      if (state.selectedVariable.includes(variableIdx)) {
        return {
          selectedVariable: state.selectedVariable.filter(
            index => index !== variableIdx
          ),
        };
      }
      return { selectedVariable: [...state.selectedVariable, variableIdx] };
    }),
  setSelectedVariable: variables => set({ selectedVariable: [...variables] }),
}));
