import { useTabStore } from "../../store/tabStore";
import CustomTable from "../CustomTable/CustomTable";
import CustomTableHeader from "../CustomTable/CustomTableHeader";
import GraphAndEditor from "../GraphAndEditor/GraphAndEditor";
import Button from "./Button";
import * as Styled from "./Styled";

// 테이블 아니면 그래프 선택하는 탭 컴포넌트
function TableOrGraph() {
  const { tab } = useTabStore();

  return (
    <Styled.Wrapper>
      {tab === "table" && (
        <Styled.CustomTableWrapper>
          <CustomTable />
          <Button buttonName={"공공데이터 API 측정하러가기"} />
        </Styled.CustomTableWrapper>
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

export default TableOrGraph;
