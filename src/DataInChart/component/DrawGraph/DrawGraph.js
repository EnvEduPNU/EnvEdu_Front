import { useTabStore } from "../../store/tabStore";
import CustomTable from "../CustomTable/CustomTable";
import CustomTableHeader from "../CustomTable/CustomTableHeader";
import GraphAndEditor from "../GraphAndEditor/GraphAndEditor";
import Header from "../Header/Header";
import * as Styled from "./Styled";

function DrawGraph() {
  const { tab } = useTabStore();

  return (
    <Styled.Wrapper>
      <Header />
      {tab === "table" && (
        <>
          <CustomTable />
        </>
      )}
      {tab === "graph" && (
        <>
          <CustomTableHeader />
          <GraphAndEditor />
        </>
      )}
    </Styled.Wrapper>
  );
}

export default DrawGraph;
