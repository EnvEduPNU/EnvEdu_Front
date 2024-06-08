import { useEffect, useState } from "react";
import { colorsArray } from "../../../DataLiteracy/utils/randomColor";
import { useBarStore } from "../store/barStore";
import { categoricalStore } from "../store/categoricalStore";
import useChartMetaDataStore from "../store/chartMetaDataStore";
import { useGraphDataStore } from "../store/graphStore";

const useBarData = () => {
  const { variables, data } = useGraphDataStore();
  const { changeCategory } = categoricalStore(); // 스토어에서 범주 배열과 변경 함수 가져오기
  const categoryStore = categoricalStore();

  const { min, max, stepSize, changeMaxValue } = useBarStore();
  const barStore = useBarStore();
  const { legendPostion, datalabelAnchor } = useChartMetaDataStore(
    (state) => state.metaData
  );

  let errorMessage = null;
  let labels = null;

  const [maxNumber, setMaxNumber] = useState(100); // maxNumber를 상태로 관리

  // x축에 category가 있으면 x축엔 변인이 하나만 와야하고 y축에는 다 number가 되야함
  // y축에 category가 있으면 y축엔 변인이 하나만 와야하고 x축에는 다 number가 되야함

  const categorycalList = variables.filter(
    (variable) =>
      variable.isSelected &&
      variable.type === "Categorical" &&
      variable.axis !== null
  );
  const numericList = variables.filter(
    (variable) =>
      variable.isSelected &&
      variable.type === "Numeric" &&
      variable.axis !== null
  );

  // 초기값 설정
  useEffect(() => {
    if (numericList.length > 0) {
      const numericIndex = data[0].indexOf(numericList[0]._name);
      const valuesForNumeric = data.slice(1).map((row) => row[numericIndex]);
      const initialMaxNumber = Math.max(...valuesForNumeric);
      setMaxNumber(initialMaxNumber * 2);
    }
  }, [data, numericList]); // 데이터가 변경될 때만 실행

  // 종속성 배열에서 maxNumber 제거
  useEffect(() => {
    console.log("큰수 리랜더링 : " + maxNumber);
    changeCategory(categoricalData);
    changeMaxValue(maxNumber);
  }, [maxNumber]); // maxNumber를 종속성 배열에서 제거

  // 문자열 형 변인이 선택 되었을때
  // 첫 번째 행(제목 행)을 제외하고 각 행의 첫 번째 요소만 추출
  const categoricalData = data.slice(1).map((row) => row[0]);
  console.log("데이터 한번 보자 : " + JSON.stringify(categoricalData, null, 2));

  if (categorycalList.length === 0) {
    errorMessage = "Categorical 변인을 선택해주세요.";
  } else if (categorycalList.length > 1) {
    errorMessage = "Categorical 변인을 하나만 선택해주세요.";
  } else if (categorycalList.length === 1) {
    if (categorycalList[0].getAxis === null) {
      errorMessage = "축을 선택해 주세요";
    } else {
      const numerLicAxisList = numericList.map((variable) => variable.axis);
      if (numerLicAxisList.includes(categorycalList[0].axis)) {
        errorMessage =
          "Categorical 변인이 들어간 축에는 하나의 변인만 올 수 있습니다.";
      }
      // 여기가 데이터 차트 바 나오는 곳
      else {
        const categoryLenth = categoryStore.getCategoriesLength();
        console.log("카테고리 길이 : " + categoryLenth);
        errorMessage = null;
        labels = data
          .slice(1, categoryLenth)
          .map((item) => item[data[0].indexOf(categorycalList[0].name)]);
      }
    }
  }

  const createDataset = () => {
    return numericList.map((variable, idx) => ({
      label: variable.name,
      data: data.slice(1).map((item) => item[data[0].indexOf(variable.name)]),
      backgroundColor: colorsArray[idx],
      borderWidth: 1,
    }));
  };

  const createOptions = () => {
    if (categorycalList.length === 1 && categorycalList[0].axis !== null) {
      const axis = categorycalList[0].axis.toLowerCase();
      const oppositeAxis = axis === "x" ? "y" : "x";
      return {
        indexAxis: axis,
        scales: {
          [axis]: {
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
          [oppositeAxis]: {
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
    createDataset,
    createOptions,
    errorMessage,
    isError: errorMessage !== null,
    labels,
  };
};

export default useBarData;
