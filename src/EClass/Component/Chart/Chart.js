import BarChart from "./BarChart";
import LineChart from "./LineChart";
import * as Styled from "./Styled";

function Chart({ graphIdx, graphDataState, graphState, metaDataState }) {
  return (
    <Styled.Wrapper>
      <Styled.Graph>
        {graphIdx == 0 && (
          <BarChart
            graphDataState={graphDataState}
            barDataState={graphState}
            metaDataState={metaDataState}
          />
        )}

        {graphIdx == 1 && (
          <LineChart
            graphDataState={graphDataState}
            lineDataState={graphState}
            metaDataState={metaDataState}
          />
        )}
      </Styled.Graph>
    </Styled.Wrapper>
  );
}

export default Chart;
