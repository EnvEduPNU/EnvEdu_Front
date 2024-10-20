import { useState } from 'react';
import TableOrGraph from '../component/DrawGraph/TableOrGraph';
import LeftSlidePage from './LeftSlidePage';
import styled from '@emotion/styled';

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
  width: 100%;
`;

// Data & Chart 메인 페이지
function DataInChartPage() {
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState([]);
  return (
    <StyledDiv>
      {/* 왼쪽 사이드 메뉴 */}
      <LeftSlidePage
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        summary={summary}
        setSummary={setSummary}
      />

      {/* 오른쪽 테이블 및 그래프 */}
      <TableOrGraph setSummary={setSummary} />
    </StyledDiv>
  );
}

export default DataInChartPage;
