import * as Styled from "./Styled";
import CustomTable from "../../common/CustomTable/CustomTable";
import { ustTabStore } from "../../store/tabStore";
import Header from "../../common/Header/Header";
import BarEditor from "../Editor/BarEditor/BarEditor";
import CustomTableHeader from "../../common/CustomTable/CustomTableHeader";
import CustomBarChart from "../../common/CustomChart/CustomBarChart/CustomBarChart";
import Description from "../../common/Description/Description";
import CustomLineChart from "../../common/CustomChart/CustomBarChart/CustomLineChart";
import LineEditor from "../Editor/LineEditor/LineEditor";
import ScatterEditor from "../Editor/ScatterEditor/ScatterEditor";
import CustomScatterChart from "../../common/CustomChart/CustomBarChart/CustomScatterChart";
import BubbleEditor from "../Editor/BubbleEditor/BubbleEditor";
import CustomBubbleChart from "../../common/CustomChart/CustomBarChart/CustomBubbleChart";
import MixEditor from "../Editor/MixEditor/MixEditor";
import CustomMixChart from "../../common/CustomChart/CustomBarChart/CustomMixChart";
import { useGraphDataStore } from "../../store/graphStore";

function DrawGraphV2Page() {
  const tab = ustTabStore(state => state.tab);
  const graphIdx = useGraphDataStore(state => state.graphIdx);
  return (
    <Styled.Wrapper>
      <Header />
      {tab === "table" && (
        <Styled.TableTabWrapper>
          <Description />
          <CustomTable />
        </Styled.TableTabWrapper>
      )}
      {tab === "graph" && (
        <Styled.GraphTapWrapper>
          <CustomTableHeader />
          <Styled.GraphWrapper>
            {graphIdx == 0 && (
              <>
                <CustomBarChart />
                <BarEditor />
              </>
            )}
            {graphIdx == 1 && (
              <>
                <CustomLineChart />
                <LineEditor />
              </>
            )}
            {graphIdx == 2 && (
              <>
                <CustomBubbleChart />
                <BubbleEditor />
              </>
            )}
            {graphIdx == 3 && <></>}
            {graphIdx == 4 && (
              <>
                <CustomScatterChart />
                <ScatterEditor />
              </>
            )}
            {graphIdx == 5 && (
              <>
                <CustomMixChart />
                <MixEditor />
              </>
            )}
          </Styled.GraphWrapper>
        </Styled.GraphTapWrapper>
      )}
    </Styled.Wrapper>
  );
}

export default DrawGraphV2Page;
