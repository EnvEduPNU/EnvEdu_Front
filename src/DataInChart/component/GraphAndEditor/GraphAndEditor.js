import { useGraphDataStore } from "../../store/graphStore";
import CustomBarChart from "../CustomChart/CustomBarChart";
import CustomBubbleChart from "../CustomChart/CustomBubbleChart";
import CustomLineChart from "../CustomChart/CustomLineChart";
import CustomMixChart from "../CustomChart/CustomMixChart";
import CustomScatterChart from "../CustomChart/CustomScatterChart";
import BarEditor from "../Editor/BarEditor/BarEditor";
import BubbleEditor from "../Editor/BubbleEditor/BubbleEditor";
import LineEditor from "../Editor/LineEditor/LineEditor";
import MixEditor from "../Editor/MixEditor/MixEditor";
import ScatterEditor from "../Editor/ScatterEditor/ScatterEditor";
import * as Styled from "./Styled";

function GraphAndEditor() {
  const graphIdx = useGraphDataStore(state => state.graphIdx);

  return (
    <Styled.Wrapper>
      {graphIdx === 0 && (
        <>
          <CustomBarChart />
          <BarEditor />
        </>
      )}
      {graphIdx === 1 && (
        <>
          <CustomLineChart />
          <LineEditor />
        </>
      )}
      {graphIdx === 2 && (
        <>
          <CustomBubbleChart />
          <BubbleEditor />
        </>
      )}
      {graphIdx === 3 && <></>}
      {graphIdx === 4 && (
        <>
          <CustomScatterChart />
          <ScatterEditor />
        </>
      )}
      {graphIdx === 5 && (
        <>
          <CustomMixChart />
          <MixEditor />
        </>
      )}
    </Styled.Wrapper>
  );
}

export default GraphAndEditor;
