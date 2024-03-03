import { colorsArray } from "../../DataLiteracy/utils/randomColor";

function createBubbleData(graphDataState, lineDataState, metaDataState) {
  const { variables, data } = graphDataState;
  const { xAxis, yAxis } = lineDataState;
  const {
    metaData: { legendPostion, datalabelAnchor },
  } = metaDataState;

  const xVariavleList = variables.filter(
    variable => variable.isSelected && variable.axis === "X"
  );

  const yVariavleList = variables.filter(
    variable => variable.isSelected && variable.axis === "Y"
  );

  const zVariavleList = variables.filter(
    variable => variable.isSelected && variable.axis === "Z"
  );

  function scaleBubbleSize(value, minValue, maxValue, minSize, maxSize) {
    return (
      ((value - minValue) / (maxValue - minValue)) * (maxSize - minSize) +
      minSize
    );
  }

  const createDataset = () => {
    if (
      xVariavleList.length === 1 &&
      yVariavleList.length === 1 &&
      zVariavleList.length === 1
    ) {
      const zIndex = data[0].indexOf(zVariavleList[0].name);
      const rData = data.slice(1).map(d => d[zIndex]);
      const rDataMin = Math.min(...rData);
      const rDataMax = Math.max(...rData);
      return [
        {
          label: "버블 그래프",
          data: data.slice(1).map(item => ({
            x: item[data[0].indexOf(xVariavleList[0].name)],
            y: item[data[0].indexOf(yVariavleList[0].name)],
            r: scaleBubbleSize(item[zIndex], rDataMin, rDataMax, 10, 30),
            rRealData: item[zIndex],
          })),
          backgroundColor: colorsArray[9],
          borderWidth: 1,
        },
      ];
    }
  };

  const createOptions = () => {
    if (
      xVariavleList.length === 1 &&
      yVariavleList.length === 1 &&
      zVariavleList.length === 1
    ) {
      return {
        scales: {
          x: {
            min: xAxis.min,
            max: xAxis.max,
            ticks: {
              stepSize: xAxis.stepSize,
              autoSkip: false,
            },
            title: {
              // 이 축의 단위 또는 이름도 title 속성을 이용하여 표시할 수 있습니다.
              display: true,
              align: "end",
              color: "#808080",
              font: {
                size: 18,
                family: "'Noto Sans KR', sans-serif",
                weight: 300,
              },
              text: xVariavleList[0].name,
            },
          },
          y: {
            min: yAxis.min,
            max: yAxis.max,
            ticks: {
              stepSize: yAxis.stepSize,
              autoSkip: false,
            },
            title: {
              // 이 축의 단위 또는 이름도 title 속성을 이용하여 표시할 수 있습니다.
              display: true,
              align: "end",
              color: "#808080",
              font: {
                size: 18,
                family: "'Noto Sans KR', sans-serif",
                weight: 300,
              },
              text: yVariavleList[0].name,
            },
          },
        },
        plugins: {
          legend: {
            display: legendPostion !== "no",
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
          datalabels: {
            display: datalabelAnchor !== "no",
            anchor: datalabelAnchor,
          },
        },
      };
    }
  };

  return {
    data: { datasets: createDataset() },
    options: createOptions(),
  };
}

export default createBubbleData;
