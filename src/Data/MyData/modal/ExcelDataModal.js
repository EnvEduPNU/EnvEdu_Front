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

const ExcelDataModal = ({ open, handleClose, data }) => {
  const [dataTypes, setDataTypes] = useState(
    Object.keys(data[0]).reduce((acc, key, index) => {
      acc[key] = 'Categoric'; // 기본값은 Categorical로 설정
      return acc;
    }, {}),
  );

  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [editedRowIndex, setEditedRowIndex] = useState(null); // 어떤 행을 편집하는지 추적
  const [originalValue, setOriginalValue] = useState(''); // 원래 값 저장

  // 데이터 타입 변경 핸들러
  const handleDataTypeChange = (key, value) => {
    if (value === 'Numeric') {
      for (const row of data) {
        if (isNaN(row[key])) {
          alert(
            `"${key}" 열의 값 중 비숫자 값이 존재합니다. "${row[key]}"는 유효하지 않습니다.`,
          );
          return; // 유효하지 않은 값이 있는 경우 변경을 거부
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
    setOriginalValue(value); // 현재 값을 원래 값으로 저장
    setEditedValue(value); // 현재 값을 편집 필드에 설정
    setEditedRowIndex(rowIndex); // 편집 중인 행의 인덱스를 설정
  };

  // 수정된 값 저장
  const handleValueChange = (e) => {
    setEditedValue(e.target.value);
  };

  // 수정 완료
  const handleCellSave = (key) => {
    if (dataTypes[key] === 'Numeric' && isNaN(editedValue)) {
      alert(`"${key}" 열에 비숫자 값이 존재합니다.`);
      data[editedRowIndex][key] = originalValue; // 원래 값으로 되돌리기
      return; // 숫자 형식이 아닌 값이 있는 경우 종료
    }

    // 기존 데이터 수정
    data[editedRowIndex][key] = editedValue; // 수정된 값으로 업데이트
    setEditingCell(null); // 편집 모드 종료
    setEditedRowIndex(null); // 편집 중인 행 인덱스 초기화
  };

  // 저장하기 버튼 클릭 시 실행되는 함수
  const handleSave = async () => {
    const numericFieldsList = [];
    const stringFieldsList = [];

    // 각 열의 순서를 기록할 index
    let columnIndex = 0;

    console.log('엑셀 데이터 확인 : ' + JSON.stringify(data.null, 2));

    data.forEach((row) => {
      const numericFields = {};
      const stringFields = {};

      for (const key in row) {
        // 고정된 필드는 처리하지 않고 동적 필드만 처리
        if (
          key !== 'dataUUID' &&
          key !== 'saveDate' &&
          key !== 'memo' &&
          key !== 'dataLabel' &&
          key !== 'userName'
        ) {
          // 헤더에서 설정한 데이터 타입에 따라 저장할 필드 분리
          if (dataTypes[key] === 'Numeric') {
            // Numeric으로 설정된 필드는 숫자로 변환하여 numericFields에 저장
            numericFields[key] = {
              value: Number(row[key]), // 실제 값
              order: columnIndex, // 순서
            };
          } else {
            // Categoric으로 설정된 필드는 문자열로 변환하여 stringFields에 저장
            stringFields[key] = {
              value: String(row[key]), // 실제 값
              order: columnIndex, // 순서
            };
          }
          columnIndex += 1; // 순서를 증가시킴
        }
      }

      // 각 행의 필드를 List에 추가
      if (Object.keys(numericFields).length > 0) {
        numericFieldsList.push(numericFields);
      }
      if (Object.keys(stringFields).length > 0) {
        stringFieldsList.push(stringFields);
      }
    });

    const jsonData = {
      dataUUID: uuidv4(), // UUID 생성
      saveDate: new Date().toISOString(), // 현재 날짜
      memo: null, // 메모 기본값 null
      dataLabel: 'CUSTOM', // 기본 데이터 라벨
      userName: localStorage.getItem('username'),
      numericFields: numericFieldsList, // 모든 row의 numericFields를 담은 리스트
      stringFields: stringFieldsList, // 모든 row의 stringFields를 담은 리스트
    };
    console.log('저장 요청할 데이터:', JSON.stringify(jsonData, null, 2));

    try {
      // Axios 요청 - API 엔드포인트를 적절히 수정하세요
      const response = await customAxios.post('/api/custom/save', jsonData);

      console.log('데이터가 성공적으로 저장되었습니다:', response.data);

      // handleClose(); // 모달 닫기
      // alert('저장완료!');
      // window.location.reload();
    } catch (error) {
      console.error('데이터 저장 중 오류 발생:', error);
      // 추가적인 에러 처리가 필요한 경우 여기에 작성
    }
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
                {Object.keys(data[0]).map((key, index) => (
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
                      {/* 필드 순서 표시 */}
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
                      onClick={() => handleCellClick(key, row[key], rowIndex)} // 클릭 시 편집 모드로 전환
                    >
                      {editingCell === key && editedRowIndex === rowIndex ? (
                        <TextField
                          value={editedValue}
                          onChange={handleValueChange}
                          onBlur={() => handleCellSave(key)} // 블러 시 저장
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCellSave(key); // 엔터키로 저장
                            }
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
