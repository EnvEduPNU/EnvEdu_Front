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
import {
  logTransformForDataset,
  minMaxScalingForDataset,
  sqrtTransformForDataset,
  zScoreNormalizationForDataset,
} from "../utils/scaling";

export const useDataPretreatmentStore = create(set => ({
  data: data1,
  imputedData: data1,
  dataWithoutOutliers: data1,
  resultData: data1,

  isFindMissingValue: false,
  isImputed: false,

  isFindOutliers: false,
  isRemoveOutliers: false,
  outliersIndices: [], // 이상치 인덱스를 저장할 배열
  setDatas: newData =>
    set(state => ({
      ...state,
      data: newData,
      imputedData: newData,
      dataWithoutOutliers: newData,
      resultData: newData,
    })),

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
        dataWithoutOutliers: newData,
        isImputed: true,
      };
    }),

  findOutliers: method =>
    set(state => {
      let outlierIndices;
      switch (method) {
        case "z-score":
          outlierIndices = findOutliersIndicesByZScore(
            state.dataWithoutOutliers
          );
          break;
        case "iqr":
          outlierIndices = findOutliersIndicesByIQR(state.dataWithoutOutliers);
          break;
        case "mad":
          outlierIndices = findOutliersIndicesByMAD(state.dataWithoutOutliers);
          break;
        default:
          return;
      }

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
        dataWithoutOutliers: newData,
        resultData: newData,
        isRemoveOutliers: true,
        isFindOutliers: false,
      };
    }),

  changeByScaling: way =>
    set(state => {
      let newData;
      switch (way) {
        case "minmax":
          newData = minMaxScalingForDataset(state.dataWithoutOutliers);
          break;
        case "zscore":
          newData = zScoreNormalizationForDataset(state.dataWithoutOutliers);
          break;
        case "log":
          const [data, isOk] = logTransformForDataset(
            state.dataWithoutOutliers
          );
          if (isOk) newData = data;
          else {
            alert("스케일링이 불가합니다.");
            newData = state.dataWithoutOutliers.map(v => [...v]);
          }
          break;
        case "sqrt":
          const [data2, isOk2] = sqrtTransformForDataset(
            state.dataWithoutOutliers
          );
          if (isOk2) newData = data2;
          else {
            alert("스케일링이 불가합니다.");
            newData = state.dataWithoutOutliers.map(v => [...v]);
          }
          break;
        default:
          newData = state.dataWithoutOutliers.map(v => [...v]);
      }
      return {
        ...state,
        resultData: newData,
      };
    }),
}));
