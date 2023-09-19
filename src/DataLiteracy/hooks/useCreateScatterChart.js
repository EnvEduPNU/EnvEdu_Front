import {
  useChartMetaDataStore,
  useScatterAxisScaleEditorStore,
} from "../store/drawGraphStore";
import { colorsArray } from "../utils/randomColor";

const useCreateScatterChart = (data, qualitativeVariableIdx) => {
  const axisScale = useScatterAxisScaleEditorStore(state => state.axisScale);
  const legendPostion = useChartMetaDataStore(
    state => state.metaData.legendPostion
  );
  const datalabelAnchor = useChartMetaDataStore(
    state => state.metaData.datalabelAnchor
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
        backgroundColor: colorsArray[0],
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
          display: legendPostion !== "no",
          position: legendPostion, // 'top', 'left', 'bottom', 'right' 중 하나를 선택
        },
        datalabels: {
          display: datalabelAnchor !== "no",
          anchor: datalabelAnchor,
        },
      },
    };
  };

  const isShowChart = () => x.value > -1 && y.value > -1;

  return { createDataset, createOptions, isShowChart };
};

export default useCreateScatterChart;
