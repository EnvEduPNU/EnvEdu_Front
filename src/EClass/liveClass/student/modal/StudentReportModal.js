import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { customAxios } from '../../../../Common/CustomAxios';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

function StudentReportModal({
  open,
  onClose,
  tableData,
  latestTableData,
  assginmentCheck,
  eclassUuid,
  allData,
  storedPhotoList,
  textBoxDatas,
  setTextBoxDatas,
}) {
  const [textBoxValues, setTextBoxValues] = useState({});
  const [data, setData] = useState([]);
  const [studentId, setStudentId] = useState();
  // console.log(tableData);
  useEffect(() => {
    const fetchStudentId = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await customAxios.get(
          `/api/student/getStudentId?username=${username}&uuid=${eclassUuid}`,
        );
        setStudentId(response.data);
      } catch (error) {
        console.error('Error fetching student ID:', error);
      }
    };
    fetchStudentId();
  }, [eclassUuid]);

  useEffect(() => {
    // console.log(
    //   'latestTableData : ' + JSON.stringify(latestTableData, null, 2),
    // );
    // console.log('tableData : ' + JSON.stringify(tableData, null, 2));

    let dataToUse = tableData;

    if (latestTableData?.length > 0) {
      dataToUse = latestTableData;
    }

    // tableData에서 stepNum과 parseStepCount가 같은 항목 필터링
    // let filteredData = dataToUse.filter((data) => data.stepNum === dataToUse);
    let filteredData = dataToUse;

    // console.log('Filtered Data:', filteredData);

    // 상태에 필터링된 데이터 세팅

    const fetchData = async () => {
      // console.log(filteredData);
      let newSteps = [];
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
          // console.log(content);
          if (content.type === 'html') {
            newStep.contents.push({
              type: 'html',
              content: content.content,
            });
          } else if (content.type === 'textBox') {
            newStep.contents.push({
              type: 'textBox',
              content: {
                text: content.content.text,
                uuid: content.content.uuid,
              },
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
            // console.log(content.content.type);
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
                  // console.log(data);
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
                    // console.log(transformedData);
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
                    // console.log(recombined);
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
                    // console.log(res.data);

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
                    // console.log(transformedData);
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
                    // console.log(recombined);
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
                    // console.log(res.data);

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
                    // console.log(transformedData);
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
                    // console.log(recombined);
                  })
                  .catch((err) => console.log(err));
              }
              // console.log(dataContent);
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
                        {dataContent?.map((row, rowIndex) => (
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
        newSteps.push(newStep);
      }
      // console.log(newSteps);
      if (newStep === undefined) setData([]);
      else setData(newSteps);
    };
    fetchData();
  }, [latestTableData, tableData]);

  // console.log(data);
  const handleSubmit = async () => {
    const studentName = localStorage.getItem('username');
    const dataToUse = latestTableData || tableData;
    const reportUuid = uuidv4();

    const groupedContents = dataToUse.map((data, stepIndex) => ({
      contentName: data.contentName, // data에서 contentName 가져오기
      stepNum: data.stepNum, // data에서 stepNum 가져오기
      contents: data.contents.map((contentItem, contentIndex) => {
        if (contentItem.type === 'textBox') {
          return {
            ...contentItem,
            content: {
              text:
                textBoxDatas[contentItem.content.uuid] === undefined
                  ? contentItem.content.text
                  : textBoxDatas[contentItem.content.uuid],
              uuid: contentItem.content.uuid,
            },
          };
        } else if (contentItem.type === 'dataInChartButton') {
          // console.log(contentItem);
          console.log(contentItem);
          if (contentItem.content.photoList !== undefined)
            return {
              type: 'dataInChartButton',
              content: {
                photoList: [
                  ...storedPhotoList.map((photo) => photo.image),
                  ...contentItem.content.photoList,
                ],
                dataType: contentItem.content.dataType,
                id: contentItem.content.id,
              },
            };

          return {
            type: 'dataInChartButton',
            content: {
              photoList: [...storedPhotoList.map((photo) => photo.image)],
              dataType: contentItem.content.dataType,
              id: contentItem.content.id,
            },
          };
        }
        return contentItem;
      }),
    }));

    const updatedData = [
      {
        uuid: reportUuid,
        timestamp: new Date().toISOString(),
        username: studentName,
        stepName: '수업 테스트', // 고정된 값으로 설정
        stepCount: groupedContents.length,
        contents: groupedContents,
      },
    ];

    if (window.confirm('제출하시겠습니까?')) {
      try {
        // console.log(
        //   '업데이트 하기전 확인 : ' + JSON.stringify(updatedData, null, 2),
        // );
        // console.log(
        //   '업데이트 하기전 확인 assginmentCheck : ' +
        //     JSON.stringify(assginmentCheck, null, 2),
        // );

        const requestData = {
          reportUuid: reportUuid,
          studentId: studentId,
        };

        await customAxios.post(
          '/api/eclass/student/assignment/report/save',
          requestData,
        );
        alert('제출 완료했습니다!');

        if (assginmentCheck) {
          await customAxios.put('/api/report/update', updatedData);
        } else {
          await customAxios.post('/api/report/save', updatedData);
        }

        window.location.reload();
      } catch (error) {
        console.error('오류가 발생했습니다: ', error);
        alert('제출에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const waitForImagesToLoad = (element) => {
    const imgElements = element.querySelectorAll('img');
    const promises = Array.from(imgElements).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve; // 에러 처리
          }
        }),
    );
    return Promise.all(promises);
  };

  const handleSavePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yOffset = 10;

    // 타이틀 섹션 캡처
    const titleElement = document.getElementById('title-section');
    await waitForImagesToLoad(titleElement); // 이미지 로드 대기
    const titleCanvas = await html2canvas(titleElement, {
      scale: 2,
      useCORS: true,
    });
    const titleImgData = titleCanvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (titleCanvas.height * imgWidth) / titleCanvas.width;

    pdf.addImage(titleImgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
    yOffset += imgHeight + 10;

    // 단계별 콘텐츠 캡처
    for (let stepIndex = 0; stepIndex < data?.length; stepIndex++) {
      const stepElement = document.getElementById(`step-content-${stepIndex}`);
      await waitForImagesToLoad(stepElement); // 이미지 로드 대기
      const canvas = await html2canvas(stepElement, {
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');
      const stepImgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yOffset + stepImgHeight > pdf.internal.pageSize.height) {
        pdf.addPage();
        yOffset = 10;
      }
      pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, stepImgHeight);
      yOffset += stepImgHeight + 10;
    }

    pdf.save('report.pdf');
  };

  // console.log(data);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>보고서</DialogTitle>
      <DialogContent
        dividers
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Paper
          id="report-content"
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: 'white',
          }}
        >
          <div id="title-section">
            <Typography variant="h3" sx={{ marginBottom: '20px' }}>
              {allData?.stepName}
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginBottom: '40px', textAlign: 'right' }}
            >
              {allData?.username}
            </Typography>
          </div>
          <Grid container spacing={3}>
            {data.map((stepData, idx) => (
              <Grid item xs={12} key={stepData.stepNum}>
                <Paper
                  id={`step-content-${idx}`}
                  style={{
                    padding: '20px',
                    boxShadow: 'none',
                    marginBottom: '10px', // 간격을 10px로 설정
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div>
                    {stepData.contents.map((content, contentIdx) => (
                      <RenderContent
                        stepIndex={idx + 1}
                        key={`${stepData.stepNum}-${contentIdx}`}
                        content={content}
                        textBoxValue={textBoxDatas}
                        setTextBoxValue={setTextBoxDatas}
                        index={contentIdx}
                        storedPhotoList={storedPhotoList}
                      />
                    ))}
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          취소
        </Button>
        <Button onClick={handleSubmit} color="primary">
          저장
        </Button>
        <Button onClick={handleSavePDF} color="primary">
          PDF 저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function RenderContent({
  stepIndex,
  content,
  textBoxValue,
  setTextBoxValue,
  index,
  storedPhotoList,
}) {
  const handleTextChange = (e, uuid) => {
    setTextBoxValue((prev) => {
      const copied = { ...prev };
      copied[uuid] = e.target.value;
      return copied;
    });
  };
  console.log(textBoxValue);
  console.log(content);
  console.log(stepIndex, index);
  switch (content.type) {
    case 'title':
      return (
        <Typography variant="h6" gutterBottom>
          {content.content}
        </Typography>
      );
    case 'html':
      return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
    case 'textBox':
      return (
        <textarea
          defaultValue={content.content.text}
          value={textBoxValue[content.content.uuid]}
          onChange={(e) => {
            handleTextChange(e, content.content.uuid);
          }}
          placeholder="답변을 입력해주세요"
          className="w-full p-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows="3"
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
              onClick={() => alert('스텝에서 수정해주세요')}
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
              Data & Chart
            </Button>
          </div>

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
            {content.content.photoList !== undefined &&
              content.content.photoList.map((item, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: `<img src="${item}" alt="Chart Image" />`,
                  }}
                />
              ))}
          </div>
        </div>
      );
    case 'data':
      return React.createElement(
        content.content.view.type,
        content.content.view.props,
      );
    case 'emptyBox':
      return (
        <div
          style={{
            border: '1px dashed #ddd',
            padding: '10px',
            textAlign: 'center',
            margin: '10px 0',
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

export default StudentReportModal;
