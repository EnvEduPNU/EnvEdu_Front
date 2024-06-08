import { Bar } from "react-chartjs-2";
import * as Styled from "./Styled";
import useBarData from "../../hooks/useBarData";
import VerticalSlider from "../CustomTable/VerticalSlider";
import DiscreteSliderLabel from "../CustomTable/DiscreteSliderLabel";

function CustomBarChart() {
  const { labels, createDataset, createOptions, errorMessage, isError } =
    useBarData();

  return (
    <Styled.Wrapper>
      {isError ? (
        <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "5vh",
            marginBottom: "5vh",
          }}
        >
          <div style={{ display: "flex", margin: "10px" }}>
            <VerticalSlider />
            <Bar
              style={{ width: "100%", height: "100%" }}
              data={{
                labels,
                datasets: createDataset(),
              }}
              options={createOptions()}
            />
          </div>
          <DiscreteSliderLabel />
        </div>
      )}
    </Styled.Wrapper>
  );
}

export default CustomBarChart;
