import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, Paper } from '@mui/material';

import '../TeacherWordProcessor.scss';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
  overflowY: 'auto', // 세로 스크롤 활성화
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  '& th': {
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ccc',
    padding: '8px',
  },
  '& td': {
    borderBottom: '1px solid #ccc',
    padding: '8px',
  },
  '& tbody tr:hover': {
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
  },
};

export default function DataTableButton({ summary, onSelectData, type }) {
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({ type: null, id: null });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectData = (type, id, type2) => {
    setSelectedData({ type, id });
    onSelectData(type, id, type2);
    handleClose();
  };

  useEffect(() => {
    console.log('summary 체크 : ' + JSON.stringify(summary, null, 2));
  }, []);

  if (type === 'graph')
    return (
      <>
        <button
          onClick={handleOpen}
          style={{
            width: '160px',
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50', // 새로운 색상 (초록)
            color: '#FFFFFF',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            outline: 'none',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#66BB6A'; // 마우스 오버 시 밝은 초록색
            e.target.style.transform = 'scale(1.05)'; // 확대 효과
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#4CAF50'; // 기본 초록색
            e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
          }}
        >
          그래프 그리기 추가
        </button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="summary-table-modal-title"
          aria-describedby="summary-table-modal-description"
          sx={{ zIndex: 1300 }}
        >
          <Box sx={modalStyle}>
            <Typography
              id="summary-table-modal-title"
              variant="h6"
              component="h2"
            >
              그래프 데이터 목록
            </Typography>
            <Paper sx={{ marginTop: 2, overflowX: 'auto' }}>
              <Box component="table" className="summary-table" sx={tableStyle}>
                <thead>
                  <tr>
                    <th key="saveDate">저장 일시</th>
                    <th key="dataLabel">데이터 종류</th>
                    <th key="memo">메모</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        handleSelectData(item.dataLabel, item.dataUUID, 'graph')
                      }
                    >
                      <td>{item.saveDate}</td>
                      <td>{item.dataLabel}</td>
                      <td>{item.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Paper>
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              sx={{ marginTop: 2 }}
            >
              닫기
            </Button>
          </Box>
        </Modal>
      </>
    );
  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          width: '160px',
          padding: '0.5rem 1rem',
          backgroundColor: '#4CAF50', // 새로운 색상 (초록)
          color: '#FFFFFF',
          borderRadius: '0.5rem',
          fontWeight: '600',
          fontSize: '1rem',
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
          outline: 'none',
          marginRight: '10px',
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#66BB6A'; // 마우스 오버 시 밝은 초록색
          e.target.style.transform = 'scale(1.05)'; // 확대 효과
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#4CAF50'; // 기본 초록색
          e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
        }}
      >
        테이블 추가
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="summary-table-modal-title"
        aria-describedby="summary-table-modal-description"
        sx={{ zIndex: 1300 }}
      >
        <Box sx={modalStyle}>
          <Typography
            id="summary-table-modal-title"
            variant="h6"
            component="h2"
          >
            테이블 데이터 목록
          </Typography>
          <Paper sx={{ marginTop: 2, overflowX: 'auto' }}>
            <Box component="table" className="summary-table" sx={tableStyle}>
              <thead>
                <tr>
                  <th key="saveDate">저장 일시</th>
                  <th key="dataLabel">데이터 종류</th>
                  <th key="memo">메모</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      handleSelectData(item.dataLabel, item.dataUUID, 'table')
                    }
                  >
                    <td>{item.saveDate}</td>
                    <td>{item.dataLabel}</td>
                    <td>{item.memo}</td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Paper>
          <Button
            onClick={handleClose}
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2 }}
          >
            닫기
          </Button>
        </Box>
      </Modal>
    </>
  );
}
