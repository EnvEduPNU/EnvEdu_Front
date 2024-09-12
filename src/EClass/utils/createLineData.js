import { colorsArray } from "../../DataLiteracy/utils/randomColor";

const createLineData = (graphDataState, lineDataState, metaDataState) => {
  const { variables, data } = graphDataState;
  const { min, max, stepSize } = lineDataState;
  const {
    metaData: { legendPostion, datalabelAnchor },
  } = metaDataState;

  const categorycalList = variables.filter(
    variable =>
      variable.isSelected &&
      variable.type === "Categorical" &&
      variable.axis !== null
  );
  const numericList = variables.filter(
    variable =>
      variable.isSelected &&
      variable.type === "Numeric" &&
      variable.axis !== null
  );

  const labels = data
    .slice(1)
    .map(item => item[data[0].indexOf(categorycalList[0].name)]);

  const createDataset = () => {
    return numericList.map((variable, idx) => ({
      label: variable.name,
      data: data.slice(1).map(item => item[data[0].indexOf(variable.name)]),
      backgroundColor: colorsArray[idx],
      borderWidth: 1,
    }));
  };

  const createOptions = () => {
    if (categorycalList.length === 1 && categorycalList[0].axis === "X") {
      return {
        scales: {
          x: {
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
              text: categorycalList[0].name,
            },
          },
          y: {
            min,
            max,
            ticks: {
              stepSize,
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
              text: numericList.length > 0 ? numericList[0].name : "",
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
    data: {
      labels,
      datasets: createDataset(),
    },
    options: createOptions(),
  };
};

export default createLineData;
