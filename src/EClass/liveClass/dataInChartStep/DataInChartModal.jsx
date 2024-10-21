import { useEffect, useState } from 'react';
import TableOrGraph from '../../../Data/DataInChart/component/DrawGraph/TableOrGraph';
import styled from '@emotion/styled';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import ExpertDataButton from '../../../Data/DataInChart/Page/ExpertDataButton';
import MyDataDropdown from '../../../Data/DataInChart/Page/MyDataDropdown';

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
  width: 60%;
  height: 60%;
  padding: 20px;
  margin: 20px 0 0 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
`;

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
  width: 100%;
  justify-content: center;
`;

// React Portal을 이용한 모달 컴포넌트
function DataInChartModal({ isModalOpen, setIsModalOpen }) {
  const [dataCategory, setDataCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [localIsModalOpen, setLocalIsModalOpen] = useState(isModalOpen);
  const [isStepComplete, setIsStepComplete] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (!username) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login';
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dataCategory) {
      setIsStepComplete(true);
    }
  }, [dataCategory]);

  useEffect(() => {
    if (localIsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [localIsModalOpen]);

  // 모달 외부 클릭 막기
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // React Portal을 통해 모달을 body 바로 아래에 렌더링
  return ReactDOM.createPortal(
    localIsModalOpen && (
      <ModalBackground onClick={() => setIsModalOpen(false)}>
        <ModalContainer onClick={handleModalClick}>
          <CloseButton
            onClick={() => {
              setLocalIsModalOpen(false);
              setIsModalOpen(false);
            }}
          >
            &times;
          </CloseButton>
          <StyledDiv>
            {isStepComplete ? (
              <div style={{ maxHeight: '50rem', minWidth: '50rem' }}>
                <Button
                  onClick={() => {
                    setIsStepComplete(false);
                    setDataCategory('');
                  }}
                >
                  데이터 선택
                </Button>
                <TableOrGraph dataCategory={dataCategory} />
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div>카테고리를 선택해주세요</div>
                <ExpertDataButton setDataCategory={setDataCategory} />

                <MyDataDropdown />
              </div>
            )}
          </StyledDiv>
        </ModalContainer>
      </ModalBackground>
    ),
    document.body, // 모달을 body 바로 아래로 이동하여 DndProvider 영향에서 벗어남
  );
}

export default DataInChartModal;
