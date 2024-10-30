import React, { useEffect, useState } from 'react';
import { IconButton, Modal, Box, Typography } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import DeleteIcon from '@mui/icons-material/Delete';
import { customAxios } from '../../Common/CustomAxios';
import CombinedFilter from './CombinedFilter';

const MyDataSummaryTable = ({ summary, getTable }) => {
  const [open, setOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState('');
  const [filteredData, setFilteredData] = useState(summary);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(''); // 선택된 데이터 종류
  const [showFilter, setShowFilter] = useState(false); // 필터 드롭다운 상태 관리

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
  const handleDelete = async (id, type) => {
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      let deleteUrl = '';

      if (type === '커스텀 데이터') {
        // 커스텀 데이터일 경우
        deleteUrl = `/api/custom/${id}`;

        console.log('커스텀데이터로 설정');
      } else {
        // 일반 데이터일 경우
        deleteUrl = `/api/data/${id}`;
      }

      await customAxios
        .delete(deleteUrl)
        .then((response) => {
          alert('데이터가 성공적으로 삭제되었습니다.');
          window.location.reload();
        })
        .catch((error) => {
          console.error('삭제 중 오류가 발생했습니다:', error);
          alert('데이터 삭제에 실패했습니다.');
        });
    }
  };

  // 저장일 및 데이터 종류에 따른 필터링
  const filterData = () => {
    let filtered = summary;

    // 날짜 범위 필터링
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const saveDate = new Date(item.saveDate);
        return saveDate >= new Date(startDate) && saveDate <= new Date(endDate);
      });
    }

    // 데이터 종류 필터링
    if (selectedLabel) {
      filtered = filtered.filter((item) => item.dataLabel === selectedLabel);
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [summary]);

  // 필터 적용 후 드롭다운 닫기
  const applyFilter = () => {
    filterData();
    setShowFilter(false); // 드롭다운 닫기
  };

  // 전체보기 (필터 초기화)
  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    setSelectedLabel('');
    setFilteredData(summary); // 전체 데이터 다시 표시
  };

  // 중복되지 않는 데이터 종류 추출
  const uniqueDataLabels = Array.from(
    new Set(summary.map((item) => item.dataLabel)),
  );

  return (
    <article
      style={{
        padding: '20px',
        marginTop: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#fff',
      }}
      aria-labelledby="myData-summary-heading"
    >
      <header>
        <h2
          id="myData-summary-heading"
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#f0ad4e',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bolder',
          }}
        >
          My Data
        </h2>
      </header>

      {/* 필터 버튼 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => setShowFilter(!showFilter)} // 필터 드롭다운 토글
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          필터
        </button>
        <button
          onClick={resetFilter} // 필터 초기화
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          전체보기
        </button>
      </div>

      {/* 필터 드롭다운 */}
      {showFilter && (
        <CombinedFilter
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          dataLabels={uniqueDataLabels}
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          applyFilter={applyFilter}
        />
      )}

      {/* 테이블을 감싸는 div에 고정 높이와 스크롤 설정 */}
      <div style={{ height: '450px', overflowY: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
          role="grid"
          aria-label="My Data Summary Table"
        >
          <thead>
            <tr>
              <th
                scope="col"
                key="saveDate"
                style={{
                  width: '20%',
                  padding: '10px',
                  textAlign: 'left',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #ddd',
                  position: 'sticky',
                  top: '0',
                  zIndex: 1,
                }}
              >
                저장일
              </th>
              <th
                scope="col"
                key="title"
                style={{
                  width: '20%',
                  padding: '10px',
                  textAlign: 'left',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #ddd',
                  position: 'sticky',
                  top: '0',
                  zIndex: 1,
                }}
              >
                제목
              </th>
              <th
                scope="col"
                key="dataLabel"
                style={{
                  width: '20%',
                  padding: '10px',
                  textAlign: 'left',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #ddd',
                  position: 'sticky',
                  top: '0',
                  zIndex: 1,
                }}
              >
                데이터 종류
              </th>
              <th
                scope="col"
                key="memo"
                style={{
                  width: '10%',
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #ddd',
                  position: 'sticky',
                  top: '0',
                  zIndex: 1,
                }}
              >
                메모
              </th>
              <th
                scope="col"
                key="actions"
                style={{
                  width: '10%',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #ddd',
                  position: 'sticky',
                  top: '0',
                  zIndex: 1,
                }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item.dataUUID || index}
                onClick={() => getTable(item.dataLabel, item.dataUUID)}
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd',
                  transition: 'background-color 0.3s ease', // 부드러운 배경색 전환
                }}
                tabIndex={0}
                aria-label={`Row ${index + 1}, click to view details`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'; // hover 시 배경색
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'; // hover 해제 시 배경색 원상 복귀
                }}
              >
                <td
                  style={{
                    padding: '10px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  {item.saveDate}
                </td>
                <td
                  style={{
                    padding: '10px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  {item.title}
                </td>
                <td
                  style={{
                    padding: '10px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  {item.dataLabel}
                </td>
                <td
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen(item.memo);
                    }}
                    aria-label="view memo"
                  >
                    <NoteIcon />
                  </IconButton>
                </td>
                <td
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.dataLabel === '커스텀 데이터') {
                        handleDelete(item.dataUUID, item.dataLabel);
                        // console.log(
                        //   '삭제 객체 확인 : ' + JSON.stringify(item, null, 2),
                        // );
                      } else {
                        // handleDelete(item.id);
                      }
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
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
              }}
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
