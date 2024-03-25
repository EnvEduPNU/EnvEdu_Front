import { useGraphDataStore } from "../store/graphStore";
import { useScatterStore } from "../store/scatterStore";
import { colorsArray } from "../../DataLiteracy/utils/randomColor";
import useChartMetaDataStore from "../store/chartMetaDataStore";

const useScatterData = () => {
  let errorMessage = null;
  let labels = null;
  const { variables, data } = useGraphDataStore();
  const { xAxis, yAxis } = useScatterStore();
  const { legendPostion, datalabelAnchor } = useChartMetaDataStore(
    state => state.metaData
  );

  const allSelectedList = variables.filter(
    variable => variable.isSelected && variable.axis !== null
  );

  const xVariavleList = variables.filter(
    variable => variable.isSelected && variable.axis === "X"
  );

  const yVariavleList = variables.filter(
    variable => variable.isSelected && variable.axis === "Y"
  );

  if (allSelectedList.length < 2) {
    errorMessage = "변인의 축을 선택해 주세요";
  } else if (allSelectedList.length > 2) {
    errorMessage = "두개의 변인만 축을 설정할 수 있습니다.";
  } else {
    if (
      allSelectedList[0].type === "Categorical" ||
      allSelectedList[1].type === "Categorical"
    ) {
      errorMessage = "두개의 변인은 모두 Numeric 타입이어야 합니다.";
    } else if (allSelectedList[0].axis === allSelectedList[1].axis) {
      errorMessage = "두개의 변인은 서로 축이 달라야 합니다.";
    } else {
      errorMessage = null;
    }
  }

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
    createDataset,
    createOptions,
    errorMessage,
    isError: errorMessage !== null,
    labels,
  };
};

export default useScatterData;
