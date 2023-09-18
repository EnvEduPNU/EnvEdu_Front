import {
  useChartMetaDataStore,
  useMixChartAxisScaleEditorStore,
} from "../store/drawGraphStore";
import { colorsArray } from "../utils/randomColor";

const useCreateMixChart = (data, qualitativeVariableIdx) => {
  const axisScale = useMixChartAxisScaleEditorStore(state => state.axisScale);
  const legendPostion = useChartMetaDataStore(
    state => state.metaData.legendPostion
  );

  const { x, y1, y2, barChart, lineChart } = axisScale;

  const createDataset = () => {
    const datasets = data[0].slice(1).map((label, idx) => ({
      label,
      data: data.slice(1).map(item => item[idx + 1]),
      backgroundColor: colorsArray[idx],
      borderWidth: 1,
    }));

    y1.value.forEach(v => {
      datasets[v - 1].yAxisID = "y1";
    });

    y2.value.forEach(v => {
      datasets[v - 1].yAxisID = "y2";
    });

    lineChart.forEach(idx => {
      datasets[idx - 1].type = "line";
    });
    barChart.forEach(idx => {
      datasets[idx - 1].type = "bar";
    });

    return datasets;
  };

  const createOptions = () => {
    return {
      scales: {
        y1: {
          position: "left",
          id: "y1",
          min: y1.min,
          max: y1.max,
          ticks: {
            stepSize: y1.stepSize,
            autoSkip: false,
          },
        },
        y2: {
          position: "right",
          grid: {
            drawOnChartArea: false, // 오른쪽 y축의 그리드 라인을 숨김
          },
          display: true,
          min: y2.min,
          max: y2.max,
          ticks: {
            stepSize: y2.stepSize,
            autoSkip: false,
          },
        },
      },
      plugins: {
        legend: {
          position: legendPostion, // 'top', 'left', 'bottom', 'right' 중 하나를 선택
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  };

  const variables = data[qualitativeVariableIdx];

  const isShowChart = () =>
    x.value > -1 && y1.value.length + y2.value.length === variables.length - 1;

  return { createDataset, createOptions, isShowChart };
};

export default useCreateMixChart;
