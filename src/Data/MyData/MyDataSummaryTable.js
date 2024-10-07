import React, { useState } from 'react';
import { IconButton, Modal, Box, Typography } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note'; // 메모 아이콘

const MyDataSummaryTable = ({ summary, getTable }) => {
  const [open, setOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState('');

  const handleOpen = (memo) => {
    setSelectedMemo(memo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMemo('');
  };

  return (
    <article
      className="myData-summary"
      aria-labelledby="myData-summary-heading"
    >
      <header>
        <h2
          id="myData-summary-heading"
          onClick={() => window.location.reload()}
          className="yellow-btn"
        >
          My Data
        </h2>
      </header>
      {/* 테이블을 감싸는 div에 고정 높이와 스크롤 설정 */}
      <div style={{ height: '500px', overflowY: 'auto' }}>
        <table
          className="summary-table"
          role="grid"
          aria-label="My Data Summary Table"
        >
          <thead>
            <tr>
              <th scope="col" key="saveDate">
                저장일
              </th>
              <th scope="col" key="dataLabel">
                데이터 종류
              </th>
              <th scope="col" key="memo">
                메모
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, index) => (
              <tr
                key={item.dataUUID || index}
                onClick={() => getTable(item.dataLabel, item.dataUUID)}
                tabIndex={0}
                aria-label={`Row ${index + 1}, click to view details`}
              >
                <td>{item.saveDate}</td>
                <td>{item.dataLabel}</td>
                <td>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // 행 클릭 이벤트와 분리
                      handleOpen(item.memo);
                    }}
                    aria-label="view memo"
                  >
                    <NoteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 컴포넌트 */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            메모 내용
          </Typography>
          <Typography sx={{ mt: 2 }}>{selectedMemo}</Typography>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <button
              onClick={handleClose}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              닫기
            </button>
          </Box>
        </Box>
      </Modal>
    </article>
  );
};

export default MyDataSummaryTable;
