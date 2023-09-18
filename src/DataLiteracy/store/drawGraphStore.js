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

export const useBarAxisSacleEditorStore = create(set => ({
  barAxisScale: { x: [], y: [], min: 0, max: 0, stepSize: 0 },
  // lineAxisScale: { x: [], y: [], min: 0, max: 0, stepSize: 0 },
  // bubbleAxisScale: {
  //   x: { selected: -1, min: 0, max: 0, stepSize: 0 },
  //   y: { selected: -1, min: 0, max: 0, stepSize: 0 },
  //   r: -1,
  // },
  // scatterAxisScale: {
  //   x: { selected: -1, min: 0, max: 0, stepSize: 0 },
  //   y: { selected: -1, min: 0, max: 0, stepSize: 0 },
  // },
  // mixChartAxisSale: {
  //   x: -1,
  //   y1: { selected: [], min: 0, max: 0, stepSize: 0 },
  //   y2: { selected: [], min: 0, max: 0, stepSize: 0 },
  //   selectedBar: [],
  //   selectedLine: [],
  // },

  changeMinValue: min =>
    set(state => {
      return { ...state, barAxisScale: { ...state.barAxisScale, min } };
    }),

  changeMaxValue: max =>
    set(state => {
      return { ...state, barAxisScale: { ...state.barAxisScale, max } };
    }),

  changeStepSize: stepSize =>
    set(state => {
      return { ...state, barAxisScale: { ...state.barAxisScale, stepSize } };
    }),

  changeSelectedX: (selectedIdx, qualitativeVariableIdx) =>
    set(state => {
      const { x } = state.barAxisScale;

      if (x.includes(selectedIdx)) {
        return {
          ...state,
          barAxisScale: {
            ...state.barAxisScale,
            x: x.filter(s => s !== selectedIdx),
          },
        };
      }

      if (
        x.includes(qualitativeVariableIdx) ||
        (selectedIdx === qualitativeVariableIdx && x.length > 0)
      ) {
        alert("질적변인과 양적변인을 동시에 선택할 수 없습니다.");
        return state;
      }

      return {
        ...state,
        barAxisScale: {
          ...state.barAxisScale,
          x: [...x, selectedIdx],
        },
      };
    }),
  changeSelectedY: (selectedIdx, qualitativeVariableIdx) =>
    set(state => {
      const { y } = state.barAxisScale;

      if (y.includes(selectedIdx)) {
        return {
          ...state,
          barAxisScale: {
            ...state.barAxisScale,
            y: y.filter(s => s !== selectedIdx),
          },
        };
      }

      if (
        y.includes(qualitativeVariableIdx) ||
        (selectedIdx === qualitativeVariableIdx && y.length > 0)
      ) {
        alert("질적변인과 양적변인을 동시에 선택할 수 없습니다.");
        return state;
      }

      return {
        ...state,
        barAxisScale: {
          ...state.barAxisScale,
          y: [...y, selectedIdx],
        },
      };
    }),
}));
