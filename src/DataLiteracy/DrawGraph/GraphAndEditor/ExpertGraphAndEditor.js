import CustomBarChart from "../../common/CustomChart/CustomBarChart/CustomBarChart";
import CustomBubbleChart from "../../common/CustomChart/CustomBarChart/CustomBubbleChart";
import CustomLineChart from "../../common/CustomChart/CustomBarChart/CustomLineChart";
import CustomMixChart from "../../common/CustomChart/CustomBarChart/CustomMixChart";
import CustomScatterChart from "../../common/CustomChart/CustomBarChart/CustomScatterChart";
import { useGraphDataStore } from "../../store/graphStore";
import BarEditor from "../Editor/BarEditor/BarEditor";
import BubbleEditor from "../Editor/BubbleEditor/BubbleEditor";
import LineEditor from "../Editor/LineEditor/LineEditor";
import MixEditor from "../Editor/MixEditor/MixEditor";
import ScatterEditor from "../Editor/ScatterEditor/ScatterEditor";
import * as Styled from "./Styled";

function ExpertGraphAndEditor() {
  const graphIdx = useGraphDataStore((state) => state.graphIdx);
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

export default ExpertGraphAndEditor;
