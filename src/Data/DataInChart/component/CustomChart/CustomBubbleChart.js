import { Bubble } from "react-chartjs-2";
import * as Styled from "./Styled";
import useBubbleData from "../../hooks/useBubbleData";

function CustomBubbleChart() {
  const { createDataset, createOptions, errorMessage, isError } =
    useBubbleData();
  return (
    <Styled.Wrapper>
      {isError ? (
        <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
      ) : (
        <Styled.Graph>
          <Bubble
            style={{ width: "100%", height: "100%" }}
            data={{ datasets: createDataset() }}
            options={createOptions()}
          />
        </Styled.Graph>
      )}
    </Styled.Wrapper>
  );
}

export default CustomBubbleChart;
