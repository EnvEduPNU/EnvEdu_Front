import * as Styled from "./Styled";
import ExpertCustomTable from "../../common/CustomTable/ExpertCustomTable";
import { useTabStore } from "../../../Data/DataInChart/store/tabStore";
import Header from "../../common/Header/Header";
import ExpertCustomTableHeader from "../../common/CustomTable/ExpertCustomTableHeader";
import Description from "../../common/Description/Description";
import ExpertGraphAndEditor from "../GraphAndEditor/ExpertGraphAndEditor";

function DrawGraphV2Page() {
  const { tab } = useTabStore();
  return (
    <Styled.Wrapper>
      <Header />
      {tab === "table" && (
        <Styled.TableTabWrapper>
          <Description />
          <ExpertCustomTable />
        </Styled.TableTabWrapper>
      )}
      {tab === "graph" && (
        <Styled.GraphTapWrapper>
          <ExpertCustomTableHeader />
          <ExpertGraphAndEditor />
        </Styled.GraphTapWrapper>
      )}
    </Styled.Wrapper>
  );
}

export default DrawGraphV2Page;
