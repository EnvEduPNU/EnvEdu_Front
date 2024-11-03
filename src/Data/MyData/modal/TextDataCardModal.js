import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 라이브러리
import { customAxios } from '../../../Common/CustomAxios';

const TextDataCardModal = ({ open, handleClose, card }) => {
  // 데이터 추가 버튼 클릭 시 호출할 함수
  const handleFinalSave = async () => {
    const numericFieldsList = [];
    const stringFieldsList = [];
    let columnIndex = 0;

    // card.data에서 numericFields와 stringFields 리스트 생성
    card.data.forEach((row) => {
      for (const key in row) {
        // 값을 숫자로 변환 가능한지 확인
        const value = row[key];
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          // 숫자 형식일 경우 numericFieldsList에 추가
          numericFieldsList.push({
            [key]: {
              value: parseFloat(value), // 숫자로 변환하여 추가
              order: columnIndex,
            },
          });
        } else {
          // 문자열 형식일 경우 stringFieldsList에 추가
          stringFieldsList.push({
            [key]: {
              value: value,
              order: columnIndex,
            },
          });
        }
        columnIndex += 1;
      }
    });

    // API 요청에 필요한 JSON 데이터 생성
    const jsonData = {
      dataUUID: uuidv4(), // 고유한 UUID 생성
      saveDate: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      title: card.title || '',
      memo: card.memo || '', // memo가 필요하다면 추가
      dataLabel: 'CUSTOM',
      userName: localStorage.getItem('username') || 'unknown_user',
      numericFields: numericFieldsList,
      stringFields: stringFieldsList,
    };

    try {
      const response = await customAxios.post('/api/custom/save', jsonData);
      console.log('데이터가 성공적으로 저장되었습니다:', response.data);
      // console.log(
      //   '데이터가 성공적으로 저장되었습니다:',
      //   JSON.stringify(jsonData, null, 2),
      // );

      alert('데이터가 저장되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
      alert('데이터 저장 오류!');
    }

    handleClose(); // 모달 닫기
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxHeight: '80vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {card.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          {card.content}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {Object.keys(card.data[0]).map((property, index) => (
                  <TableCell key={index}>{property}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {card.data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((key, colIndex) => (
                    <TableCell key={colIndex}>{row[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleFinalSave} // 데이터 추가 버튼 클릭 시 handleFinalSave 호출
            sx={{ marginRight: 1 }}
          >
            데이터 추가
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TextDataCardModal;
