import { useGraphDataStore } from "../store/graphStore";
import { useMixStore } from "../store/mixStore";
import { colorsArray } from "../../../DataLiteracy/utils/randomColor";
import useChartMetaDataStore from "../store/chartMetaDataStore";

const useMixData = () => {
  let errorMessage = null;
  let labels = null;
  const { variables, data } = useGraphDataStore();
  const { y1Axis, y2Axis } = useMixStore();
  const { legendPostion, datalabelAnchor } = useChartMetaDataStore(
    state => state.metaData
  );

  // x축에 category가 있으면 x축엔 변인이 하나만 와야하고 y축에는 다 number가 되야함
  // y축에 category가 있으면 y축엔 변인이 하나만 와야하고 x축에는 다 number가 되야함

  const graphSelectedList = variables.filter(
    variable =>
      variable.isSelected &&
      variable.axis !== null &&
      variable.graph !== null &&
      variable.type === "Numeric"
  );
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

  if (categorycalList.length === 0) {
    errorMessage = "Categorical 변인을 선택해주세요.";
  } else if (categorycalList.length > 1) {
    errorMessage = "Categorical 변인을 하나만 선택해주세요.";
  } else if (numericList.length !== graphSelectedList.length) {
    errorMessage = "변인의 그래프를 선택해 주세요.";
  } else if (categorycalList.length === 1) {
    if (categorycalList[0].axis === null) {
      errorMessage = "축을 선택해 주세요";
    } else if (categorycalList[0].axis === "Y") {
      errorMessage = "Categorical 변인은 X축만 가능합니다.";
    } else {
      const numerLicAxisList = numericList.map(variable => variable.axis);
      if (numerLicAxisList.includes("X")) {
        errorMessage = "Numeric 변인은 Y축만 가능합니다.";
      } else {
        errorMessage = null;
        labels = data
          .slice(1)
          .map(item => item[data[0].indexOf(categorycalList[0].name)]);
      }
    }
  }

  const createDataset = () => {
    if (errorMessage === null)
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
    createDataset,
    createOptions,
    errorMessage,
    isError: errorMessage !== null,
    labels,
  };
};

export default useMixData;
