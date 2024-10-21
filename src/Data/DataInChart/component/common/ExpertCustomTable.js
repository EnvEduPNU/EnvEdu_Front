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

function ExpertCustomTable({ onAddPhoto }) {
  const { data, title, setData } = useGraphDataStore();
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

  if (!isEditing)
    return (
      <div>
        <table
          ref={tableRef} // 테이블을 캡처하기 위해 ref 연결
          className="w-full border-solid border-[1px] border-[rgba(34, 36, 38, 0.15)] rounded-xl caption-top border-collapse"
        >
          <caption className="text-2xl font-semibold py-2 text-center text-black">
            {title}

            <button
              className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              onClick={handleEdit}
              style={{ fontSize: '16px' }}
            >
              수정하기
            </button>

            <button
              className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              onClick={handleCaptureTable} // 테이블 캡처 버튼
              style={{ fontSize: '16px' }}
            >
              테이블 캡쳐
            </button>
          </caption>
          <thead>
            <tr>
              {['', ...headers].map((header, headerIndex) => {
                return (
                  <th
                    className="border-[1px] border-[rgba(34, 36, 38, 0.15)]  shadow-[0_8px_5px_-5px_rgba(0,0,0,0.3)] z-30 leading-[20px] py-3 px-2 text-center"
                    key={headerIndex}
                  >
                    <span className="text-xl">{header}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {[rowIndex, ...row].map((value, valueIndex) => {
                  return (
                    <td
                      className="border-[1px] border-[rgba(34, 36, 38, 0.15)] text-center py-2"
                      key={valueIndex}
                    >
                      <span className="text-md">{value}</span>
                    </td>
                  );
                })}
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
        ref={tableRef} // 테이블을 캡처하기 위해 ref 연결
        className="w-full border-solid border-[1px] border-[rgba(34, 36, 38, 0.15)] rounded-xl caption-top border-collapse"
      >
        <caption className="text-2xl font-semibold py-2 text-center text-black">
          {title}
          <button
            className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            onClick={handleEditComplete}
            style={{ fontSize: '16px' }}
          >
            완료
          </button>
          <button
            className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            onClick={handleEditCancel}
            style={{ fontSize: '16px' }}
          >
            취소
          </button>
        </caption>
        <thead>
          <tr>
            {['', ...modeificationHeaders].map((header, headerIndex) => {
              if (headerIndex === 0)
                return (
                  <th
                    className="border-[1px] border-[rgba(34, 36, 38, 0.15)]  shadow-[0_8px_5px_-5px_rgba(0,0,0,0.3)] z-30 leading-[20px] py-3 px-2 text-center"
                    key={headerIndex}
                  >
                    <span className="text-xl">{header}</span>
                  </th>
                );
              return (
                <th
                  className="relative border-[1px] border-[rgba(34, 36, 38, 0.15)]  shadow-[0_8px_5px_-5px_rgba(0,0,0,0.3)] z-30 leading-[20px] py-3 px-2 text-center"
                  key={headerIndex}
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={() => handleMoveColumnLeft(headerIndex)}
                  >
                    ◀
                  </button>

                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={() => handleMoveColumnRight(headerIndex)}
                  >
                    ▶
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {modificationData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {[rowIndex, ...row].map((value, valueIndex) => {
                if (valueIndex === 0)
                  return (
                    <td
                      className="border-[1px] border-[rgba(34, 36, 38, 0.15)] text-center py-2"
                      key={valueIndex}
                    >
                      <span className="text-md">{value}</span>
                    </td>
                  );
                return (
                  <td
                    className="border-[1px] border-[rgba(34, 36, 38, 0.15)] text-center py-2"
                    key={valueIndex}
                  >
                    <input
                      type="text"
                      className="text-md text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-gray-50 shadow-sm placeholder-gray-400"
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
                      value={value}
                      placeholder="Enter text"
                      style={{ width: 'auto' }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpertCustomTable;
