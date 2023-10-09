import { create } from "zustand";
import { data1 } from "../sampleData/sampleData";
import {
  linearInterpolation,
  meanImputation,
  medianImputation,
  modeImputation,
} from "../utils/missingValue";
import {
  findOutliersByIQR,
  findOutliersByMAD,
  findOutliersByZScore,
  processDatasetByMethod,
} from "../utils/outlier";

export const useDataPretreatmentStore = create(set => ({
  data: data1,
  isFindMissingValue: false,
  isImputed: false,
  resultData: data1,
  isFindOutliers: false,

  findMissingValue: () =>
    set(state => ({
      ...state,
      isFindMissingValue: true,
    })),

  changeMissingValue: way =>
    set(state => {
      let newData;
      switch (way) {
        case "mean":
          newData = meanImputation(state.data);
          break;
        case "median":
          newData = medianImputation(state.data);
          break;
        case "mode":
          newData = modeImputation(state.data);
          break;
        case "linear":
          newData = linearInterpolation(state.data);
          break;
        default:
          newData = state.data;
      }
      return {
        ...state,
        resultData: newData,
        isImputed: true,
        isFindMissingValue: false,
      };
    }),

  findOutliers: () =>
    set(state => ({
      ...state,
      isFindOutliers: true,
    })),

  changeOutliers: method =>
    set(state => {
      let newData;
      switch (method) {
        case "z-score":
          newData = processDatasetByMethod(state.data, findOutliersByZScore);
          break;
        case "iqr":
          newData = processDatasetByMethod(state.data, findOutliersByIQR);
          break;
        case "mad":
          newData = processDatasetByMethod(state.data, findOutliersByMAD);
          break;
        default:
          newData = state.data;
      }
      return {
        ...state,
        resultData: newData,
        isFindOutliers: false,
      };
    }),
}));
