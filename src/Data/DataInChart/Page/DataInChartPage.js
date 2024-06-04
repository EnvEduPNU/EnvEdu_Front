import TableOrGraph from "../component/DrawGraph/TableOrGraph";
import LeftSlidePage from "./leftSlidePage";
import styled from "@emotion/styled";

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
`;

// Data & Chart 메인 페이지
function DataInChartPage() {
  return (
    <StyledDiv>
      <LeftSlidePage />

      <TableOrGraph />
    </StyledDiv>
  );
}

export default DataInChartPage;
