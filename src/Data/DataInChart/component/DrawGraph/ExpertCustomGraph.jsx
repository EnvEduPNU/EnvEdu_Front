import { useRef, useState } from 'react';
import { useGraphDataStore } from '../../store/graphStore';
import BarGraph from './graphs/BarGraph';
import LineGraph from './graphs/LineGraph';
import ComboGraph from './graphs/ComboGraph';
import DoughnutGraph from './graphs/DoughnutGraph';
import ScatterGraph from './graphs/ScatterGraph';
import html2canvas from 'html2canvas';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

function ExpertCustomGraph({ onAddPhoto }) {
  // onAddPhoto prop을 받아서 상위 컴포넌트로 데이터 전달
  const { graphIdx } = useGraphDataStore();
  const [capturedImage, setCapturedImage] = useState(null); // 캡쳐된 이미지를 저장할 상태
  const [openModal, setOpenModal] = useState(false); // 모달 열기/닫기 상태
  const [photoTitle, setPhotoTitle] = useState(''); // 사진 제목 상태
  const graphRef = useRef(null); // 그래프를 캡쳐하기 위해 사용할 ref

  // 캡쳐 버튼 클릭 시 실행할 함수
  const handleCapture = async () => {
    if (graphRef.current) {
      const canvas = await html2canvas(graphRef.current); // 그래프 영역을 캡쳐
      const imgData = canvas.toDataURL('image/png'); // 캡쳐한 데이터를 이미지로 변환
      setCapturedImage(imgData); // 캡쳐된 이미지 데이터를 상태에 저장
      setOpenModal(true); // 모달 열기
    }
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    setOpenModal(false);
    setPhotoTitle(''); // 모달을 닫을 때 입력 필드 초기화
  };

  // 사진 제목 추가 핸들러
  const handleAddPhoto = () => {
    if (photoTitle.trim()) {
      const newPhoto = {
        title: photoTitle,
        image: capturedImage,
      };
      onAddPhoto(newPhoto); // 상위 컴포넌트로 객체 하나만 전달
      handleClose(); // 모달 닫기
    }
  };

  return (
    <div>
      {/* 캡쳐하기 버튼 */}
<<<<<<< HEAD
      <button
        onClick={handleCapture}
        style={{
          padding: '10px 15px',
          marginLeft: '15px',
          backgroundColor: '#4a5568',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          display: 'inline-block', // 버튼 크기를 확실히 차지하도록 설정
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#2d3748'; // hover 시 색상 변경
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#4a5568'; // 기본 색상으로 복구
        }}
=======

      <button
        className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
        onClick={handleCapture} // 테이블 캡처 버튼
        style={{ fontSize: '16px' }}
>>>>>>> c44a297 ([update] DataInChart E-Class 통합 초기 개발 완료)
      >
        그래프 캡쳐
      </button>

      {/* 그래프 영역 */}

      <div ref={graphRef} style={{ margin: '20px 0' }}>
=======
      <div ref={graphRef}>
>>>>>>> c44a297 ([update] DataInChart E-Class 통합 초기 개발 완료)
        {graphIdx === 0 && <BarGraph />}
        {graphIdx === 1 && <LineGraph />}
        {graphIdx === 2 && <ComboGraph />}
        {graphIdx === 3 && <DoughnutGraph />}
        {graphIdx === 4 && <ScatterGraph />}
      </div>

      {/* 모달 */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>캡쳐된 그래프</DialogTitle>
        <DialogContent dividers>
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured Graph"
              style={{
                width: '100%',
                maxWidth: '600px',
                display: 'block',
                margin: '0 auto',
              }}
            />
          )}
          {/* 사진 제목 입력 필드 */}
          <TextField
            fullWidth
            label="사진 제목"
            value={photoTitle}
            onChange={(e) => setPhotoTitle(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
          <Button onClick={handleAddPhoto} color="primary" variant="contained">
            사진 추가
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ExpertCustomGraph;
