import { Bar } from "react-chartjs-2";
import * as Styled from "./Styled";
import useLineData from "../../../hooks/useLineData";
import useMixData from "../../../hooks/useMixData";

function CustomMixChart() {
  const { labels, createDataset, createOptions, errorMessage, isError } =
    useMixData();

  return (
    <Styled.Wrapper>
      {isError ? (
        <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
      ) : (
        <Styled.Graph>
          <Bar
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

export default CustomMixChart;
