import { colorsArray } from "../../DataLiteracy/utils/randomColor";

function createScatterData(graphDataState, scatterDataState, metaDataState) {
  const { variables, data } = graphDataState;
  const { xAxis, yAxis } = scatterDataState;
  const {
    metaData: { legendPostion, datalabelAnchor },
  } = metaDataState;

  const xVariavleList = variables.filter(
    variable => variable.isSelected && variable.axis === "X"
  );

  const yVariavleList = variables.filter(
    variable => variable.isSelected && variable.axis === "Y"
  );

  const createDataset = () => {
    if (xVariavleList.length === 1 && yVariavleList.length === 1) {
      return [
        {
          label: "산점도 그래프",
          data: data.slice(1).map(item => ({
            x: item[data[0].indexOf(xVariavleList[0].name)],
            y: item[data[0].indexOf(yVariavleList[0].name)],
            // label: item[qualitativeVariableIdx],
          })),
          backgroundColor: colorsArray[0],
          borderWidth: 1,
        },
      ];
    }
  };

  const createOptions = () => {
    if (xVariavleList.length === 1 && yVariavleList.length === 1) {
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

export default createScatterData;
