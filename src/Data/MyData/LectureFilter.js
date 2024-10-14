import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  TextField,
} from '@mui/material';

const LectureFilter = ({
  dataTypeOptions,
  gradeOptions,
  selectedDataType,
  selectedGrade,
  selectedSubject,
  setSelectedDataType,
  setSelectedGrade,
  setSelectedSubject,
  applyFilter,
  resetFilter,
  setShowFilter,
}) => {
  return (
    <Box
      sx={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
    >
      {/* Data Type Filter */}
      <FormControl sx={{ minWidth: 120, marginRight: '10px' }}>
        <InputLabel id="dataType-label"></InputLabel>
        <Select
          labelId="dataType-label"
          value={selectedDataType || 'All'} // 선택 값이 없을 경우 "All"을 표시
          onChange={(e) => setSelectedDataType(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {dataTypeOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Grade Filter */}
      <FormControl sx={{ minWidth: 120, marginRight: '10px' }}>
        <InputLabel id="grade-label"></InputLabel>
        <Select
          labelId="grade-label"
          value={selectedGrade || 'All'} // 선택 값이 없을 경우 "All"을 표시
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {gradeOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Subject Filter */}
      <TextField
        label=""
        variant="outlined"
        value={selectedSubject} // 현재 입력된 텍스트
        onChange={(e) => setSelectedSubject(e.target.value)} // 입력값 변경 시 업데이트
        sx={{ marginRight: '10px', minWidth: 120 }}
      />

      {/* 필터 적용 버튼 */}
      <Button
        variant="contained"
        onClick={() => {
          applyFilter();
        }}
        sx={{ marginRight: '10px' }}
      >
        적용
      </Button>

      {/* 필터 초기화 버튼 */}
      <Button variant="outlined" onClick={resetFilter}>
        초기화
      </Button>
    </Box>
  );
};

export default LectureFilter;
