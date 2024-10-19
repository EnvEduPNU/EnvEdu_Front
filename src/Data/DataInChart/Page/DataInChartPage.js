import { useEffect, useState } from 'react';
import TableOrGraph from '../component/DrawGraph/TableOrGraph';
import LeftSlidePage from './leftSlidePage';
import styled from '@emotion/styled';

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
  width: 100%;
`;

// Data & Chart 메인 페이지
function DataInChartPage() {
  const [dataCategory, setDataCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (!username) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login'; // 로그인 페이지로 이동
    } else {
      setIsLoading(false); // 로그인 확인이 완료되면 로딩 상태 해제
    }
  }, []);

  // 로딩 중일 때는 로딩 화면을 보여줌
  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중 메시지 표시
  }

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
