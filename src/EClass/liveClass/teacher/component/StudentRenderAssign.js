import React, { useEffect, useState, useRef } from 'react';
import { Paper, Typography, Button, TextField } from '@mui/material';
import { customAxios } from '../../../../Common/CustomAxios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { v4 as uuidv4 } from 'uuid';
import DataInChartModal from '../../dataInChartStep/DataInChartModal';
import { useNavigate } from 'react-router-dom';
import usePhotoStore from '../../../../Data/DataInChart/store/photoStore';
import axios from 'axios';

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

const handleDeleteFromS3 = async (imageUrl) => {
  try {
    await customAxios.delete('/api/images/delete', {
      headers: {
        'X-Previous-Image-URL': imageUrl, // 커스텀 헤더로 URL을 전달
      },
    });
    console.log('이미지 삭제 성공:', imageUrl);
    window.location.reload();
  } catch (error) {
    console.error('이미지 삭제 오류:', error);
    throw error;
  }
};

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
  const uploadedImagesState = useRef([]); // 업로드된 이미지 상태

  const [imageUrlArray, setImageUrlArray] = useState([]);

  // Zustand store에서 getStorePhotoList 가져오기
  const { getStorePhotoList, setStorePhotoList } = usePhotoStore();

  useEffect(() => {
    console.log('데이터 확인 : ' + JSON.stringify(data, null, 2));
  }, [data]);

  useEffect(() => {
    const photoList = getStorePhotoList();
    if (photoList) {
      console.log('사진 수 : ', getStorePhotoList().length);

      setLocalStoredPhotoList(photoList);
    }
  }, []);

  const handleNavigate = (uuid, username, contentName, stepNum, content) => {
    const id = 'drawGraph';
    navigate(
      `/data-in-chart?id=${id}&uuid=${uuid}&username=${username}&contentName=${contentName}&stepNum=${stepNum}&content=${content.content}`,
    );
  };

  useEffect(() => {
    console.log(
      'latestTableData : ' + JSON.stringify(latestTableData, null, 2),
    );
    console.log('tableData : ' + JSON.stringify(tableData, null, 2));
    const parseStepCount = parseInt(stepCount, 10); // 10진수로 파싱

    // tableData에서 stepNum과 parseStepCount가 같은 항목 필터링
    const filteredData = tableData.filter(
      (data) => data.stepNum === parseStepCount,
    );

    console.log('Filtered Data:', filteredData);

    // 상태에 필터링된 데이터 세팅
    setData(filteredData);
  }, [stepCount, latestTableData, tableData]);

  // 로컬에서 이미지 삭제한 부분 보여주기 위한 훅
  useEffect(() => {
    console.log('데이터 체크 : ' + JSON.stringify(data, null, 2));

    if (data && data.length > 0 && imageUrlArray.length > 0) {
      const removeImagesFromData = async (data, imageUrlArray) => {
        // 각 item에 대해 처리
        const updatedDataPromises = data.map(async (item) => {
          const updatedContents = await Promise.all(
            item.contents.map((contentItem) => {
              // 이미지 타입의 데이터를 처리
              if (contentItem.type === 'img') {
                console.log(
                  '삭제 이미지 : ' +
                    JSON.stringify(contentItem.content, null, 2),
                );
                // imageUrlArray에 있는 URL과 일치하는지 확인하고 제거
                if (imageUrlArray.includes(contentItem.content)) {
                  return null; // 이미지 삭제 시 null 반환
                }
              }
              return contentItem; // 다른 항목은 그대로 유지
            }),
          );

          // null 값을 필터링하여 업데이트된 데이터를 반환
          return {
            ...item,
            contents: updatedContents.filter(
              (contentItem) => contentItem !== null,
            ),
          };
        });

        const updatedData = await Promise.all(updatedDataPromises);

        console.log(
          '업데이트 데이터 체크 : ' + JSON.stringify(updatedData, null, 2),
        );

        return updatedData;
      };

      removeImagesFromData(data, imageUrlArray).then((updatedData) => {
        setData(updatedData);
      });
    }
  }, [imageUrlArray]);

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

  // 이미지 삭제 등으로 수정된 테이블 contents 교체 메서드
  const replaceContents = (tableData, data) => {
    // tableData의 각 항목을 순회하면서 contents를 교체
    const updatedTableData = tableData.map((tableItem) => {
      // tableItem의 contents 중에서 stepNum이 일치하는 항목을 찾음
      const updatedContents = tableItem.contents.map((contentItem) => {
        // data의 stepNum과 일치하는 contents 찾기
        const newContent = data.find(
          (dataItem) => dataItem.stepNum === contentItem.stepNum,
        );

        // 일치하는 stepNum의 contents가 있으면 해당 contents로 교체, 아니면 기존 내용 유지
        return newContent
          ? { ...contentItem, contents: newContent.contents }
          : contentItem;
      });

      // tableItem의 contents를 업데이트된 내용으로 교체
      return {
        ...tableItem,
        contents: updatedContents,
      };
    });

    return updatedTableData;
  };

  const handleSubmit = async () => {
    const studentName = localStorage.getItem('username');
    const dataToUse = latestTableData || tableData;
    const stepCount = tableData[0].stepCount || latestTableData[0].stepCount;
    const stepCheck = new Array(stepCount).fill(false);
    let flag = false;

    const updatedTableData = replaceContents(dataToUse, data);

    const updatedDataPromises = updatedTableData.map(async (data) => ({
      uuid: data.uuid,
      timestamp: new Date().toISOString(),
      username: studentName,
      stepName: data.stepName,
      stepCount: data.stepCount,
      contents: await Promise.all(
        data.contents.map(async (item) => {
          return {
            contentName: item.contentName,
            stepNum: item.stepNum,
            contents: await Promise.all(
              item.contents
                .map(async (contentItem, index) => {
                  // textBox 처리
                  if (contentItem.type === 'textBox') {
                    const updatedContent =
                      textBoxValues[item.stepNum]?.[index] ||
                      contentItem.content;
                    if (updatedContent && updatedContent.trim() !== '') {
                      const stepIndex = item.stepNum - 1;
                      if (stepIndex >= 0 && stepIndex < stepCount) {
                        stepCheck[stepIndex] = true;
                      }
                    }
                    return { ...contentItem, content: updatedContent };
                  }

                  // dataInChartButton 처리
                  if (
                    contentItem.type === 'dataInChartButton' &&
                    localStoredPhotoList.length > 0
                  ) {
                    flag = true; // flag 설정하여 dataInChartButton 감지

                    // stepCheck 업데이트
                    const stepIndex = item.stepNum - 1;

                    console.log('데이터 차트 인덱스 : ' + stepIndex);
                    alert('???');
                    if (stepIndex >= 0 && stepIndex < stepCount) {
                      stepCheck[stepIndex] = true;
                    }

                    // 이미지 업로드 및 상태 저장
                    let uploadedImages = [];
                    for (const [idx, photo] of localStoredPhotoList.entries()) {
                      const base64Image = photo.image;
                      const filename = `image_${uuidv4()}.jpg`;
                      const imageFile = base64ToFile(base64Image, filename);
                      const contentUuid = uuidv4();
                      const imageUrl = await handleUpload(
                        imageFile,
                        contentUuid,
                      );

                      const uploadedImage = {
                        type: 'img',
                        content: imageUrl,
                        x: 600 + idx * 10,
                        y: 300 + idx * 10,
                      };
                      uploadedImages.push(uploadedImage);
                    }

                    // 상태에 저장
                    uploadedImagesState.current = uploadedImages;

                    return { ...contentItem }; // 기존 dataInChartButton 반환
                  }

                  console.log('컨텐츠 타입 확인 : ' + contentItem.type);

                  return contentItem;
                })
                .filter((contentItem) => contentItem !== null), // null인 객체를 제거
            ),
          };
        }),
      ),
    }));

    const updatedData = await Promise.all(updatedDataPromises);

    // 이미지 상태를 dataInChartButton 아래에 추가하는 로직
    const finalUpdatedData = updatedData.map((dataItem) => ({
      ...dataItem,
      contents: dataItem.contents.map((contentItem) => {
        const updatedContents = contentItem.contents.reduce((acc, current) => {
          acc.push(current); // 현재 contentItem을 추가

          // img 타입 추가
          if (current.type === 'dataInChartButton' && flag) {
            console.log(
              '잘 들어갔나 : ' +
                JSON.stringify(uploadedImagesState.current, null, 2),
            );
            uploadedImagesState.current.forEach((img) => {
              acc.push(img); // 이미지들을 dataInChartButton 아래에 추가
            });
          }
          return acc;
        }, []);

        return {
          ...contentItem,
          contents: updatedContents,
        };
      }),
    }));

    console.log(
      '최종 제출 데이터 : ' + JSON.stringify(finalUpdatedData, null, 2),
    );

    const requestData = {
      stepCheck: stepCheck,
      studentId: studentId,
    };

    console.log(
      '저장하는 학생의 세션 uuid : ' +
        JSON.stringify(finalUpdatedData[0].uuid, null, 2),
    );

    const assignmentUuidRegistData = {
      eclassUuid: eclassUuid,
      assginmentUuid: finalUpdatedData[0].uuid,
      username: finalUpdatedData[0].username,
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
            ? customAxios.put('/api/assignment/update', finalUpdatedData)
            : customAxios.post('/api/assignment/save', finalUpdatedData));

          // S3에서 이미지 삭제 처리
          try {
            await Promise.all(
              imageUrlArray.map(async (imageUrl, index) => {
                try {
                  // S3에서 이미지 삭제 요청
                  await handleDeleteFromS3(imageUrl);

                  // 로컬 상태에서 이미지 삭제
                  setStorePhotoList((prevList) =>
                    prevList.filter((_, i) => i !== index),
                  );
                  setLocalStoredPhotoList((prevList) =>
                    prevList.filter((_, i) => i !== index),
                  );

                  console.log('이미지 삭제 성공:', imageUrl);
                } catch (error) {
                  console.error('이미지 삭제 실패:', error);
                }
              }),
            );
          } catch (error) {
            console.error('전체 이미지 삭제 처리 중 오류 발생:', error);
          }

          console.log('제출된 객체 : ', updatedData);
          setAssginmentFetch(true);
          alert('제출 완료했습니다.');
          // window.location.reload();
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

  const shouldDisplaySubmitButton = data.some((stepData) =>
    stepData.contents.some(
      (contentItem) =>
        contentItem.type === 'dataInChartButton' ||
        contentItem.type === 'textBox',
    ),
  );

  return (
    <div>
      {data.map((stepData) => (
        <React.Fragment key={stepData.stepNum}>
          <Paper
            style={{
              padding: 20,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              width: '100%',
              height: '510px',
              overflow: 'auto',
            }}
          >
            <div>
              <Typography variant="h4" gutterBottom>
                {stepData.contentName}
              </Typography>
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
                  setImageUrlArray={setImageUrlArray}
                />
              ))}
            </div>
          </Paper>
          {/* 제출 버튼 조건 렌더링 */}
          {shouldDisplaySubmitButton && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleSubmit(imageUrlArray)}
              style={{ marginTop: '10px' }}
              sx={{
                width: '10rem',
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
          )}
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
}) {
  const [tableData, setTableData] = useState(null);

  const handleTextChange = (event) => {
    setTextBoxValue(index, event.target.value);
  };

  const handleSelectData = async (id) => {
    try {
      const response = await customAxios.get(`api/custom/${id}`);
      const fetchedData = response.data;

      const formattedData = fetchedData.numericFields.map((field, index) => ({
        ...fetchedData.stringFields[index],
        ...field,
      }));

      setTableData(formattedData); // 테이블 데이터를 상태에 저장
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  };

  function tableRender(content) {
    if (typeof content === 'string' || typeof content === 'number') {
      return content;
    }

    const { type, props } = content;

    return React.createElement(
      type,
      { ...props, key: props.key || null, ref: props.ref || null },
      props.children
        ? Array.isArray(props.children)
          ? props.children.map((child) => tableRender(child))
          : tableRender(props.children)
        : null,
    );
  }

  switch (content.type) {
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
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          <img
            crossOrigin="anonymous"
            src={content.content}
            alt="Assignment Content"
            style={{ width: 500, height: 300 }}
          />
        </div>
      );
    case 'dataInChartButton':
      return (
        <div>
          <div style={{ display: 'flex' }}>
            <Button
              onClick={() =>
                onNavigate(
                  stepData.uuid,
                  stepData.username,
                  content.contentName,
                  content.stepNum,
                  content,
                )
              }
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#6200ea',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#3700b3',
                },
              }}
            >
              그래프 그리기
            </Button>

            {/* 데이터 가져오기 버튼 */}
            <Button
              onClick={() => handleSelectData(content.content)}
              variant="contained"
              color="secondary"
              sx={{
                backgroundColor: '#6200ea',
                color: 'white',
                padding: '10px 20px',
                marginLeft: '10px',
                borderRadius: '20px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#3700b3',
                },
              }}
            >
              테이블 보기
            </Button>
          </div>

          {/* 테이블 렌더링 */}
          {tableData && (
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '10px',
                }}
              >
                <thead>
                  <tr>
                    {Object.keys(tableData[0]).map((header, index) => (
                      <th
                        key={index}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          backgroundColor: '#f2f2f2',
                          textAlign: 'center',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            border: '1px solid #ddd',
                            padding: '8px',
                            textAlign: 'center',
                          }}
                        >
                          {cell.value || cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              marginTop: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            {storedPhotoList.length > 0 ? (
              storedPhotoList.map((photo, index) => (
                <div
                  key={photo.image || index} // key를 photo.image로 설정, 없을 경우 index 사용
                  style={{
                    marginBottom: '20px',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={photo.image}
                    alt={photo.title || `photo-${index}`} // 고유 alt 제공
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      );

    case 'data':
      return <div>{tableRender(content.content)}</div>;
    default:
      return null;
  }
}

export default StudentRenderAssign;
