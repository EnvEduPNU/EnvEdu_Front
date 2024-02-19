import Axis from "../../utils/Axis";
import Variable from "../../utils/Variable";
import BarChart from "./BarChart";
import BubbleChart from "./BubbleChart";
import LineChart from "./LineChart";
import MixChart from "./MixChart";
import ScatterChart from "./ScatterChart";
import * as Styled from "./Styled";

function ChartForAssignment({ data }) {
  const { data: graphData, graphIdx, axisData, metaData } = data;

  data.variables = data.variables.map(variable => {
    const v = new Variable(variable._name);
    v.setting(variable._type, variable._axis, variable._graph);
    return v;
  });

  const newAxisData = {};
  if (graphIdx !== 0 && graphIdx !== 1) {
    for (const [key, oldAxis] of Object.entries(axisData)) {
      const axis = new Axis();
      axis.setting(oldAxis._min, oldAxis._max, oldAxis._stepSize);
      newAxisData[key] = axis;
    }
  }

  const graphDataState = { variables: data.variables, data: graphData };

  return (
    <Styled.Wrapper>
      <Styled.Graph>
        {graphIdx === 0 && (
          <BarChart
            graphDataState={graphDataState}
            barDataState={axisData}
            metaDataState={{ metaData }}
          />
        )}

        {graphIdx === 1 && (
          <LineChart
            graphDataState={graphDataState}
            lineDataState={axisData}
            metaDataState={{ metaData }}
          />
        )}

        {graphIdx === 2 && (
          <BubbleChart
            graphDataState={graphDataState}
            bubbleDataState={newAxisData}
            metaDataState={{ metaData }}
          />
        )}
        {graphIdx === 4 && (
          <ScatterChart
            graphDataState={graphDataState}
            scatterDataState={newAxisData}
            metaDataState={{ metaData }}
          />
        )}
        {graphIdx === 5 && (
          <MixChart
            graphDataState={graphDataState}
            mixDataState={newAxisData}
            metaDataState={{ metaData }}
          />
        )}
      </Styled.Graph>
    </Styled.Wrapper>
  );
}

export default ChartForAssignment;
