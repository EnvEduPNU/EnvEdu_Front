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
  TextField,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리에서 v4 임포트
import { customAxios } from '../../../Common/CustomAxios'; // Axios import

const ExcelDataModal = ({ open, handleClose, data, eclassFlag }) => {
  const [dataTypes, setDataTypes] = useState(
    Object.keys(data[0]).reduce((acc, key, index) => {
      acc[key] = 'Categoric';
      return acc;
    }, {}),
  );

  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [originalValue, setOriginalValue] = useState('');
  const [title, setTitle] = useState(''); // title 상태 추가
  const [memo, setMemo] = useState(''); // memo 상태 추가
  const [showSaveForm, setShowSaveForm] = useState(false); // 저장 폼 표시 여부

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (key, value) => {
    if (value === 'Numeric') {
      for (const row of data) {
        if (isNaN(row[key])) {
          alert(
            `"${key}" 열의 값 중 비숫자 값이 존재합니다. "${row[key]}"는 유효하지 않습니다.`,
          );
          return;
        }
      }
    }
    setDataTypes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 셀 클릭 시 편집 상태로 전환
  const handleCellClick = (key, value, rowIndex) => {
    setEditingCell(key);
    setOriginalValue(value);
    setEditedValue(value);
    setEditedRowIndex(rowIndex);
  };

  const handleValueChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleCellSave = (key) => {
    if (dataTypes[key] === 'Numeric' && isNaN(editedValue)) {
      alert(`"${key}" 열에 비숫자 값이 존재합니다.`);
      data[editedRowIndex][key] = originalValue;
      return;
    }
    data[editedRowIndex][key] = editedValue;
    setEditingCell(null);
    setEditedRowIndex(null);
  };

  const handleSaveClick = () => {
    setShowSaveForm(true); // 저장 폼 표시
  };

  const handleFinalSave = async () => {
    const numericFieldsList = [];
    const stringFieldsList = [];
    let columnIndex = 0;

    data.forEach((row) => {
      for (const key in row) {
        if (
          key !== 'dataUUID' &&
          key !== 'saveDate' &&
          key !== 'memo' &&
          key !== 'dataLabel' &&
          key !== 'userName'
        ) {
          if (dataTypes[key] === 'Numeric') {
            numericFieldsList.push({
              [key]: {
                value: Number(row[key]),
                order: columnIndex,
              },
            });
          } else {
            stringFieldsList.push({
              [key]: {
                value: String(row[key]),
                order: columnIndex,
              },
            });
          }
          columnIndex += 1;
        }
      }
    });

    const jsonData = {
      dataUUID: uuidv4(),
      saveDate: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      title: title || '',
      memo, // memo 상태값 추가
      dataLabel: 'CUSTOM', // title 상태값 추가
      userName: localStorage.getItem('username'),
      numericFields: numericFieldsList,
      stringFields: stringFieldsList,
    };

    try {
      const response = await customAxios.post('/api/custom/save', jsonData);
      console.log('데이터가 성공적으로 저장되었습니다:', response.data);
      alert('데이터가 저장되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
      alert('데이터 저장 오류!');
    }

    setShowSaveForm(false); // 저장 폼 닫기
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
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                      {key}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((key) => (
                    <TableCell
                      key={key}
                      align="center"
                      onClick={() => handleCellClick(key, row[key], rowIndex)}
                    >
                      {editingCell === key && editedRowIndex === rowIndex ? (
                        <TextField
                          value={editedValue}
                          onChange={handleValueChange}
                          onBlur={() => handleCellSave(key)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellSave(key);
                          }}
                          autoFocus
                        />
                      ) : (
                        row[key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {showSaveForm && (
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Memo"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={showSaveForm ? handleFinalSave : handleSaveClick}
          >
            {showSaveForm
              ? '저장'
              : eclassFlag
              ? '저장 및 테이블 설정'
              : '저장하기'}
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
