import { Scatter } from "react-chartjs-2";
import useScatterData from "../../../hooks/useScatterData";

import * as Styled from "./Styled";

function CustomScatterChart() {
  const { labels, createDataset, createOptions, errorMessage, isError } =
    useScatterData();
  return (
    <Styled.Wrapper>
      {isError ? (
        <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
      ) : (
        <Styled.Graph>
          <Scatter
            style={{ width: "100%", height: "100%" }}
            data={{ datasets: createDataset() }}
            options={createOptions()}
          />
        </Styled.Graph>
      )}
    </Styled.Wrapper>
  );
}

export default CustomScatterChart;
