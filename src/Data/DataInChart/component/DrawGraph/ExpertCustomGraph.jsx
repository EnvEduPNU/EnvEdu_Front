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
import SelectGraph from './graphs/SelectGraph';
import { useLogStore } from '../../../../Log/store/logStore';

function ExpertCustomGraph({ onAddPhoto, isDrawGraph }) {
  // onAddPhoto prop을 받아서 상위 컴포넌트로 데이터 전달
  const { graphIdx } = useGraphDataStore();
  const content = useLogStore((state) => state.content);
  const [capturedImage, setCapturedImage] = useState(null); // 캡쳐된 이미지를 저장할 상태
  const [openModal, setOpenModal] = useState(false); // 모달 열기/닫기 상태
  const [photoTitle, setPhotoTitle] = useState(''); // 사진 제목 상태
  const graphRef = useRef(null); // 그래프를 캡쳐하기 위해 사용할 ref

  // 캡쳐 버튼 클릭 시 실행할 함수
  const handleCapture = async () => {
    if (graphRef.current) {
      // html2canvas로 그래프 캡처
      const canvas = await html2canvas(graphRef.current);

      // 압축 캔버스 생성
      const compressedCanvas = document.createElement('canvas');
      const ctx = compressedCanvas.getContext('2d');

      // 압축 크기 설정 (예: 원본 크기의 70%)
      const targetWidth = canvas.width * 0.7;
      const targetHeight = canvas.height * 0.7;
      compressedCanvas.width = targetWidth;
      compressedCanvas.height = targetHeight;

      // 원본 캔버스를 압축된 캔버스로 복사
      ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

      // 압축된 데이터를 Base64 이미지로 변환
      const imgData = compressedCanvas.toDataURL('image/jpeg', 0.8); // JPEG 품질 80%

      // 상태에 저장 및 모달 열기
      setCapturedImage(imgData);
      setOpenModal(true);
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

  console.log(content);

  return (
    <div>
      {/* 캡쳐하기 버튼 */}
      {isDrawGraph && (
        <button
          onClick={handleCapture}
          style={{
            position: 'absolute',
            padding: '10px 15px',
            backgroundColor: '#4a5568',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'inline-block', // 버튼 크기를 확실히 차지하도록 설정
            marginLeft: '20px',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2d3748'; // hover 시 색상 변경
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#4a5568'; // 기본 색상으로 복구
          }}
        >
          그래프 캡쳐
        </button>
      )}

      {/* 그래프 영역 */}

      <div ref={graphRef} style={{ margin: '20px 0' }}>
        {graphIdx === -1 && <SelectGraph />}
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
