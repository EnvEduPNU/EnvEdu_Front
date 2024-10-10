import React, { useEffect, useState } from 'react';
import { IconButton, Modal, Box, Typography } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note'; // 메모 아이콘
import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘
import { customAxios } from '../../Common/CustomAxios'; // 삭제 요청을 보내기 위한 axios import

const MyDataSummaryTable = ({ summary, getTable }) => {
  const [open, setOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState('');

  useEffect(() => {
    console.log('summary 확인 : ' + JSON.stringify(summary, null, 2));
  }, []);

  // 모달 열기
  const handleOpen = (memo) => {
    setSelectedMemo(memo);
    setOpen(true);
  };

  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
    setSelectedMemo('');
  };

  // 삭제 요청 메서드
  const handleDelete = (id) => {
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      customAxios
        .delete(`/api/data/${id}`) // 실제 API 엔드포인트와 함께 사용
        .then((response) => {
          alert('데이터가 성공적으로 삭제되었습니다.');
          window.location.reload(); // 삭제 후 페이지 새로고침
        })
        .catch((error) => {
          console.error('삭제 중 오류가 발생했습니다:', error);
          alert('데이터 삭제에 실패했습니다.');
        });
    }
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
              <th scope="col" key="saveDate" style={{ width: '60%' }}>
                저장일
              </th>
              <th scope="col" key="dataLabel" style={{ width: '30%' }}>
                데이터 종류
              </th>
              <th scope="col" key="memo" style={{ width: '5%' }}>
                메모
              </th>
              <th scope="col" key="actions" style={{ width: '5%' }}></th>
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
                <td>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // 행 클릭 이벤트와 분리
                      handleDelete(item.id);
                    }}
                    aria-label="delete item"
                  >
                    <DeleteIcon color="error" />
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
