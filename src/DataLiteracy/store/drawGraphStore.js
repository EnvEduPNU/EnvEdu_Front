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

// 공통 변경 함수
const changeValue = (set, key) => value =>
  set(state => ({
    ...state,
    axisScale: {
      ...state.axisScale,
      [key]: value,
    },
  }));

const changeSelected =
  (set, axis, isLineChart) => (selectedIdx, qualitativeVariableIdx) =>
    set(state => {
      const currentAxis = state.axisScale[axis];

      if (isLineChart) {
        if (axis === "x") {
          if (selectedIdx !== qualitativeVariableIdx) {
            alert("만들 수 없는 그래프 유형입니다.");
            return state;
          }
        } else {
          if (selectedIdx === qualitativeVariableIdx) {
            alert("만들 수 없는 그래프 유형입니다.");
            return state;
          }
        }
      }

      if (currentAxis.includes(selectedIdx)) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
            [axis]: currentAxis.filter(s => s !== selectedIdx),
          },
        };
      }

      if (
        currentAxis.includes(qualitativeVariableIdx) ||
        (selectedIdx === qualitativeVariableIdx && currentAxis.length > 0)
      ) {
        alert("질적변인과 양적변인을 동시에 선택할 수 없습니다.");
        return state;
      }

      return {
        ...state,
        axisScale: {
          ...state.axisScale,
          [axis]: [...currentAxis, selectedIdx],
        },
      };
    });

// 상태 관리 훅 생성 함수
const createTwoArrayAxisScaleEditorStore = (isLineChart = false) =>
  create(set => ({
    axisScale: { x: [], y: [], min: 0, max: 0, stepSize: 0 },
    changeMinValue: changeValue(set, "min"),
    changeMaxValue: changeValue(set, "max"),
    changeStepSize: changeValue(set, "stepSize"),
    changeSelectedX: changeSelected(set, "x", isLineChart),
    changeSelectedY: changeSelected(set, "y", isLineChart),
  }));

export const useBarAxisSacleEditorStore = createTwoArrayAxisScaleEditorStore();
export const useLineAxisSacleEditorStore =
  createTwoArrayAxisScaleEditorStore(true);

export const useScatterAxisScaleEditorStore = create(set => ({
  axisScale: {
    x: {
      value: -1,
      min: 0,
      max: 0,
      stepSize: 0,
    },
    y: {
      value: -1,
      min: 0,
      max: 0,
      stepSize: 0,
    },
  },

  changeAxisValue: (axis, value, qualitativeVariableIdx) =>
    set(state => {
      if (value === qualitativeVariableIdx) {
        alert("만들 수 없는 그래프 유형입니다.");
        return state;
      }

      if (state.axisScale[axis].value === value) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
            [axis]: { ...state.axisScale[axis], value: -1 },
          },
        };
      }

      return {
        ...state,
        axisScale: {
          ...state.axisScale,
          [axis]: { ...state.axisScale[axis], value },
        },
      };
    }),

  changeAxisScale: (axis, scale, newScale) =>
    set(state => {
      return {
        ...state,
        axisScale: {
          ...state.axisScale,
          [axis]: {
            ...state.axisScale[axis],
            [scale]: newScale,
          },
        },
      };
    }),
}));

export const useBubbleAxisScaleEditorStore = create(set => ({
  axisScale: {
    x: {
      value: -1,
      min: 0,
      max: 0,
      stepSize: 0,
    },
    y: {
      value: -1,
      min: 0,
      max: 0,
      stepSize: 0,
    },
    r: { value: -1 },
  },

  changeAxisValue: (axis, value, qualitativeVariableIdx) =>
    set(state => {
      if (value === qualitativeVariableIdx) {
        alert("만들 수 없는 그래프 유형입니다.");
        return state;
      }

      if (state.axisScale[axis].value === value) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
            [axis]: { ...state.axisScale[axis], value: -1 },
          },
        };
      }

      return {
        ...state,
        axisScale: {
          ...state.axisScale,
          [axis]: { ...state.axisScale[axis], value },
        },
      };
    }),

  changeAxisScale: (axis, scale, newScale) =>
    set(state => {
      return {
        ...state,
        axisScale: {
          ...state.axisScale,
          [axis]: {
            ...state.axisScale[axis],
            [scale]: newScale,
          },
        },
      };
    }),
}));
