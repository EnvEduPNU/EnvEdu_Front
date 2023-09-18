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
  axisScale: { x: [], y: [], min: 0, max: 0, stepSize: 0 },
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
      return { ...state, axisScale: { ...state.axisScale, min } };
    }),

  changeMaxValue: max =>
    set(state => {
      return { ...state, axisScale: { ...state.axisScale, max } };
    }),

  changeStepSize: stepSize =>
    set(state => {
      return { ...state, axisScale: { ...state.axisScale, stepSize } };
    }),

  changeSelectedX: (selectedIdx, qualitativeVariableIdx) =>
    set(state => {
      const { x } = state.axisScale;

      if (x.includes(selectedIdx)) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
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
        axisScale: {
          ...state.axisScale,
          x: [...x, selectedIdx],
        },
      };
    }),
  changeSelectedY: (selectedIdx, qualitativeVariableIdx) =>
    set(state => {
      const { y } = state.axisScale;

      if (y.includes(selectedIdx)) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
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
        axisScale: {
          ...state.axisScale,
          y: [...y, selectedIdx],
        },
      };
    }),
}));

export const useLineAxisSacleEditorStore = create(set => ({
  axisScale: { x: [], y: [], min: 0, max: 0, stepSize: 0 },
  changeMinValue: min =>
    set(state => {
      return { ...state, axisScale: { ...state.axisScale, min } };
    }),

  changeMaxValue: max =>
    set(state => {
      return { ...state, axisScale: { ...state.axisScale, max } };
    }),

  changeStepSize: stepSize =>
    set(state => {
      return { ...state, axisScale: { ...state.axisScale, stepSize } };
    }),

  changeSelectedX: (selectedIdx, qualitativeVariableIdx) =>
    set(state => {
      if (selectedIdx !== qualitativeVariableIdx) {
        alert("만들 수 없는 그래프 유형입니다.");
        return state;
      }

      const { x } = state.axisScale;

      if (x.includes(selectedIdx)) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
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
        axisScale: {
          ...state.axisScale,
          x: [...x, selectedIdx],
        },
      };
    }),
  changeSelectedY: (selectedIdx, qualitativeVariableIdx) =>
    set(state => {
      if (selectedIdx === qualitativeVariableIdx) {
        alert("만들 수 없는 그래프 유형입니다.");
        return;
      }

      const { y } = state.axisScale;

      if (y.includes(selectedIdx)) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
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
        axisScale: {
          ...state.axisScale,
          y: [...y, selectedIdx],
        },
      };
    }),
}));
