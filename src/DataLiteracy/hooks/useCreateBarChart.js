import {
  useBarAxisSacleEditorStore,
  useChartMetaDataStore,
} from "../store/drawGraphStore";
import { randomColor } from "../utils/randomColor";

const useCreateBarChart = (data, qualitativeVariableIdx) => {
  const axisScale = useBarAxisSacleEditorStore(state => state.axisScale);
  const legendPostion = useChartMetaDataStore(
    state => state.metaData.legendPostion
  );

  const { x, y, min, max, stepSize } = axisScale;

  const createDataset = () => {
    if (x.includes(qualitativeVariableIdx)) {
      //x축에 질적 변인이 있다면 y축에 양적변인이 다 있음
      const yData = data[0].filter((label, idx) => y.includes(idx));

      return yData.map((label, idx) => ({
        label,
        data: data.slice(1).map(item => item[idx + 1]),
        backgroundColor: randomColor(),
        borderWidth: 1,
      }));
    }
    if (y.includes(qualitativeVariableIdx)) {
      //y축에 질적 변인이 있다면 x축에 양적변인이 다 있음
      const xData = data[0].filter((label, idx) => x.includes(idx));

      return xData.map((label, idx) => ({
        label,
        data: data.slice(1).map(item => item[idx + 1]),
        backgroundColor: randomColor(),
        borderWidth: 1,
      }));
    }
  };

  const createOptions = () => {
    if (x.includes(qualitativeVariableIdx)) {
      return {
        indexAxis: "x",
        scales: {
          y: {
            min,
            max,
            ticks: {
              stepSize,
              autoSkip: false,
            },
          },
        },
        plugins: {
          legend: {
            position: legendPostion, // 'top', 'left', 'bottom', 'right' 중 하나를 선택
          },
        },
      };
    }

    if (y.includes(qualitativeVariableIdx)) {
      return {
        indexAxis: "y",
        scales: {
          x: {
            min,
            max,
            ticks: {
              stepSize,
              autoSkip: false,
            },
          },
        },
        plugins: {
          legend: {
            position: legendPostion, // 'top', 'left', 'bottom', 'right' 중 하나를 선택
          },
        },
      };
    }
  };

  const isShowChart = () =>
    x.length > 0 &&
    y.length > 0 &&
    (x.includes(qualitativeVariableIdx) || y.includes(qualitativeVariableIdx));
  return { createDataset, createOptions, isShowChart };
};

export default useCreateBarChart;
