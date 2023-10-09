import { create } from "zustand";
import { data1 } from "../sampleData/sampleData";
import {
  linearInterpolation,
  meanImputation,
  medianImputation,
  modeImputation,
} from "../utils/missingValue";
import {
  findOutliersIndicesByIQR,
  findOutliersIndicesByMAD,
  findOutliersIndicesByZScore,
  replaceOutliersWithLinearInterpolation,
  replaceOutliersWithMean,
  replaceOutliersWithMedian,
  replaceOutliersWithMode,
} from "../utils/outlier";

export const useDataPretreatmentStore = create(set => ({
  data: data1,
  imputedData: data1,
  resultData: data1,

  isFindMissingValue: false,
  isImputed: false,

  isFindOutliers: false,
  isRemoveOutliers: false,
  outliersIndices: [], // 이상치 인덱스를 저장할 배열

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
        imputedData: newData,
        resultData: newData,
        isImputed: true,
        isFindMissingValue: false,
      };
    }),

  findOutliers: method =>
    set(state => {
      let outlierIndices;
      switch (method) {
        case "z-score":
          outlierIndices = findOutliersIndicesByZScore(state.resultData);
          break;
        case "iqr":
          outlierIndices = findOutliersIndicesByIQR(state.resultData);
          break;
        case "mad":
          outlierIndices = findOutliersIndicesByMAD(state.resultData);
          break;
        default:
          return;
      }
      console.log(`${method} Indices:`, outlierIndices);

      return {
        ...state,
        isFindOutliers: true,
        outliersIndices: outlierIndices, // 각 방법별로 찾은 이상치 인덱스 저장
      };
    }),

  changOutliers: way =>
    set(state => {
      let newData;
      switch (way) {
        case "mean":
          newData = replaceOutliersWithMean(
            state.imputedData,
            state.outliersIndices
          );
          break;
        case "median":
          newData = replaceOutliersWithMedian(
            state.imputedData,
            state.outliersIndices
          );
          break;
        case "mode":
          newData = replaceOutliersWithMode(
            state.imputedData,
            state.outliersIndices
          );
          break;
        case "linear":
          newData = replaceOutliersWithLinearInterpolation(
            state.imputedData,
            state.outliersIndices
          );
          break;
        default:
          newData = state.data;
      }
      return {
        ...state,
        resultData: newData,
        isRemoveOutliers: true,
        isFindOutliers: false,
      };
    }),
}));
