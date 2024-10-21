import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, TextField } from '@mui/material';
import { customAxios } from '../../../../Common/CustomAxios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { v4 as uuidv4 } from 'uuid';
import DataInChartModal from '../../dataInChartStep/DataInChartModal';
import { useNavigate } from 'react-router-dom';
import usePhotoStore from '../../../../Data/DataInChart/store/photoStore';
import axios from 'axios';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Base64를 File로 변환하는 함수
function base64ToFile(base64Data, filename) {
  const arr = base64Data.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

function StudentRenderAssign({
  tableData,
  latestTableData,
  assginmentCheck,
  stepCount,
  studentId,
  sessionIdState,
  eclassUuid,
  setAssginmentFetch,
}) {
  const [textBoxValues, setTextBoxValues] = useState({});
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태 추가
  const navigate = useNavigate();
  const [localStoredPhotoList, setLocalStoredPhotoList] = useState([]);

  // Zustand store에서 getStorePhotoList 가져오기
  const { getStorePhotoList, setStorePhotoList } = usePhotoStore();

  useEffect(() => {
    const photoList = getStorePhotoList();
    if (photoList) {
      console.log('사진 수 : ', getStorePhotoList().length);

      setLocalStoredPhotoList(photoList);
    }
  }, []);

  const handleNavigate = (uuid, username, contentName, stepNum) => {
    const id = 'drawGraph';
    navigate(
      `/data-in-chart?id=${id}&uuid=${uuid}&username=${username}&contentName=${contentName}&stepNum=${stepNum}`,
    );
  };

  useEffect(() => {
    console.log('stepCount : ' + JSON.stringify(stepCount, null, 2));
    const parseStepCount = parseInt(stepCount);
    let filteredContents = latestTableData
      ? latestTableData
          .flatMap((data) => data.contents)
          .filter((content) => content.stepNum === parseStepCount)
      : tableData
          .flatMap((data) => data.contents)
          .filter((content) => content.stepNum === parseStepCount);
    setData(filteredContents);
  }, [stepCount, latestTableData, tableData]);

  const handleTextBoxSubmit = (stepNum, index, text) => {
    setTextBoxValues((prev) => ({
      ...prev,
      [stepNum]: {
        ...(prev[stepNum] || []),
        [index]: text,
      },
    }));
  };

  // 이미지 파일 업로드 메서드
  const handleUpload = async (image, contentUuid) => {
    try {
      const response = await customAxios.get('/api/images/presigned-url', {
        params: { fileName: contentUuid },
      });
      const { preSignedUrl, imageUrl } = response.data;
      const contentType = 'image/jpg';

      await axios.put(preSignedUrl, image, {
        headers: {
          'Content-Type': contentType,
        },
      });

      return imageUrl;
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    const studentName = localStorage.getItem('username');
    const dataToUse = latestTableData || tableData;
    const stepCount = tableData[0].stepCount;
    const stepCheck = new Array(stepCount).fill(false);

    const updatedDataPromises = dataToUse.map(async (data) => ({
      uuid: data.uuid,
      timestamp: new Date().toISOString(),
      username: studentName,
      stepName: data.stepName,
      stepCount: data.stepCount,
      contents: await Promise.all(
        data.contents.map(async (item) => ({
          contentName: item.contentName,
          stepNum: item.stepNum,
          contents: await Promise.all(
            item.contents.map(async (contentItem, index) => {
              if (contentItem.type === 'textBox') {
                const updatedContent =
                  textBoxValues[item.stepNum]?.[index] || contentItem.content;
                if (updatedContent && updatedContent.trim() !== '') {
                  const stepIndex = item.stepNum - 1;
                  if (stepIndex >= 0 && stepIndex < stepCount) {
                    stepCheck[stepIndex] = true;
                  }
                }
                return { ...contentItem, content: updatedContent };
              }

              // dataInChartButton이 있는 경우 처리
              if (
                contentItem.type === 'dataInChartButton' &&
                localStoredPhotoList.length > 0
              ) {
                // 1. dataInChartButton을 유지
                const originalButton = { ...contentItem };

                // 2. storedPhotoList의 이미지 처리
                const imageUploadPromises = localStoredPhotoList.map(
                  async (photo, idx) => {
                    const base64Image = photo.image;
                    const filename = `image_${uuidv4()}.jpg`;
                    const imageFile = base64ToFile(base64Image, filename);
                    const contentUuid = uuidv4();
                    const imageUrl = await handleUpload(imageFile, contentUuid);
                    return {
                      type: 'img',
                      content: imageUrl,
                      x: 1000 + idx * 10, // 이미지 위치 조정
                      y: 1500 + idx * 10,
                    };
                  },
                );

                const uploadedImages = await Promise.all(imageUploadPromises);

                // dataInChartButton과 업로드된 이미지를 함께 반환
                return [originalButton, ...uploadedImages];
              }

              return contentItem;
            }),
          ).then((results) => results.flat()), // 중첩 배열 평탄화
        })),
      ),
    }));

    const updatedData = await Promise.all(updatedDataPromises);

    const requestData = {
      stepCheck: stepCheck,
      studentId: studentId,
    };

    const assignmentUuidRegistData = {
      eclassUuid: eclassUuid,
      assginmentUuid: updatedData[0].uuid,
      username: updatedData[0].username,
    };

    if (window.confirm('제출하시겠습니까?')) {
      try {
        assginmentStompClient();

        try {
          await customAxios.post(
            '/api/eclass/student/assginmentUuid/update',
            assignmentUuidRegistData,
          );

          await customAxios.post(
            '/api/eclass/student/assignment/stepCheck',
            requestData,
          );

          await (assginmentCheck
            ? customAxios.put('/api/assignment/update', updatedData)
            : customAxios.post('/api/assignment/save', updatedData));

          console.log('제출된 객체 : ', updatedData);
          setAssginmentFetch(true);
          alert('제출 완료했습니다.');
          window.location.reload();
        } catch (error) {
          console.error('Error during submission:', error);
          alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('Error during stomp connection:', error);
        alert('Stomp 연결에 문제가 있습니다.');
      }
    }
  };

  const assginmentStompClient = () => {
    const token = localStorage.getItem('access_token').replace('Bearer ', '');
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
    );

    const message = {
      sessionId: sessionIdState,
      assginmentShared: true,
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    };

    const stompClient = new Client({ webSocketFactory: () => socket });

    stompClient.onConnect({}, () => {
      stompClient.send('/app/assginment-status', {}, JSON.stringify(message));
    });
  };

  return (
    <div>
      {data.map((stepData) => (
        <React.Fragment key={stepData.stepNum}>
          <Paper
            style={{
              padding: 20,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              width: '100%',
              minHeight: '61vh',
            }}
          >
            <div>
              {stepData.contents.map((content, idx) => (
                <RenderContent
                  key={`${stepData.stepNum}-${idx}`}
                  content={content}
                  textBoxValue={textBoxValues[stepData.stepNum]?.[idx] || ''}
                  setTextBoxValue={(id, text) =>
                    handleTextBoxSubmit(stepData.stepNum, id, text, content)
                  }
                  index={idx}
                  onOpenModal={() => setIsModalOpen(true)}
                  onNavigate={handleNavigate}
                  storedPhotoList={localStoredPhotoList}
                  stepData={stepData}
                  setStorePhotoList={setStorePhotoList}
                  setLocalStoredPhotoList={setLocalStoredPhotoList}
                />
              ))}
            </div>
          </Paper>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            style={{ marginTop: '10px' }}
            sx={{
              marginRight: 1,
              fontFamily: "'Asap', sans-serif",
              fontWeight: '600',
              fontSize: '0.9rem',
              color: 'grey',
              backgroundColor: '#feecfe',
              borderRadius: '2.469rem',
              border: 'none',
            }}
          >
            제출
          </Button>
        </React.Fragment>
      ))}
      {isModalOpen && <DataInChartModal isModalOpen={isModalOpen} />}
    </div>
  );
}

function RenderContent({
  content,
  setTextBoxValue,
  index,
  onNavigate,
  stepData,
  storedPhotoList,
  setStorePhotoList,
  setLocalStoredPhotoList,
}) {
  const handleTextChange = (event) => {
    setTextBoxValue(index, event.target.value);
  };

  // 이미지 삭제 핸들러
  const handleDeletePhoto = (index) => {
    setStorePhotoList((prevList) => prevList.filter((_, i) => i !== index));
    setLocalStoredPhotoList((prevList) =>
      prevList.filter((_, i) => i !== index),
    );
  };

  switch (content.type) {
    case 'title':
      return (
        <Typography variant="h4" gutterBottom>
          {content.content}
        </Typography>
      );
    case 'html':
      return (
        <div
          style={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      );
    case 'textBox':
      return (
        <TextField
          defaultValue={content.content}
          onChange={handleTextChange}
          variant="outlined"
          fullWidth
          multiline
          minRows={5}
          maxRows={10}
        />
      );
    case 'img':
      return (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={content.content}
            alt="Assignment Content"
            style={{ width: content.x, height: content.y }}
          />
        </div>
      );
    case 'dataInChartButton':
      return (
        <div>
          <Button
            onClick={() =>
              onNavigate(
                stepData.uuid,
                stepData.username,
                content.contentName,
                content.stepNum,
              )
            }
          >
            그래프 그리기
          </Button>

          <div
            style={{
              marginTop: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', // auto-fit을 사용하고 minmax 값 조정
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            {storedPhotoList.length > 0
              ? storedPhotoList.map((photo, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '20px',
                      position: 'relative',
                      textAlign: 'center',
                    }}
                  >
                    {/* <Typography variant="subtitle1">{photo.title}</Typography> */}
                    <img
                      src={photo.image}
                      alt={photo.title}
                      style={{
                        width: '100%', // 그리드 셀에 맞게 이미지 크기 조정
                        height: 'auto',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      aria-label="delete"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                      }}
                      onClick={() => handleDeletePhoto(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))
              : ''}
          </div>
        </div>
      );
    case 'emptyBox':
      return (
        <div
          style={{
            border: '1px dashed #ddd',
            padding: '20px',
            textAlign: 'center',
            margin: '20px 0',
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Empty Box
          </Typography>
        </div>
      );
    default:
      return null;
  }
}

export default StudentRenderAssign;
