import {
  useBubbleAxisScaleEditorStore,
  useChartMetaDataStore,
} from "../store/drawGraphStore";
import { colorsArray } from "../utils/randomColor";

const useCreateBubbleChart = (data, qualitativeVariableIdx) => {
  const axisScale = useBubbleAxisScaleEditorStore(state => state.axisScale);
  const legendPostion = useChartMetaDataStore(
    state => state.metaData.legendPostion
  );
  const { x, y, r } = axisScale;

  function scaleBubbleSize(value, minValue, maxValue, minSize, maxSize) {
    return (
      ((value - minValue) / (maxValue - minValue)) * (maxSize - minSize) +
      minSize
    );
  }

  const createDataset = () => {
    const rData = data.slice(1).map(d => d[r.value]);
    const rDataMin = Math.min(...rData);
    const rDataMax = Math.max(...rData);
    return [
      {
        label: "버블 그래프",
        data: data.slice(1).map(item => ({
          x: item[x.value],
          y: item[y.value],
          r: scaleBubbleSize(item[r.value], rDataMin, rDataMax, 10, 30),
          label: item[qualitativeVariableIdx],
          rRealData: item[r.value],
        })),
        backgroundColor: colorsArray[9],
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
        tooltip: {
          callbacks: {
            label: function (context) {
              const point = context.dataset.data[context.dataIndex];
              const label = point.label;
              const xValue = context.parsed.x;
              const yValue = context.parsed.y;
              const rValue = point.rRealData;
              return `${label}: (${xValue}, ${yValue}, ${rValue})`;
            },
          },
        },
      },
    };
  };

  const isShowChart = () => x.value > -1 && y.value > -1 && r.value > -1;

  return { createDataset, createOptions, isShowChart };
};

export default useCreateBubbleChart;
