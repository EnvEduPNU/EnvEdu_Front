import { Typography } from "@mui/material";
import { useTabStore } from "../../store/tabStore";
import CustomTable from "../CustomTable/CustomTable";
import CustomTableHeader from "../CustomTable/CustomTableHeader";
import GraphAndEditor from "../GraphAndEditor/GraphAndEditor";
import PublicDataButton from "./PublicDataButton";
import SEEdAppButton from "./SEEdAppButton";
import * as Styled from "./Styled";

// 테이블 아니면 그래프 선택하는 탭 컴포넌트
function TableOrGraph() {
  const { tab } = useTabStore();

  return (
    <Styled.Wrapper>
      <Typography sx={{ fontSize: "3vh" }}>Data&Chart</Typography>

      {tab === "table" && (
        <Styled.CustomTableWrapper>
          <CustomTable />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <PublicDataButton buttonName={"공공데이터 가져오기"} />
            <SEEdAppButton buttonName={"SEEd 측정하기"} />
          </div>
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
