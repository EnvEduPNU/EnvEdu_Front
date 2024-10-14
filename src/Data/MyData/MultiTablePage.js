import React, { useState, useEffect } from 'react';
import { Container, Button, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LectureCard from './LectureCard'; // 분리된 카드 컴포넌트
import TextDataCardModal from './modal/TextDataCardModal'; // 분리된 모달 컴포넌트
import ExcelDataModal from './modal/ExcelDataModal'; // 분리된 엑셀 모달 컴포넌트
import * as XLSX from 'xlsx';
import { customAxios } from '../../Common/CustomAxios';

const MultiTablePage = () => {
  const navigate = useNavigate();
  const [excelData, setExcelData] = useState([]);
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState([]); // cards 상태 변경

  // 엑셀 파일 업로드 및 데이터 읽기
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return; // 파일이 선택되지 않은 경우 처리하지 않음
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
      setExcelModalOpen(true); // 엑셀 파일 업로드 후 모달 열기
      event.target.value = ''; // 파일 인풋 초기화
    };
    reader.readAsArrayBuffer(file);
  };

  // 엑셀 모달 닫기
  const handleExcelModalClose = () => {
    setExcelModalOpen(false);
    setExcelData([]); // 모달을 닫을 때 excelData 초기화
  };

  // 모달 열기/닫기
  const handleOpenModal = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  // 서버에서 전체 카드 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    // 데이터 로드 함수
    const fetchCards = async () => {
      try {
        const response = await customAxios.get(
          '/api/data-in-textbooks/getAllRecords',
        ); // API 엔드포인트 호출
        setCards(response.data); // 받아온 데이터를 cards 상태에 저장

        console.log(
          '들어온 카드 데이터 확인 : ' + JSON.stringify(response.data, null, 2),
        );
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards(); // 컴포넌트가 마운트될 때 데이터 로드
  }, []);

  // 카드 슬라이드
  const nextCard = () => {
    if (currentIndex < cards.length - 3) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <Container sx={{ minWidth: '50rem' }}>
      {/* 첫 번째 섹션: 버튼 그룹 */}
      <div
        style={{
          backgroundColor: '#f7f7f7',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <div>
          <Typography variant="h5" sx={{ margin: '0 40px 20px 30px' }}>
            저장하고 싶은 데이터를 추가해주세요!
          </Typography>
        </div>

        {/* 버튼 그룹 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0 40px 20px 30px',
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              height: '100px',
              flex: '1',
              marginRight: '10px',
              fontSize: '1.5rem',
              backgroundColor: '#E6E6FA', // 연보라색 배경색
              color: '#000', // 텍스트 색상
              '&:hover': {
                backgroundColor: '#D8BFD8', // 호버 시 조금 더 진한 연보라색
              },
            }}
            component="label"
          >
            내 컴퓨터에서 불러오기
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                handleExcelUpload(e);
              }}
              hidden
            />
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{
              height: '100px',
              flex: '1',
              marginRight: '10px',
              fontSize: '1.5rem',
              backgroundColor: '#E6E6FA', // 연보라색 배경색
              color: '#000', // 텍스트 색상
              '&:hover': {
                backgroundColor: '#D8BFD8', // 호버 시 조금 더 진한 연보라색
              },
            }}
            onClick={() => navigate('/openAPI')}
          >
            공공데이터
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{
              height: '100px',
              flex: '1',
              fontSize: '1.5rem',
              backgroundColor: '#E6E6FA', // 연보라색 배경색
              color: '#000', // 텍스트 색상
              '&:hover': {
                backgroundColor: '#D8BFD8', // 호버 시 조금 더 진한 연보라색
              },
            }}
            onClick={() => navigate('/socket')}
          >
            Seed데이터
          </Button>
        </div>
      </div>

      {/* 두 번째 섹션: 카드 목록 */}
      <div
        style={{
          backgroundColor: '#f7f7f7',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <div>
          <Typography variant="h5" sx={{ margin: '0 40px 20px 30px' }}>
            TextBook에 있는 Data들도 추가할 수 있어요!
          </Typography>
        </div>

        {/* 슬라이드 화살표 및 카드 목록 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={prevCard} disabled={currentIndex === 0}>
            <ArrowBackIosIcon />
          </IconButton>

          <div
            style={{
              display: 'flex',
              overflow: 'hidden',
              flex: '1',
              padding: '0 10px',
              height: '280px',
            }}
          >
            {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
              <div
                style={{
                  flex: '1',
                  minWidth: 'calc(33.33% - 10px)',
                  marginRight: index !== 2 ? '10px' : '0',
                }}
                key={index}
              >
                <LectureCard card={card} handleOpenModal={handleOpenModal} />
              </div>
            ))}
          </div>

          <IconButton
            onClick={nextCard}
            disabled={currentIndex >= cards.length - 3}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </div>

      {/* Excel 데이터 모달 */}
      {excelModalOpen && (
        <ExcelDataModal
          open={excelModalOpen}
          handleClose={handleExcelModalClose}
          data={excelData}
        />
      )}

      {/* 모달 컴포넌트 */}
      {modalOpen && selectedCard && (
        <TextDataCardModal
          open={modalOpen}
          handleClose={handleCloseModal}
          card={selectedCard}
        />
      )}
    </Container>
  );
};

export default MultiTablePage;
