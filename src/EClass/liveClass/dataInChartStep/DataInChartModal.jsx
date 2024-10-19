import { useEffect, useState } from 'react';
import TableOrGraph from '../../../Data/DataInChart/component/DrawGraph/TableOrGraph';
import LeftSlidePage from '../../../Data/DataInChart/Page/leftSlidePage';
import styled from '@emotion/styled';

// 모달 배경 및 컨테이너 스타일 정의
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 80%;
  height: 80%;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
  width: 100%;
`;

// Data & Chart 메인 페이지
function DataInChartModal({ isModalOpen }) {
  const [dataCategory, setDataCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [localIsModalOpen, setLocalIsModalOpen] = useState(isModalOpen); // 모달 열고 닫기 상태 추가
  const [isStepComplete, setIsStepComplete] = useState(false); // 다음 스텝 여부 상태 추가

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (!username) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login'; // 로그인 페이지로 이동
    } else {
      setIsLoading(false); // 로그인 확인이 완료되면 로딩 상태 해제
    }
  }, []);

  // dataCategory가 변경되면 스텝을 완료로 변경
  useEffect(() => {
    if (dataCategory) {
      setIsStepComplete(true); // dataCategory가 설정되면 스텝 완료로 설정
    }
  }, [dataCategory]);

  // 로딩 중일 때는 로딩 화면을 보여줌
  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중 메시지 표시
  }

  return (
    <>
      {localIsModalOpen && (
        <ModalBackground>
          <ModalContainer>
            <button onClick={() => setLocalIsModalOpen(false)}>닫기</button>

            <StyledDiv>
              {/* 왼쪽 사이드 메뉴 */}
              <LeftSlidePage setDataCategory={setDataCategory} />

              {/* 오른쪽 테이블 및 그래프 */}
              {isStepComplete ? (
                <TableOrGraph dataCategory={dataCategory} />
              ) : (
                <div>카테고리를 선택해주세요</div>
              )}
            </StyledDiv>
          </ModalContainer>
        </ModalBackground>
      )}
    </>
  );
}

export default DataInChartModal;
