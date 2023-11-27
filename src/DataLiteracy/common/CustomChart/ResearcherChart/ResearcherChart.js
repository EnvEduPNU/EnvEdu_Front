import { Bubble } from "react-chartjs-2";
import { useGraphDataStore } from "../../../store/graphStore";
import * as Styled from "./Styled";
import { colorsArray } from "../../../utils/randomColor";

function ResearcherChart() {
  const { title, data } = useGraphDataStore();

  const rData = data.slice(1).map(d => d[2]);
  const rDataMin = Math.min(...rData);
  const rDataMax = Math.max(...rData);
  function scaleBubbleSize(value, minValue, maxValue, minSize, maxSize) {
    return (
      ((value - minValue) / (maxValue - minValue)) * (maxSize - minSize) +
      minSize
    );
  }
  return (
    <Styled.Wrapper>
      <Styled.Graph>
        {title === "23년 7월 농업지대 기상" && (
          <Bubble
            style={{ width: "100%", height: "100%" }}
            data={{
              datasets: [
                {
                  label: "산점도 그래프",
                  data: data.slice(1).map(item => ({
                    x: item[1],
                    y: item[3],
                    r: scaleBubbleSize(item[2], rDataMin, rDataMax, 10, 30),
                    rRealData: item[2],
                  })),
                  backgroundColor: colorsArray[9],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  min: 21,
                  max: 27,
                  ticks: {
                    stepSize: 1,
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
                    text: data[0][1],
                  },
                },
                y: {
                  min: 90,
                  max: 180,
                  ticks: {
                    stepSize: 10,
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
                    text: data[0][3],
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: "top", // 'top', 'left', 'bottom', 'right' 중 하나를 선택
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
                // datalabels: {
                //   display: datalabelAnchor !== "no",
                //   anchor: datalabelAnchor,
                // },
              },
            }}
          />
        )}
      </Styled.Graph>
    </Styled.Wrapper>
  );
}

export default ResearcherChart;
