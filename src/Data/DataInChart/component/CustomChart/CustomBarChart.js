import { Bar } from "react-chartjs-2";
import * as Styled from "./Styled";
import useBarData from "../../hooks/useBarData";
import VerticalSlider from "../CustomTable/VerticalSlider";
import DiscreteSliderLabel from "../CustomTable/DiscreteSliderLabel";
import makePdf from "../PDF/makePdf";

import html2canvas from "html2canvas";

import { useRef, useEffect } from "react";

function CustomBarChart(props) {
  const { labels, createDataset, createOptions, errorMessage, isError } =
    useBarData();
  const chartRef = useRef(null); // 차트 참조를 위한 ref 생성

  useEffect(() => {
    const Clicked = props.pdfClick;
    if (Clicked) {
      onClick();
    }
  }, [props]);

  // 만든 차트 PDF로 보기 클릭 버튼
  const onClick = async () => {
    try {
      // 차트 요소를 이미지로 변환
      const canvas = await html2canvas(chartRef.current, {
        width: 1300,
        height: 1400,
        x: -130,
        y: -50,
      });
      const imageFile = canvas.toDataURL("image/png", 1.0);

      // 이미지 파일 배열로 변환하여 PDF 생성 함수에 전달
      const pdf = makePdf._convertToPdf([imageFile]);
      // 서버로 PDF 전송 또는 사용자에게 제공할 수 있음
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  return (
    <Styled.Wrapper>
      {isError ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "5vh",
              marginBottom: "5vh",
            }}
          >
            <div ref={chartRef} style={{ paddingLeft: "4vh" }}>
              <div style={{ display: "flex" }}>
                <VerticalSlider />
                <Bar
                  style={{ width: "80vh", height: "80vh" }}
                  data={{
                    labels,
                    datasets: createDataset(),
                  }}
                  options={createOptions()}
                />
              </div>
              <DiscreteSliderLabel />
            </div>
          </div>
        </div>
      )}
    </Styled.Wrapper>
  );
}

export default CustomBarChart;
