import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';

const ExcelDataModal = ({ open, handleClose, data }) => {
  const [dataTypes, setDataTypes] = useState(
    Object.keys(data[0]).reduce((acc, key) => {
      acc[key] = 'Categoric'; // 기본값은 Categorical로 설정
      return acc;
    }, {}),
  );

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (key, value) => {
    setDataTypes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 저장하기 버튼 클릭 시 실행되는 함수
  const handleSave = () => {
    const jsonData = data.map((row) => {
      const newRow = {};
      for (const key in row) {
        if (dataTypes[key] === 'Numeric' && isNaN(row[key])) {
          alert(`"${key}" 열에 비숫자 값이 존재합니다.`);
          return; // 숫자 형식이 아닌 값이 있는 경우 종료
        }
        newRow[key] =
          dataTypes[key] === 'Numeric' ? Number(row[key]) : String(row[key]); // Categorical일 경우 문자열로 변환
      }
      return newRow;
    });

    console.log(JSON.stringify(jsonData, null, 2)); // JSON 형식으로 출력
    // handleClose(); // 모달 닫기
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          내 컴퓨터에서 불러오기
        </Typography>
        <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableCell
                    key={key}
                    align="center"
                    sx={{ backgroundColor: '#f0f0f0' }}
                  >
                    <FormControl
                      variant="outlined"
                      sx={{ minWidth: 120, marginTop: 1 }}
                    >
                      <InputLabel id={`dataType-label-${key}`}></InputLabel>
                      <Select
                        labelId={`dataType-label-${key}`}
                        value={dataTypes[key]}
                        onChange={(e) =>
                          handleDataTypeChange(key, e.target.value)
                        }
                      >
                        <MenuItem value="Numeric">Numeric</MenuItem>
                        <MenuItem value="Categoric">Categoric</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="body1" sx={{ margin: '20px 0 0 0' }}>
                      {key}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, idx) => (
                    <TableCell key={idx} align="center">
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={handleSave}
          >
            저장하기
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExcelDataModal;
