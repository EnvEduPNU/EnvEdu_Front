import { useEffect, useState } from "react";
import TableOrGraph from "../component/DrawGraph/TableOrGraph";
import LeftSlidePage from "./leftSlidePage";
import styled from "@emotion/styled";

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
`;

// Data & Chart 메인 페이지
function DataInChartPage() {
  const [button, setButton] = useState("MyData");

  useEffect(() => {
    console.log("Data&Chart 버튼체크 : " + button);
  }, [button]);

  return (
    <StyledDiv>
      <LeftSlidePage setButton={setButton} />

      <TableOrGraph button={button} />
    </StyledDiv>
  );
}

export default DataInChartPage;
