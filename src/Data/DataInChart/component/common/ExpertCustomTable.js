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
import html2canvas from 'html2canvas';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

function ExpertCustomTable({ onAddPhoto, setSummary }) {
  const { data, title, setData, variables } = useGraphDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false); // 모달 열기/닫기 상태
  const [photoTitle, setPhotoTitle] = useState(''); // 사진 제목 상태
  const [capturedImage, setCapturedImage] = useState(null); // 캡처된 이미지 상태
  const tableRef = useRef(null); // 테이블을 캡처하기 위한 ref 생성

  const [modificationData, setModificationData] = useState([]);
  const [modeificationHeaders, setModeificationHeaders] = useState([]);

  useEffect(() => {
    setModificationData(data.map((value) => [...value]));
    setModeificationHeaders(data[0]);
  }, [data]);

  useEffect(() => {
    if (modificationData.length !== 0)
      setModeificationHeaders(modificationData[0]);
  }, [modificationData]);

  const headers = data[0];

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

  const saveCustomTable = async () => {
    try {
      const date = new Date();
      console.log(data);
      console.log(variables);

      const stringFields = [];
      const numericFields = [];
      let order = 0;
      for (let i = 1; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
          const value = data[i][j];
          if (variables[j].type === 'Categorical') {
            stringFields.push({
              [variables[j].name]: {
                value,
                order,
              },
            });
          } else {
            numericFields.push({
              [variables[j].name]: {
                value,
                order,
              },
            });
          }
          order++;
        }
      }

      const payload = {
        dataUUID: crypto.randomUUID(),
        saveDate: new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString(),
        memo: '메모',
        dataLabel: 'CUSTOM',
        userName: localStorage.getItem('username'),
        numericFields,
        stringFields,
      };

      const response = await saveCustomTableApi(payload);

      await customAxios
        .get('/mydata/list')
        .then((res) => {
          console.log('My Data list : ' + JSON.stringify(res.data, null, 2));

          const formattedData = res.data.map((data) => ({
            ...data,
            saveDate: data.saveDate.split('T')[0],
            dataLabel:
              data.dataLabel === 'AIRQUALITY'
                ? '대기질 데이터'
                : data.dataLabel === 'OCEANQUALITY'
                ? '수질 데이터'
                : data.dataLabel,
          }));

          setSummary((prev) => [...prev, formattedData]);
        })
        .catch((err) => console.log(err));

      await customAxios.get('/api/custom/list').then((res) => {
        console.log(res.data);
        const formattedData = res.data.map((table) => ({
          saveDate: table.saveDate.split('T')[0],
          dataLabel: 'CUSTOM',
          dataUUID: table.dataUUID,
          memo: table.memo,
        }));
        setSummary((prev) => [...prev, ...formattedData]);
      });
    } catch (e) {
      console.log(e);
    }
  };
  // 테이블을 캡처하고 모달을 여는 함수
  const handleCaptureTable = async () => {
    if (tableRef.current) {
      // html2canvas를 사용하여 테이블 영역을 캡처
      const canvas = await html2canvas(tableRef.current);
      const imgData = canvas.toDataURL('image/png'); // 캡처한 데이터를 이미지로 변환
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

  if (!isEditing)
    return (
      <div>
        <table
<<<<<<< HEAD
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
=======
          ref={tableRef} // 테이블을 캡처하기 위해 ref 연결
          className="w-full border-solid border-[1px] border-[rgba(34, 36, 38, 0.15)] rounded-xl caption-top border-collapse"
        >
          <caption className="text-2xl font-semibold py-2 text-center text-black">
>>>>>>> c44a297 ([update] DataInChart E-Class 통합 초기 개발 완료)
            {title}

            <button
              onClick={handleEdit}
              style={{
                marginLeft: '15px',
                backgroundColor: '#4a5568',
                color: 'white',
                borderRadius: '5px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              수정하기
            </button>

            <button
<<<<<<< HEAD
              onClick={handleCaptureTable}
=======
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
              className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              onClick={handleCaptureTable} // 테이블 캡처 버튼
            >
              테이블 캡쳐
            </button>
            <button
              onClick={saveCustomTable}
>>>>>>> c44a297 ([update] DataInChart E-Class 통합 초기 개발 완료)
              style={{
                marginLeft: '15px',
                backgroundColor: '#4a5568',
                color: 'white',
                borderRadius: '5px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
<<<<<<< HEAD
=======
              onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
              className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
>>>>>>> c44a297 ([update] DataInChart E-Class 통합 초기 개발 완료)
            >
              테이블 캡쳐
            </button>
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
<<<<<<< HEAD
=======
            {/* 사진 제목 입력 필드 */}
>>>>>>> c44a297 ([update] DataInChart E-Class 통합 초기 개발 완료)
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
        ref={tableRef} // 테이블을 캡처하기 위해 ref 연결
        className="w-full border-solid border-[1px] border-[rgba(34, 36, 38, 0.15)] rounded-xl caption-top border-collapse"
      >
        <caption className="text-2xl font-semibold py-2 text-center text-black">
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
            {['', ...modeificationHeaders].map((header, headerIndex) => (
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
                  <div className="inline-flex items-center space-x-2">
                    <span className="text-xl">{header}</span>

                    {/* 열 삭제 버튼 (휴지통 아이콘) */}
                    <button
                      className="ml-2 px-2 py-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      onClick={() => handleDeleteColumn(headerIndex)}
                    >
                      <AiOutlineDelete
                        size={16}
                        className="text-black font-bold"
                      />
                    </button>
                  </div>

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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={() => handleMoveColumnRight(headerIndex)}
                >
                  ▶
                </button>
              </th>
            ))}
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
