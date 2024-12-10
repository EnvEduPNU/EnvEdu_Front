import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, Paper } from '@mui/material';
import { BiTable } from 'react-icons/bi';
import { BsFileBarGraphFill } from 'react-icons/bs';

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
            width: '45px',
            height: '45px',
            backgroundColor: '#FF9800',
            color: '#FFFFFF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            transition: 'transform 0.2s ease',
          }}
          onMouseOver={(e) => {
            if (e.target === e.currentTarget) {
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          onMouseOut={(e) => {
            if (e.target === e.currentTarget) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <BsFileBarGraphFill size="24px" />
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
          width: '45px',
          height: '45px',
          backgroundColor: '#FF9800',
          color: '#FFFFFF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: 'none',
          transition: 'transform 0.2s ease',
        }}
        onMouseOver={(e) => {
          if (e.target === e.currentTarget) {
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseOut={(e) => {
          if (e.target === e.currentTarget) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        <BiTable size="24px" />
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
