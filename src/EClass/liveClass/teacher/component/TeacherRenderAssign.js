import React, { useEffect, useState } from 'react';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import usePhotoStore from '../../../../Data/DataInChart/store/photoStore'; // Zustand store import
import { customAxios } from '../../../../Common/CustomAxios';
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

// TeacherRenderAssign 컴포넌트는 데이터 배열을 받아 각 항목을 Paper에 렌더링합니다.
function TeacherRenderAssign({ tableData }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    let filteredData = tableData[0].contents;

    const fetchData = async () => {
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
                    ?.map(() => Array(columns).fill(0));

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
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
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
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
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
                    headers = Object.keys(transformedData[0]);

                    headers = headers.map((header) => engToKor(header));

                    dataContent = transformedData.map((item) =>
                      Object.values(item),
                    );
                    // 최종 결과 생성 (헤더 + 값)
                    const recombined = [headers, ...dataContent];
                  })
                  .catch((err) => console.log(err));
              }
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
                            {headers?.map((header, index) => (
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
      setData([newStep]);
    };
    fetchData();
  }, [tableData]);
  const [storedPhotoList, setStoredPhotoList] = useState([]);

  // Zustand store에서 getStorePhotoList 가져오기
  const { getStorePhotoList } = usePhotoStore();

  useEffect(() => {
    // console.log('사진 저장소 확인 : ', getStorePhotoList());
    // 현재 저장된 photoList 가져와서 상태 업데이트
    const photoList = getStorePhotoList();
    setStoredPhotoList(photoList);
  }, []);

  const handleTextBoxSubmit = (text) => {
    console.log('TextBox Submitted:', text);
  };

  const navigate = useNavigate();

  // 이 함수는 페이지를 이동시킵니다.
  const handleNavigate = (dataType, uuid) => {
    // 쿼리 파라미터에 전달할 값 생성
    const id = 'drawGraph';

    // 페이지 이동
    navigate(`/data-in-chart?dataType=${dataType}&uuid=${uuid}`);
  };

  // useEffect(() => {
  //   console.log('data 확인 : ' + JSON.stringify(data, null, 2));
  // }, [data]);
  return (
    <div style={{ width: '100%' }}>
      {data?.map((item) => (
        <Paper
          key={item.uuid}
          style={{
            padding: 30,
            margin: '20px 20px 10px 0',
            height: '510px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'auto', // 넘칠 경우 스크롤을 생성합니다.
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <Typography variant="h4" gutterBottom>
              {item.contentName}
            </Typography>
            {item.contents?.map((content, index) => (
              <RenderContent
                content={content}
                onSubmitTextBox={handleTextBoxSubmit}
                onNavigate={handleNavigate} // handleNavigate를 자식 컴포넌트에 전달
                item={item}
                storedPhotoList={storedPhotoList} // 전달된 storedPhotoList
              />
            ))}
          </div>
        </Paper>
      ))}
    </div>
  );
}

// RenderContent 컴포넌트는 다양한 콘텐츠 타입을 처리합니다.
function RenderContent({
  content,
  onSubmitTextBox,
  onNavigate,
  item,
  contentItem,
  storedPhotoList,
}) {
  const [tableData, setTableData] = useState(null);

  const handleSelectData = async (id) => {
    try {
      const response = await customAxios.get(`api/custom/${id}`);
      const fetchedData = response.data;

      const formattedData = fetchedData.numericFields?.map((field, index) => ({
        ...fetchedData.stringFields[index],
        ...field,
      }));

      setTableData(formattedData); // 테이블 데이터를 상태에 저장
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  };

  switch (content.type) {
    case 'html':
      return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
    case 'textBox':
      return (
        <TextField
          defaultValue="여기에 답변을 입력하세요"
          disabled
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

export default TeacherRenderAssign;
