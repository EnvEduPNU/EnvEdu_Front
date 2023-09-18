import {
  useChartMetaDataStore,
  useScatterAxisScaleEditorStore,
} from "../store/drawGraphStore";
import { randomColor } from "../utils/randomColor";

const useCreateScatterChart = (data, qualitativeVariableIdx) => {
  const axisScale = useScatterAxisScaleEditorStore(state => state.axisScale);
  const legendPostion = useChartMetaDataStore(
    state => state.metaData.legendPostion
  );

  const { x, y } = axisScale;

  const createDataset = () => {
    return [
      {
        label: "산점도 그래프",
        data: data.slice(1).map(item => ({
          x: item[x.value],
          y: item[y.value],
          label: item[qualitativeVariableIdx],
        })),
        backgroundColor: randomColor(),
        borderColor: randomColor(),
        borderWidth: 1,
      },
    ];
  };

  const createOptions = () => {
    return {
      scales: {
        x: {
          min: x.min,
          max: x.max,
          ticks: {
            stepSize: x.stepSize,
            autoSkip: false,
          },
        },
        y: {
          min: y.min,
          max: y.max,
          ticks: {
            stepSize: y.stepSize,
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

  const isShowChart = () => x.value > -1 && y.value > -1;

  return { createDataset, createOptions, isShowChart };
};

export default useCreateScatterChart;
