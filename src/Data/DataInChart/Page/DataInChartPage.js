import { useEffect, useState } from "react";
import TableOrGraph from "../component/DrawGraph/TableOrGraph";
import LeftSlidePage from "./leftSlidePage";
import styled from "@emotion/styled";

import { useGraphDataStore } from "../store/graphStore";

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
  width: 100%;
`;

// Data & Chart 메인 페이지
function DataInChartPage() {
  const [button, setButton] = useState("MyData");
  const graphStore = useGraphDataStore();

  useEffect(() => {
    return () => {
      graphStore.setDataInit(); // 상태 초기화 함수 호출
    };
  }, []);

  return (
    <StyledDiv>
      <LeftSlidePage setButton={setButton} />

      <TableOrGraph button={button} />
    </StyledDiv>
  );
}

export default DataInChartPage;
