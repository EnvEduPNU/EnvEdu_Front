import { useChartMetaDataStore } from "../store/drawGraphStore";
import { useGraphDataStore } from "../store/graphStore";
import { useScatterStore } from "../store/scatterStore";
import { colorsArray } from "../utils/randomColor";

const useScatterData = () => {
  let errorMessage = null;
  let labels = null;
  const { variables, data } = useGraphDataStore();
  const { xAxis, yAxis } = useScatterStore();
  const { legendPostion, datalabelAnchor } = useChartMetaDataStore(
    state => state.metaData
  );
  console.log("??");
  // x축에 category가 있으면 x축엔 변인이 하나만 와야하고 y축에는 다 number가 되야함
  // y축에 category가 있으면 y축엔 변인이 하나만 와야하고 x축에는 다 number가 되야함

  const allSelectedList = variables.filter(
    variable => variable.getIsSelected && variable.getAxis !== null
  );

  const xVariavleList = variables.filter(
    variable => variable.getIsSelected && variable.getAxis === "X"
  );

  const yVariavleList = variables.filter(
    variable => variable.getIsSelected && variable.getAxis === "Y"
  );

  if (allSelectedList.length < 2) {
    errorMessage = "변인의 축을 선택해 주세요";
  } else if (allSelectedList.length > 2) {
    errorMessage = "두개의 변인만 축을 설정할 수 있습니다.";
  } else {
    if (
      allSelectedList[0].getType === "Categorical" ||
      allSelectedList[1].getType === "Categorical"
    ) {
      errorMessage = "두개의 변인은 모두 Numeric 타입이어야 합니다.";
    } else if (allSelectedList[0].getAxis === allSelectedList[1].getAxis) {
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
            x: item[data[0].indexOf(xVariavleList[0].getName)],
            y: item[data[0].indexOf(yVariavleList[0].getName)],
            // label: item[qualitativeVariableIdx],
          })),
          backgroundColor: colorsArray[0],
          borderWidth: 1,
        },
      ];
    }
  };
  console.log(createDataset());
  const createOptions = () => {
    return {
      scales: {
        x: {
          min: xAxis.min,
          max: xAxis.max,
          ticks: {
            stepSize: xAxis.stepSize,
            autoSkip: false,
          },
        },
        y: {
          min: yAxis.min,
          max: yAxis.max,
          ticks: {
            stepSize: yAxis.stepSize,
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
  return {
    createDataset,
    createOptions,
    errorMessage,
    isError: errorMessage !== null,
    labels,
  };
};

export default useScatterData;
