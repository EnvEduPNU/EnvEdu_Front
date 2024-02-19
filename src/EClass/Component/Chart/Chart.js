import BarChart from "./BarChart";
import BubbleChart from "./BubbleChart";
import LineChart from "./LineChart";
import MixChart from "./MixChart";
import ScatterChart from "./ScatterChart";
import * as Styled from "./Styled";

function Chart({ graphIdx, graphDataState, graphState, metaDataState }) {
  console.log(graphIdx);
  console.log(graphDataState);
  console.log(graphState);
  console.log(metaDataState);
  return (
    <Styled.Wrapper>
      <Styled.Graph>
        {graphIdx === 0 && (
          <BarChart
            graphDataState={graphDataState}
            barDataState={graphState}
            metaDataState={metaDataState}
          />
        )}

        {graphIdx === 1 && (
          <LineChart
            graphDataState={graphDataState}
            lineDataState={graphState}
            metaDataState={metaDataState}
          />
        )}

        {graphIdx === 2 && (
          <BubbleChart
            graphDataState={graphDataState}
            bubbleDataState={graphState}
            metaDataState={metaDataState}
          />
        )}
        {graphIdx === 4 && (
          <ScatterChart
            graphDataState={graphDataState}
            scatterDataState={graphState}
            metaDataState={metaDataState}
          />
        )}
        {graphIdx === 5 && (
          <MixChart
            graphDataState={graphDataState}
            mixDataState={graphState}
            metaDataState={metaDataState}
          />
        )}
      </Styled.Graph>
    </Styled.Wrapper>
  );
}

export default Chart;
