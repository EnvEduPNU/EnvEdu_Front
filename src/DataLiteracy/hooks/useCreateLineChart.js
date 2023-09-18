import {
  useChartMetaDataStore,
  useLineAxisSacleEditorStore,
} from "../store/drawGraphStore";
import { colorsArray } from "../utils/randomColor";

const useCreateLineChart = (data, qualitativeVariableIdx) => {
  const axisScale = useLineAxisSacleEditorStore(state => state.axisScale);
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
        backgroundColor: colorsArray[idx],
        borderWidth: 1,
      }));
    }
  };

  const createOptions = () => {
    return {
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
  };
  const isShowChart = () =>
    x.length > 0 && y.length > 0 && x.includes(qualitativeVariableIdx);

  return { createDataset, createOptions, isShowChart };
};

export default useCreateLineChart;
