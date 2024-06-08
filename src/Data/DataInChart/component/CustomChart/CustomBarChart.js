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
        <Styled.Graph>
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
        </Styled.Graph>
      )}
    </Styled.Wrapper>
  );
}

export default CustomBarChart;
