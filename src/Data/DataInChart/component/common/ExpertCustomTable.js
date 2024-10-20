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

          setSummary(formattedData);
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
  if (!isEditing)
    return (
      <div>
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
              onClick={handleCaptureTable}
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
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    {value}
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
              marginLeft: '15px',
              backgroundColor: '#4a5568',
              color: 'white',
              borderRadius: '5px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            완료
          </button>
          <button
            onClick={handleEditCancel}
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
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '18px',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {header}
                  <button
                    onClick={() => handleDeleteColumn(headerIndex)}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: '#e2e8f0',
                      color: '#1a202c',
                      borderRadius: '5px',
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleMoveColumnLeft(headerIndex)}
                  style={{
                    position: 'absolute',
                    left: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '5px',
                    padding: '4px',
                    cursor: 'pointer',
                  }}
                >
                  ◀
                </button>
                <button
                  onClick={() => handleMoveColumnRight(headerIndex)}
                  style={{
                    position: 'absolute',
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '5px',
                    padding: '4px',
                    cursor: 'pointer',
                  }}
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
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  <input
                    type="text"
                    value={value}
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
                      textAlign: 'center',
                      border: '1px solid #e2e8f0',
                      borderRadius: '5px',
                      padding: '4px',
                      backgroundColor: '#f7fafc',
                    }}
                  />
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
