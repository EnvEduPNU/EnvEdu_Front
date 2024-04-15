import { Line } from "react-chartjs-2";
import * as Styled from "./Styled";
import useLineData from "../../hooks/useLineData";

function CustomLineChart() {
  const { labels, createDataset, createOptions, errorMessage, isError } =
    useLineData();

  return (
    <Styled.Wrapper>
      {isError ? (
        <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
      ) : (
        <Styled.Graph>
          <Line
            style={{ width: "100%", height: "100%" }}
            data={{
              labels,
              datasets: createDataset(),
            }}
            options={createOptions()}
          />
        </Styled.Graph>
      )}
    </Styled.Wrapper>
  );
}

export default CustomLineChart;
