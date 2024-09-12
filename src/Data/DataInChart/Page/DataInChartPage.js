import { useState } from "react";
import TableOrGraph from "../component/DrawGraph/TableOrGraph";
import LeftSlidePage from "./leftSlidePage";
import styled from "@emotion/styled";

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
  width: 100%;
`;

// Data & Chart 메인 페이지
function DataInChartPage() {
  const [dataCategory, setDataCategory] = useState("");

  return (
    <StyledDiv>
      {/* 왼쪽 사이드 메뉴 */}
      <LeftSlidePage setDataCategory={setDataCategory} />

      {/* 오른쪽 테이블 및 그래프 */}
      <TableOrGraph dataCategory={dataCategory} />
    </StyledDiv>
  );
}

export default DataInChartPage;
