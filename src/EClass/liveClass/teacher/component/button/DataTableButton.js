import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';

import '../TeacherWordProcessor.scss';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  zIndex: 1300,
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

export default function DataTableButton({ summary, onSelectData }) {
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({ type: null, id: null });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectData = (type, id) => {
    setSelectedData({ type, id });
    onSelectData(type, id);
    handleClose();
  };

  useEffect(() => {
    console.log('summary 체크 : ' + JSON.stringify(summary, null, 2));
  }, []);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className="yellow-btn" // yellow-btn 클래스 적용
        onClick={handleOpen}
        sx={{ margin: '20px 10px 0 0', width: '10rem' }}
      >
        데이터 추가하기
      </Button>
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
            데이터 요약
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
                      handleSelectData(item.dataLabel, item.dataUUID)
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
