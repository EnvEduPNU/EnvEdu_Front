import * as Styled from "./Styled";
import CustomTable from "../../common/CustomTable/CustomTable";
import { ustTabStore } from "../../store/tabStore";
import Header from "../../common/Header/Header";
import CustomTableHeader from "../../common/CustomTable/CustomTableHeader";
import Description from "../../common/Description/Description";
import GraphAndEditor from "../GraphAndEditor/GraphAndEditor";

function DrawGraphV2Page() {
  const tab = ustTabStore(state => state.tab);
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
          <GraphAndEditor />
        </Styled.GraphTapWrapper>
      )}
    </Styled.Wrapper>
  );
}

export default DrawGraphV2Page;
