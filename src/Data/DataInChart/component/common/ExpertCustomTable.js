import { useRef, useEffect, useState } from 'react';
import { useGraphDataStore } from '../../store/graphStore';
import { AiOutlineDelete } from 'react-icons/ai';
import html2canvas from 'html2canvas';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { saveCustomTableApi } from '../../../apis/tables';
import { customAxios } from '../../../../Common/CustomAxios';
import TitleInputModal from '../../modal/TitleInputModal';
import table from '../../../../assets/img/table.jpg';
import graph from '../../../../assets/img/graph.jpg';

function ExpertCustomTable({ onAddPhoto, setSummary, isDrawGraph }) {
  const { data, title, setData, variables } = useGraphDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false); // 모달 열기/닫기 상태
  const [photoTitle, setPhotoTitle] = useState(''); // 사진 제목 상태
  const [capturedImage, setCapturedImage] = useState(null); // 캡처된 이미지 상태
  const tableRef = useRef(null); // 테이블을 캡처하기 위한 ref 생성

  const [modificationData, setModificationData] = useState([]);
  const [modeificationHeaders, setModeificationHeaders] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setModificationData(data.map((value) => [...value]));
      setModeificationHeaders(data[0]);
    }

    // data가 없는 경우 DataInChartMainPage를 렌더링
    // if (!data || data.length === 0) {
    //   return <DataInChartPage />;
    // }
  }, [data]);

  useEffect(() => {
    if (modificationData.length > 0) {
      setModeificationHeaders(modificationData[0]);
    }
  }, [modificationData]);

  const headers = data && data.length > 0 ? data[0] : [];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setData(modificationData, title + ' 수정본');
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setModificationData(data.map((value) => [...value]));
  };

  const handleMoveColumnLeft = (headerIndex) => {
    if (headerIndex === 1) {
      alert('더 이상 이동할 수 없습니다.');
      return;
    }

    setModificationData((prev) => {
      const updatedData = prev.map((row) => {
        const newRow = [...row];
        [newRow[headerIndex - 2], newRow[headerIndex - 1]] = [
          newRow[headerIndex - 1],
          newRow[headerIndex - 2],
        ];
        return newRow;
      });
      return updatedData;
    });
  };

  const handleMoveColumnRight = (headerIndex) => {
    if (headerIndex === headers.length) {
      alert('더 이상 이동할 수 없습니다.');
      return;
    }

    setModificationData((prev) => {
      const updatedData = prev.map((row) => {
        const newRow = [...row];
        [newRow[headerIndex], newRow[headerIndex - 1]] = [
          newRow[headerIndex - 1],
          newRow[headerIndex],
        ];
        return newRow;
      });
      return updatedData;
    });
  };

  const handleDeleteColumn = (headerIndex) => {
    setModificationData((prev) => {
      const updatedData = prev.map((row) => {
        const newRow = [...row];
        newRow.splice(headerIndex - 1, 1); // headerIndex번째 열 삭제
        return newRow;
      });
      return updatedData;
    });
  };

  const saveCustomTable = async () => {
    setModalOpen(true);
  };
  // 테이블을 캡처하고 모달을 여는 함수
  const handleCaptureTable = async () => {
    if (tableRef.current) {
      const tableElement = tableRef.current;

      // 테이블의 크기를 동적으로 측정
      const tableWidth = tableElement.scrollWidth;
      const tableHeight = tableElement.scrollHeight;

      // html2canvas로 캡처할 때 크기 설정
      const canvas = await html2canvas(tableElement, {
        width: tableWidth, // 테이블의 전체 너비
        height: tableHeight, // 테이블의 전체 높이
        windowWidth: tableWidth, // 캡처할 영역의 너비
        windowHeight: tableHeight, // 캡처할 영역의 높이
      });

      // 캡처한 데이터를 이미지로 변환
      const imgData = canvas.toDataURL('image/png');
      setCapturedImage(imgData); // 캡처된 이미지를 상태에 저장
      setOpenModal(true); // 모달 열기
    }
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    setOpenModal(false);
    setPhotoTitle(''); // 모달을 닫을 때 입력 필드 초기화
  };

  // 사진 제목 추가 핸들러
  const handleAddPhoto = () => {
    if (photoTitle.trim()) {
      const newPhoto = {
        title: photoTitle,
        image: capturedImage,
      };
      onAddPhoto(newPhoto); // 상위 컴포넌트로 객체 하나만 전달
      handleClose(); // 모달 닫기
    }
  };

  const [tableTitle, setTableTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  if (data.length === 0)
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f5f5f5',
          height: '100vh',
        }}
      >
        <h1
          style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}
        >
          Data & Chart에 오신 것을 환영합니다!
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#555',
            textAlign: 'center',
            maxWidth: '600px',
            marginBottom: '0px',
          }}
        >
          차트 생성을 시작하려면 왼쪽 테이블 선택 리스트에서 시각화할 데이터를
          선택하세요.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginTop: '30px',
          }}
        >
          {/* 이미지와 설명이 들어가는 부분 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              width: '90%',
              gap: '20px',
            }}
          >
            {/* 1번 이미지와 설명 */}
            <div style={{ textAlign: 'center', width: '45%' }}>
              <img
                src={table}
                alt="테이블 조작 화면"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  marginBottom: '10px',
                }}
              />
              <h3
                style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}
              >
                테이블 조작 화면
              </h3>
              <p style={{ fontSize: '14px', color: '#555' }}>
                데이터 테이블을 자유롭게 조작하여 시각화에 사용할 데이터를
                선택하세요.
              </p>
            </div>

            {/* 2번 이미지와 설명 */}
            <div style={{ textAlign: 'center', width: '45%' }}>
              <img
                src={graph}
                alt="그래프 그린 화면"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  marginBottom: '10px',
                }}
              />
              <h3
                style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}
              >
                그래프 생성 화면
              </h3>
              <p style={{ fontSize: '14px', color: '#555' }}>
                선택한 데이터를 바탕으로 다양한 차트를 생성하고 분석해보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  if (!isEditing)
    return (
      <div>
        <TitleInputModal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          title={tableTitle}
          setTitle={setTableTitle}
          setSummary={setSummary}
        />
        <table
          ref={tableRef}
          style={{
            width: '100%',
            border: '1px solid rgba(34, 36, 38, 0.15)',
            borderCollapse: 'collapse',
            borderRadius: '8px',
            captionSide: 'top',
          }}
        >
          <caption
            style={{
              fontSize: '24px',
              fontWeight: '600',
              padding: '10px',
              textAlign: 'center',
              color: 'black',
            }}
          >
            {title}

            <button
              onClick={handleEdit}
              style={{
                marginLeft: '15px',
                backgroundColor: '#4a4a4a',
                color: 'white',
                borderRadius: '5px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
            >
              수정하기
            </button>
            <button
              onClick={saveCustomTable}
              style={{
                marginLeft: '15px',
                backgroundColor: '#4a4a4a',
                color: 'white',
                borderRadius: '5px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
            >
              저장하기
            </button>
            {isDrawGraph && (
              <button
                style={{
                  marginLeft: '15px',
                  backgroundColor: '#4a4a4a',
                  color: 'white',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = '#3b3b3b')
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
                onClick={handleCaptureTable} // 테이블 캡처 버튼
              >
                테이블 캡쳐
              </button>
            )}
          </caption>
          <thead>
            <tr>
              {['', ...headers].map((header, headerIndex) => (
                <th
                  key={headerIndex}
                  style={{
                    border: '1px solid rgba(34, 36, 38, 0.15)',
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '18px',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {[rowIndex, ...row].map((value, valueIndex) => (
                  <td
                    key={valueIndex}
                    style={{
                      border: '1px solid rgba(34, 36, 38, 0.15)',
                      textAlign: 'center',
                      padding: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{value}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 모달 */}
        <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>캡쳐된 테이블</DialogTitle>
          <DialogContent dividers>
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured Table"
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            )}

            {/* 사진 제목 입력 필드 */}
            <TextField
              fullWidth
              label="사진 제목"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              닫기
            </Button>
            <Button
              onClick={handleAddPhoto}
              color="primary"
              variant="contained"
            >
              사진 추가
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

  return (
    <div>
      <table
        ref={tableRef}
        style={{
          width: '100%',
          border: '1px solid rgba(34, 36, 38, 0.15)',
          borderCollapse: 'collapse',
          borderRadius: '8px',
        }}
      >
        <caption
          style={{
            fontSize: '24px',
            fontWeight: '600',
            padding: '10px',
            textAlign: 'center',
            color: 'black',
          }}
        >
          {title}
          <button
            onClick={handleEditComplete}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '16px',
              marginLeft: '1rem',
              backgroundColor: '#4a4a4a',
              color: 'white',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
          >
            완료
          </button>
          <button
            onClick={handleEditCancel}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '16px',
              marginLeft: '1rem',
              backgroundColor: '#4a4a4a',
              color: 'white',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
          >
            취소
          </button>
        </caption>
        <thead>
          <tr>
            {['', ...modeificationHeaders].map((header, headerIndex) => {
              if (headerIndex !== 0)
                return (
                  <th
                    key={headerIndex}
                    style={{
                      border: '1px solid rgba(34, 36, 38, 0.15)',
                      boxShadow: '0 8px 5px -5px rgba(0,0,0,0.3)',
                      zIndex: 30,
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{header}</span>

                      <button
                        onClick={() => handleDeleteColumn(headerIndex)}
                        style={{
                          marginLeft: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          color: '#4a4a4a',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          border: 'none',
                          outline: 'none',
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = '#e0e0e0')
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = '#f5f5f5')
                        }
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleMoveColumnLeft(headerIndex)}
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem',
                        color: '#4a4a4a',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = '#e0e0e0')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = '#f5f5f5')
                      }
                    >
                      ◀
                    </button>

                    <button
                      onClick={() => handleMoveColumnRight(headerIndex)}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem',
                        color: '#4a4a4a',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = '#e0e0e0')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = '#f5f5f5')
                      }
                    >
                      ▶
                    </button>
                  </th>
                );
              else
                return (
                  <th
                    key={headerIndex}
                    style={{
                      border: '1px solid rgba(34, 36, 38, 0.15)',
                      boxShadow: '0 8px 5px -5px rgba(0,0,0,0.3)',
                      zIndex: 30,
                      padding: '0.75rem 0.5rem',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{header}</span>
                    </div>
                  </th>
                );
            })}
          </tr>
        </thead>
        <tbody>
          {modificationData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {[rowIndex, ...row].map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  style={{
                    border: '1px solid rgba(34, 36, 38, 0.15)',
                    textAlign: 'center',
                    padding: '0.5rem',
                  }}
                >
                  {valueIndex === 0 ? (
                    <span style={{ fontSize: '1rem' }}>{value}</span>
                  ) : (
                    <input
                      type="text"
                      value={value}
                      placeholder="Enter text"
                      onChange={(e) => {
                        setModificationData((prev) => {
                          const copiedModificationData = prev.map((value) => [
                            ...value,
                          ]);
                          copiedModificationData[rowIndex + 1][valueIndex - 1] =
                            e.target.value;
                          return copiedModificationData;
                        });
                      }}
                      style={{
                        fontSize: '1rem',
                        textAlign: 'center',
                        border: '1px solid transparent',
                        borderRadius: '0.375rem',
                        padding: '0.25rem',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                        width: 'auto',
                      }}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpertCustomTable;
