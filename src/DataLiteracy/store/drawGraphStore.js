import { create } from "zustand";
import {
  DRAW_GRAPH,
  getAxisScale,
  getLocalStorage,
  storeLocalStorage,
} from "../utils/localStorage";

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
    axisScale: getAxisScale(!isLineChart ? 0 : 1) ?? {
      x: [],
      y: [],
      min: 0,
      max: 0,
      stepSize: 0,
    },
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
  axisScale: getAxisScale(4) ?? {
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
  axisScale: getAxisScale(2) ?? {
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

export const useMixChartAxisScaleEditorStore = create(set => ({
  axisScale: getAxisScale(5) ?? {
    x: {
      value: -1,
    },
    y1: {
      value: [],
      min: 0,
      max: 0,
      stepSize: 0,
    },
    y2: {
      value: [],
      min: 0,
      max: 0,
      stepSize: 0,
    },
    barChart: [],
    lineChart: [],
  },

  changeAxisValue: (axis, newValue, qualitativeVariableIdx) =>
    set(state => {
      const { axisScale } = state;
      const currentAxis = axisScale[axis];

      if (axis === "x") {
        if (newValue !== qualitativeVariableIdx) {
          alert("만들 수 없는 그래프 유형입니다.");
          return state;
        }

        if (newValue === currentAxis.value)
          return {
            ...state,
            axisScale: {
              ...state.axisScale,
              [axis]: {
                ...currentAxis,
                value: -1,
              },
            },
          };

        return {
          ...state,
          axisScale: {
            ...state.axisScale,
            [axis]: {
              ...currentAxis,
              value: newValue,
            },
          },
        };
      }

      if (newValue === qualitativeVariableIdx) {
        alert("만들 수 없는 그래프 유형입니다.");
        return;
      }

      if (currentAxis.value.includes(newValue)) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
            [axis]: {
              ...currentAxis,
              value: currentAxis.value.filter(s => s !== newValue),
            },
          },
        };
      }

      return {
        ...state,
        axisScale: {
          ...state.axisScale,
          [axis]: {
            ...currentAxis,
            value: [...currentAxis.value, newValue],
          },
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

  changeChart: (chart, newValue, qualitativeVariableIdx) =>
    set(state => {
      const key = chart === "bar" ? "barChart" : "lineChart";
      const currChart = state.axisScale[key];
      if (currChart.includes(newValue)) {
        return {
          ...state,
          axisScale: {
            ...state.axisScale,
            [key]: currChart.filter(v => v !== newValue),
          },
        };
      }

      if (newValue === qualitativeVariableIdx) {
        alert("만들 수 없는 그래프 유형입니다.");
        return;
      }

      return {
        ...state,
        axisScale: {
          ...state.axisScale,
          [key]: [...currChart, newValue],
        },
      };
    }),
}));

useBarAxisSacleEditorStore.subscribe(state =>
  storeLocalStorage(DRAW_GRAPH, "axisScale", state.axisScale)
);
useLineAxisSacleEditorStore.subscribe(state =>
  storeLocalStorage(DRAW_GRAPH, "axisScale", state.axisScale)
);
useScatterAxisScaleEditorStore.subscribe(state =>
  storeLocalStorage(DRAW_GRAPH, "axisScale", state.axisScale)
);
useBubbleAxisScaleEditorStore.subscribe(state =>
  storeLocalStorage(DRAW_GRAPH, "axisScale", state.axisScale)
);
useMixChartAxisScaleEditorStore.subscribe(state =>
  storeLocalStorage(DRAW_GRAPH, "axisScale", state.axisScale)
);

export const useChartMetaDataStore = create(set => ({
  metaData: getLocalStorage(DRAW_GRAPH, "metaData") ?? {
    tableTitle: "",
    chartTitle: "",
    legendPostion: "top",
    datalabelAnchor: "no",
  },

  changeTitle: (target, newTitle) =>
    set(state => {
      const key = target + "Title";
      return {
        ...state,
        metaData: {
          ...state.metaData,
          [key]: newTitle,
        },
      };
    }),

  changeLegendPosition: positon =>
    set(state => {
      return {
        ...state,
        metaData: {
          ...state.metaData,
          legendPostion: positon,
        },
      };
    }),
  changeDatalabelAnchor: anchor =>
    set(state => {
      return {
        ...state,
        metaData: {
          ...state.metaData,
          datalabelAnchor: anchor,
        },
      };
    }),
}));

useChartMetaDataStore.subscribe(state =>
  storeLocalStorage(DRAW_GRAPH, "metaData", state.metaData)
);

export const chartScaleEditorStores = {
  bar: useBarAxisSacleEditorStore,
  line: useLineAxisSacleEditorStore,
  scatter: useScatterAxisScaleEditorStore,
  bubble: useBubbleAxisScaleEditorStore,
  mix: useMixChartAxisScaleEditorStore,
};
