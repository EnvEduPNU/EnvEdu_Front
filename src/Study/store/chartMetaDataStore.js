import { create } from "zustand";

const useChartMetaDataStore = create(set => ({
  metaData: {
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
      if (state.metaData.legendPostion === positon) {
        positon = "no";
      }
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
      if (state.metaData.datalabelAnchor === anchor) {
        anchor = "no";
      }
      return {
        ...state,
        metaData: {
          ...state.metaData,
          datalabelAnchor: anchor,
        },
      };
    }),
}));

export default useChartMetaDataStore;
