import { colorsArray } from "../../DataLiteracy/utils/randomColor";

function createMixData(graphDataState, mixDataState, metaDataState) {
  const { variables, data } = graphDataState;
  const { y1Axis, y2Axis } = mixDataState;
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
  console.log(categorycalList);
  const labels = data
    .slice(1)
    .map(item => item[data[0].indexOf(categorycalList[0].name)]);

  const createDataset = () => {
    return numericList.map((variable, idx) => ({
      label: variable.name,
      data: data.slice(1).map(item => item[data[0].indexOf(variable.name)]),
      backgroundColor: colorsArray[idx],
      borderWidth: 1,
      yAxisID: variable.axis.toLowerCase(),
      type: variable.graph.toLowerCase(),
    }));
  };

  const createOptions = () => {
    const y1AxisList = variables.filter(
      variable =>
        variable.isSelected &&
        variable.axis === "Y1" &&
        variable.graph !== null &&
        variable.type === "Numeric"
    );

    const y2AxisList = variables.filter(
      variable =>
        variable.isSelected &&
        variable.axis === "Y2" &&
        variable.graph !== null &&
        variable.type === "Numeric"
    );
    return {
      scales: {
        x: {
          title: {
            // 이 축의 단위 또는 이름도 title 속성을 이용하여 표시할 수 있습니다.
            display: true,
            align: "end",
            color: "#808080",
            font: {
              size: 12,
              family: "'Noto Sans KR', sans-serif",
              weight: 300,
            },
            text: categorycalList.length > 0 ? categorycalList[0].name : "",
          },
        },
        y1: {
          position: "left",
          id: "y1",
          min: y1Axis.min,
          max: y1Axis.max,
          ticks: {
            stepSize: y1Axis.stepSize,
            autoSkip: false,
          },
          title: {
            // 이 축의 단위 또는 이름도 title 속성을 이용하여 표시할 수 있습니다.
            display: true,
            align: "end",
            color: "#808080",
            font: {
              size: 12,
              family: "'Noto Sans KR', sans-serif",
              weight: 300,
            },
            text: y1AxisList.length > 0 ? y1AxisList[0].name : "",
          },
        },
        y2: {
          position: "right",
          id: "y2",
          display: true,
          min: y2Axis.min,
          max: y2Axis.max,
          ticks: {
            stepSize: y2Axis.stepSize,
            autoSkip: false,
          },
          title: {
            // 이 축의 단위 또는 이름도 title 속성을 이용하여 표시할 수 있습니다.
            display: true,
            align: "end",
            color: "#808080",
            font: {
              size: 12,
              family: "'Noto Sans KR', sans-serif",
              weight: 300,
            },
            text: y2AxisList.length > 0 ? y2AxisList[0].name : "",
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

  return {
    data: {
      labels,
      datasets: createDataset(),
    },
    options: createOptions(),
  };
}

export default createMixData;
