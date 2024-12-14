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
import '../../../createClass/customContainer.css';
import { convertToNumber } from '../../../../Data/DataInChart/store/utils/convertToNumber';

//항목 이름 (한국어 -> 영어)
const engToKor = (name) => {
  const kor = {
    ITEMDATE: '측정일',

    //수질 데이터
    PTNM: '조사지점명',
    ITEMWMWK: '회차',
    ITEMWNDEP: '수심',
    ITEMTEMP: '수온',
    ITEMDO: '용존 산소',
    ITEMBOD: 'BOD',
    ITEMCOD: 'COD',
    ITEMSS: '부유물',
    ITEMTN: '총 질소',
    ITEMTP: '총인',
    ITEMTOC: '총유기탄소',

    //대기질 데이터
    stationName: '조사지점명',
    ITEMNO2: '산소 농도(ppm)',
    ITEMO3: '오존 농도(ppm)',
    ITEMPM10: '미세먼지(PM10) 농도(㎍/㎥)',
    ITEMPM25: '미세먼지(PM2.5) 농도(㎍/㎥)',
    ITEMSO2VALUE: '아황산가스 농도(ppm)',

    //시도별 대기질 데이터
    ITEMCODE: '변인',
    ITEMDATETIME: '측정 시간',
    ITEMDAEGU: '대구',
    ITEMCHUNGNAM: '충남',
    ITEMINCHEON: '인천',
    ITEMDAEJEON: '대전',
    ITEMGYONGBUK: '경북',
    ITEMSEJONG: '세종',
    ITEMGWANGJU: '광주',
    ITEMJEONBUK: '전북',
    ITEMGANGWON: '강원',
    ITEMULSAN: '울산',
    ITEMJEONNAM: '전남',
    ITEMSEOUL: '서울',
    ITEMBUSAN: '부산',
    ITEMJEJU: '제주',
    ITEMCHUNGBUK: '충북',
    ITEMGYEONGNAM: '경남',
    ITEMGYEONGGI: '경기',

    //SEED 데이터
    measuredDate: '측정 시간',
    location: '측정 장소',
    unit: '소속',
    period: '저장 주기',
    username: '사용자명',
    hum: '습도',
    temp: '기온',
    tur: '탁도',
    ph: 'pH',
    dust: '미세먼지',
    dox: '용존산소량',
    co2: '이산화탄소',
    lux: '조도',
    hum_EARTH: '토양 습도',
    pre: '기압',
  };
  return kor[name] || name;
};

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
  allData,
  localStoredPhotoList,
  setLocalStoredPhotoList,
}) {
  const [textBoxValues, setTextBoxValues] = useState({});
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태 추가
  const navigate = useNavigate();
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

  const handleNavigate = (dataType, uuid) => {
    const id = 'drawGraph';
    navigate(`/data-in-chart?id=${id}&dataType=${dataType}&uuid=${uuid}`);
  };

  useEffect(() => {
    console.log(
      'latestTableData : ' + JSON.stringify(latestTableData, null, 2),
    );
    console.log('tableData : ' + JSON.stringify(tableData, null, 2));

    let dataToUse = tableData;
    console.log(tableData);
    if (latestTableData?.length > 0) {
      dataToUse = latestTableData;
    }

    console.log('dataToUse:', JSON.stringify(dataToUse, null, 2));

    const parseStepCount = parseInt(stepCount, 10); // 10진수로 파싱

    // tableData에서 stepNum과 parseStepCount가 같은 항목 필터링
    let filteredData = dataToUse.filter(
      (data) => data.stepNum === parseStepCount,
    );

    console.log(filteredData);
    // console.log('Filtered Data:', filteredData);

    // 상태에 필터링된 데이터 세팅

    const fetchData = async () => {
      console.log(filteredData);
      let newStep;
      for (let i = 0; i < filteredData.length; i++) {
        const curData = filteredData[i];
        newStep = {
          contentName: curData.contentName,
          stepNum: curData.stepNum,
          contents: [],
        };

        for (let j = 0; j < curData.contents.length; j++) {
          const content = curData.contents[j];

          if (content.type === 'html') {
            newStep.contents.push(content);
          } else if (content.type === 'textBox') {
            newStep.contents.push({
              type: 'textBox',
              content: `<textarea
                style="width: 550px; height: 150px; padding: 10px; fontSize: 16px; lineHeight: 1.5; color: #374151; border: 1px solid #D1D5DB; borderRadius: 8px; boxShadow: 0px 4px 10px rgba(0, 0, 0, 0.1); outline: none; resize: vertical; backgroundColor: #F9FAFB";
                placeholder="학생이 여기에 답변을 입력합니다"
                disabled/>`,
            });
          } else if (content.type === 'img') {
            newStep.contents.push({
              type: 'img',
              url: content.content,
              file: null,
            });
          } else if (content.type === 'data') {
            let tableContent;
            let dataContent;
            console.log(content.content.type);
            if (content.content.type === '커스텀 데이터') {
              await customAxios
                .get(`api/custom/${content.content.id}`)
                .then((res) => {
                  //수정 필요

                  const title = res.data.title;
                  let rows = 0;
                  let columns = 0;
                  const headerSet = new Set();
                  res.data.numericFields.forEach((table) => {
                    const key = Object.keys(table)[0];
                    headerSet.add(key);
                  });

                  res.data.stringFields.forEach((table) => {
                    const key = Object.keys(table)[0];
                    headerSet.add(key);
                  });

                  columns = headerSet.size;
                  rows =
                    (res.data.numericFields.length +
                      res.data.stringFields.length) /
                    columns;
                  const variables = Array(columns);

                  const data = Array(rows + 1)
                    .fill()
                    .map(() => Array(columns).fill(0));

                  res.data.numericFields.forEach((table) => {
                    const key = Object.keys(table)[0];
                    if (table[key].order < columns) {
                      data[0][table[key].order] = key;
                      variables[table[key].order] = {
                        name: key,
                        type: 'Numeric',
                        isSelected: false,
                        isMoreSelected: false,
                        variableIndex: table[key].order,
                      };
                    }

                    data[Math.floor(table[key].order / columns) + 1][
                      table[key].order % columns
                    ] = convertToNumber(table[key].value);
                  });

                  res.data.stringFields.forEach((table) => {
                    const key = Object.keys(table)[0];
                    if (table[key].order < columns) {
                      data[0][table[key].order] = key;
                      variables[table[key].order] = {
                        name: key,
                        type: 'Categorical',
                        isSelected: false,
                        isMoreSelected: false,
                        variableIndex: table[key].order,
                      };
                    }
                    data[Math.floor(table[key].order / columns) + 1][
                      table[key].order % columns
                    ] = convertToNumber(table[key].value);
                  });
                  console.log(data);
                  dataContent = data;

                  // localStorage.setItem('data', JSON.stringify(data));
                  // localStorage.setItem('title', JSON.stringify(title));

                  // JSON 데이터를 테이블 형식으로 변환하여 contents에 추가
                  let headers = dataContent[0];

                  tableContent = (
                    <div style={{ width: 'auto', overflowX: 'auto' }}>
                      <div
                        style={{
                          transform: 'scale(1)',
                          transformOrigin: 'top left',
                        }}
                      >
                        <table
                          style={{
                            width: '100%',
                            marginTop: '10px',
                            borderCollapse: 'collapse',
                            tableLayout: 'fixed', // 테이블 셀 너비를 고정
                          }}
                        >
                          <thead>
                            <tr>
                              {headers.map((header) => (
                                <th
                                  key={header}
                                  style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    backgroundColor: '#f2f2f2',
                                    wordWrap: 'break-word', // 긴 단어를 줄바꿈
                                    fontSize: '10px', // 테이블 길이에 맞춰서 size 조절 수정해야함
                                  }}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataContent.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                style={{ borderBottom: '1px solid #ddd' }}
                              >
                                {row.map((item) => (
                                  <td
                                    key={`${rowIndex}-${item}`}
                                    style={{
                                      border: '1px solid #ddd',
                                      padding: '8px',
                                      wordWrap: 'break-word', // 긴 단어를 줄바꿈
                                      fontSize: '10px', // 테이블 길이에 맞춰서 size 조절 수정해야함
                                    }}
                                  >
                                    {item}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
                .catch((err) => console.log(err));
            } else {
              let headers = [];
              let path = '';

              if (content.content.type === '수질 데이터') {
                path = `/ocean-quality/mine/chunk?dataUUID=${content.content.id}`;
                await customAxios
                  .get(path, {
                    headers: {
                      userName: localStorage.getItem('username'),
                    },
                  })
                  .then((res) => {
                    // 남기고 싶은 키 목록
                    const keysToKeep = [
                      'PTNM',
                      'ITEMDATE',
                      'ITEMWMWK',
                      'ITEMWNDEP',
                      'ITEMBOD',
                      'ITEMCOD',
                      'ITEMDO',
                      'ITEMSS',
                      'ITEMTEMP',
                      'ITEMTN',
                      'ITEMTOC',
                      'ITEMTP',
                    ];

                    // 변환 로직
                    const transformedData = res.data[0].data.map((item) => {
                      const newItem = {};
                      keysToKeep.forEach((key) => {
                        if (item[key] !== undefined) {
                          if (item[key] === null) return;
                          else if (isNaN(item[key])) newItem[key] = item[key];
                          else newItem[key] = Number(item[key]);
                        } else {
                          newItem[key] = null; // 해당 키가 없으면 null로 설정
                        }
                      });
                      return newItem;
                    });
                    console.log(transformedData);
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
                    console.log(recombined);
                  })
                  .catch((err) => console.log(err));
              } else if (content.content.type === '대기질 데이터') {
                path = `/air-quality/mine/chunk?dataUUID=${content.content.id}`;
                await customAxios
                  .get(path, {
                    headers: {
                      userName: localStorage.getItem('username'),
                    },
                  })
                  .then((res) => {
                    // 남기고 싶은 키 목록
                    const keysToKeep = [
                      'stationName',
                      'ITEMDATE',
                      'ITEMNO2',
                      'ITEMO3',
                      'ITEMPM10',
                      'ITEMPM25',
                      'ITEMSO2VALUE',
                    ];
                    console.log(res.data);

                    // 변환 로직
                    const transformedData = res.data.data.map((item) => {
                      const newItem = {};
                      keysToKeep.forEach((key) => {
                        if (item[key] !== undefined) {
                          if (item[key] === null) return;
                          else if (isNaN(item[key])) newItem[key] = item[key];
                          else newItem[key] = Number(item[key]);
                        } else {
                          newItem[key] = null; // 해당 키가 없으면 null로 설정
                        }
                      });
                      return newItem;
                    });
                    console.log(transformedData);
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
                    console.log(recombined);
                  })
                  .catch((err) => console.log(err));
              } else if (content.content.type === '시도별 대기질 데이터') {
                path = `/city-air-quality/mine/chunk?dataUUID=${content.content.id}`;
                await customAxios
                  .get(path, {
                    headers: {
                      userName: localStorage.getItem('username'),
                    },
                  })
                  .then((res) => {
                    // 남기고 싶은 키 목록
                    const keysToKeep = [
                      'ITEMCODE',
                      'ITEMDATETIME',
                      'ITEMDAEGU',
                      'ITEMCHUNGNAM',
                      'ITEMINCHEON',
                      'ITEMDAEJEON',
                      'ITEMGYONGBUK',
                      'ITEMSEJONG',
                      'ITEMGWANGJU',
                      'ITEMJEONBUK',
                      'ITEMGANGWON',
                      'ITEMULSAN',
                      'ITEMJEONNAM',
                      'ITEMSEOUL',
                      'ITEMBUSAN',
                      'ITEMJEJU',
                      'ITEMCHUNGBUK',
                      'ITEMGYEONGNAM',
                      'ITEMGYEONGGI',
                    ];
                    console.log(res.data);

                    // 변환 로직
                    const transformedData = res.data.data.map((item) => {
                      const newItem = {};
                      keysToKeep.forEach((key) => {
                        if (item[key] === null) return;
                        else if (item[key] !== undefined) {
                          newItem[key] = item[key];
                        } else {
                          newItem[key] = null; // 해당 키가 없으면 null로 설정
                        }
                      });
                      return newItem;
                    });
                    console.log(transformedData);
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
                    console.log(recombined);
                  })
                  .catch((err) => console.log(err));
              }
              console.log(dataContent);
              tableContent = (
                <div style={{ width: 'auto', overflowX: 'auto' }}>
                  <div
                    style={{
                      transform: 'scale(1)',
                      transformOrigin: 'top left',
                    }}
                  >
                    <table
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        borderCollapse: 'collapse',
                        tableLayout: 'fixed', // 테이블 셀 너비를 고정
                      }}
                    >
                      <thead>
                        <tr>
                          {headers.map((header) => (
                            <th
                              key={header}
                              style={{
                                border: '1px solid #ddd',
                                padding: '8px',
                                backgroundColor: '#f2f2f2',
                                wordWrap: 'break-word', // 긴 단어를 줄바꿈
                                fontSize: '10px', // 테이블 길이에 맞춰서 size 조절 수정해야함
                              }}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataContent.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            style={{ borderBottom: '1px solid #ddd' }}
                          >
                            {headers.map((header, index) => (
                              <td
                                key={`${rowIndex}-${header}`}
                                style={{
                                  border: '1px solid #ddd',
                                  padding: '8px',
                                  wordWrap: 'break-word', // 긴 단어를 줄바꿈
                                  fontSize: '10px', // 테이블 길이에 맞춰서 size 조절 수정해야함
                                }}
                              >
                                {row[index]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            newStep.contents.push({
              type: 'data',
              content: {
                view: tableContent,
                id: content.content.id,
                type: content.content.type,
              },
            });
          } else {
            newStep.contents.push(content);
          }
        }
      }
      console.log([newStep]);
      setData([newStep]);
    };
    fetchData();
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
    let dataToUse = tableData;

    if (latestTableData?.length > 0) {
      dataToUse = latestTableData;
    }

    console.log('dataToUse 확인 : ' + JSON.stringify(dataToUse, null, 2));

    const stepCount = allData.stepCount;

    const stepCheck = new Array(stepCount).fill(false);
    let flag = false;

    const updatedTableData = replaceContents(dataToUse, data);

    console.log(
      'updatedTableData 확인 : ' + JSON.stringify(updatedTableData, null, 2),
    );

    const updatedDataPromises = updatedTableData.map(async (data) => ({
      uuid: allData.uuid,
      timestamp: new Date().toISOString(),
      username: studentName,
      stepName: allData.stepName,
      stepCount: allData.stepCount,
      contents: await Promise.all(
        updatedTableData.map(async (item) => {
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
                    // alert('???');
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

  const shouldDisplaySubmitButton = data.some((stepData) =>
    stepData.contents.some(
      (contentItem) =>
        contentItem.type === 'dataInChartButton' ||
        contentItem.type === 'textBox',
    ),
  );

  console.log('여기', data);
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
            className="custom-html-container ql-editor"
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

      console.log('아 여기 어디야 : ' + JSON.stringify(formattedData, null, 2));

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
      return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
    case 'textBox':
      return (
        <TextField
          defaultValue="여기에 답변을 입력하세요"
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
          dangerouslySetInnerHTML={{
            __html: `<img src=${content.url} />`,
          }}
        />
      );
    case 'dataInChartButton':
      return (
        <div>
          <div style={{ display: 'flex' }}>
            <Button
              onClick={() =>
                onNavigate(content.content.dataType, content.content.id)
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
            {/* <Button
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
            </Button> */}
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
      return React.createElement(
        content.content.view.type,
        content.content.view.props,
      );

    default:
      return null;
  }
}

export default StudentRenderAssign;
