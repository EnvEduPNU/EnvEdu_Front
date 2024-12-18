import { Step, StepLabel, Stepper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import './customContainer.css';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';
import { BsFillTrashFill } from 'react-icons/bs';
import DataTableButton from '../liveClass/teacher/component/button/DataTableButton';
import { customAxios } from '../../Common/CustomAxios';
import { convertToNumber } from '../../Data/DataInChart/store/utils/convertToNumber';
import { createEclass } from './api/eclass';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import basicImage from '../../assets/img/basicImage.png';
import VideoLinkModal from './modal/VideoLinkModal';
import { useNavigate } from 'react-router-dom';
import { BiSolidVideos } from 'react-icons/bi';
import { BiImageAdd } from 'react-icons/bi';
import EclassFinishModal from './modal/EclassFinishModal';

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

function CreateClassPage() {
  const navigate = useNavigate();
  const [eclassTitle, setEclassTitle] = useState('');
  const [eclassContents, setEclassContents] = useState([
    {
      stepTitle: '스텝1',
      contents: [],
    },
  ]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [quillData, setQuillData] = useState(null);
  const [summary, setSummary] = useState([]);
  const [classUUID] = useState(uuidv4());
  const [isEnd, setIsEnd] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState(basicImage);
  const [videoLink, setVideoLink] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isEclassFinishModal, setIsEclassFinishModal] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');

    const fetchData = async () => {
      try {
        const myDataResponse = await customAxios.get('/mydata/list');
        const myDataFormatted = myDataResponse.data.map((data) => ({
          ...data,
          saveDate: data.saveDate.split('T')[0],
          dataLabel:
            data.dataLabel === 'AIRQUALITY'
              ? '대기질 데이터'
              : data.dataLabel === 'OCEANQUALITY'
              ? '수질 데이터'
              : data.dataLabel === 'CITYAIRQUALITY'
              ? '시도별 대기질 데이터'
              : data.dataLabel,
        }));

        const customDataResponse = await customAxios.get(
          `/api/custom/list?username=${username}`,
        );

        const customDataFormatted = customDataResponse.data.map((data) => ({
          ...data,
          saveDate: data.saveDate.split('T')[0],
          dataLabel:
            data.dataLabel === 'CUSTOM' ? '커스텀 데이터' : data.dataLabel,
          dynamicFields: data.dynamicFields || {},
        }));

        const combinedData = [...myDataFormatted, ...customDataFormatted];
        setSummary(combinedData);
      } catch (error) {
        console.error('데이터 가져오기 중 오류:', error);
      }
    };

    fetchData();
  }, []);

  // 이미지 파일 업로드 메서드
  const handleUpload = async (file, contentUuid) => {
    try {
      // Pre-signed URL을 가져오는 요청
      const response = await customAxios.get('/api/images/presigned-url', {
        params: { fileName: contentUuid },
      });

      const { preSignedUrl, imageUrl } = response.data;
      const contentType = file.type; // 파일의 MIME 타입을 사용

      //S3로 이미지 업로드
      await axios.put(preSignedUrl, file, {
        headers: {
          'Content-Type': contentType,
        },
      });

      console.log('이미지 업로드 성공');
      alert('이미지 업로드 성공');

      return imageUrl; // S3에 업로드된 이미지 URL 반환
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      throw error;
    }
  };

  const handleSelectData = async (type, id, type2) => {
    if (type2 === 'graph') {
      for (let i = 0; i < eclassContents[0].contents.length; i++) {
        if (eclassContents[0].contents[i].type === 'dataInChartButton') {
          alert('그래프 그리기는 1개까지 가능합니다.');
          return;
        }
      }
      try {
        let path = '';
        let dataContent;
        console.log(type);
        if (type === '커스텀 데이터') {
          customAxios
            .get(`api/custom/${id}`)
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
                (res.data.numericFields.length + res.data.stringFields.length) /
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

              const tableContent = (
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

              setEclassContents((prev) => {
                const tempEclassContents = prev.map((eclassContent) => ({
                  ...eclassContent,
                  contents: [...eclassContent.contents],
                }));

                tempEclassContents[activeStepIndex].contents.push({
                  type: 'dataInChartButton',
                  content: {
                    view: tableContent,
                    content: { dataType: type, id },
                  },
                });

                return tempEclassContents;
              });
            })
            .catch((err) => console.log(err));
        } else {
          let headers = [];
          let path = '';

          if (type === '수질 데이터') {
            path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
            await customAxios
              .get(path)
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
          } else if (type === '대기질 데이터') {
            path = `/air-quality/mine/chunk?dataUUID=${id}`;
            await customAxios
              .get(path)
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
          } else if (type === '시도별 대기질 데이터') {
            path = `/city-air-quality/mine/chunk?dataUUID=${id}`;
            await customAxios
              .get(path)
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
          const tableContent = (
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

          setEclassContents((prev) => {
            const tempEclassContents = prev.map((eclassContent) => ({
              ...eclassContent,
              contents: [...eclassContent.contents],
            }));

            tempEclassContents[activeStepIndex].contents.push({
              type: 'dataInChartButton',
              content: {
                view: tableContent,
                content: { dataType: type, id },
              },
            });

            return tempEclassContents;
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else
      try {
        let path = '';
        let dataContent;
        console.log(type);
        if (type === '커스텀 데이터') {
          customAxios
            .get(`api/custom/${id}`)
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
                (res.data.numericFields.length + res.data.stringFields.length) /
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

              const tableContent = (
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

              setEclassContents((prev) => {
                const tempEclassContents = prev.map((eclassContent) => ({
                  ...eclassContent,
                  contents: [...eclassContent.contents],
                }));

                tempEclassContents[activeStepIndex].contents.push({
                  type: 'data',
                  content: {
                    view: tableContent,
                    id,
                    type: '커스텀 데이터',
                  },
                });

                return tempEclassContents;
              });
            })
            .catch((err) => console.log(err));
        } else {
          let headers = [];
          let path = '';

          if (type === '수질 데이터') {
            path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
            await customAxios
              .get(path)
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
          } else if (type === '대기질 데이터') {
            path = `/air-quality/mine/chunk?dataUUID=${id}`;
            await customAxios
              .get(path)
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
          } else if (type === '시도별 대기질 데이터') {
            path = `/city-air-quality/mine/chunk?dataUUID=${id}`;
            await customAxios
              .get(path)
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
          const tableContent = (
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
          setEclassContents((prev) => {
            const tempEclassContents = prev.map((eclassContent) => ({
              ...eclassContent,
              contents: [...eclassContent.contents],
            }));

            tempEclassContents[activeStepIndex].contents.push({
              type: 'data',
              content: {
                view: tableContent,
                id,
                type,
              },
            });

            return tempEclassContents;
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  const addStep = () => {
    if (eclassContents.length === 6) {
      alert('최대 스텝 개수는 6개입니다.');
      return;
    }
    setEclassContents((prev) => {
      const tempEclassContents = prev.map((eclassContent) => ({
        ...eclassContent,
        contents: [...eclassContent.contents],
      }));
      tempEclassContents.push({
        stepTitle: '추가된 스텝',
        contents: [],
      });
      return tempEclassContents;
    });
  };
  const deleteCurStep = (filteredIndex) => {
    if (filteredIndex === 0) setActiveStepIndex(0);
    else setActiveStepIndex(activeStepIndex - 1);
    setEclassContents((prev) => {
      const tempEclassContents = prev.map((eclassContent) => ({
        ...eclassContent,
        contents: [...eclassContent.contents],
      }));
      return tempEclassContents.filter(
        (value, index) => index !== filteredIndex,
      );
    });
  };

  const moveUp = (index) => {
    if (index === 0) return;

    setEclassContents((prev) => {
      const tempEclassContents = prev.map((eclassContent) => ({
        ...eclassContent,
        contents: [...eclassContent.contents],
      }));

      const tempContens =
        tempEclassContents[activeStepIndex].contents[index - 1];
      tempEclassContents[activeStepIndex].contents[index - 1] =
        tempEclassContents[activeStepIndex].contents[index];
      tempEclassContents[activeStepIndex].contents[index] = tempContens;

      return tempEclassContents;
    });
  };

  const moveDown = (index) => {
    if (index === eclassContents[activeStepIndex].contents.length - 1) return;

    setEclassContents((prev) => {
      const tempEclassContents = prev.map((eclassContent) => ({
        ...eclassContent,
        contents: [...eclassContent.contents],
      }));

      const tempContens =
        tempEclassContents[activeStepIndex].contents[index + 1];
      tempEclassContents[activeStepIndex].contents[index + 1] =
        tempEclassContents[activeStepIndex].contents[index];
      tempEclassContents[activeStepIndex].contents[index] = tempContens;

      return tempEclassContents;
    });
  };

  const deleteItem = (deletedIndex) => {
    setEclassContents((prev) => {
      const tempEclassContents = prev.map((eclassContent) => ({
        ...eclassContent,
        contents: [...eclassContent.contents],
      }));

      tempEclassContents[activeStepIndex].contents = tempEclassContents[
        activeStepIndex
      ].contents.filter((value, index) => deletedIndex !== index);

      console.log(tempEclassContents);

      return tempEclassContents;
    });
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await handleUpload(file, classUUID);

      if (type === 'image')
        setEclassContents((prev) => {
          const tempEclassContents = prev.map((eclassContent) => ({
            ...eclassContent,
            contents: [...eclassContent.contents],
          }));

          tempEclassContents[activeStepIndex].contents.push({
            type: 'img',
            url: imageUrl,
            file,
          });

          console.log(tempEclassContents);

          return tempEclassContents;
        });
      else setThumbnailImage(imageUrl);
    }
  };

  console.log(eclassContents);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <EclassFinishModal
        isOpen={isEclassFinishModal}
        setIsOpen={setIsEclassFinishModal}
        handleClose={() => {
          setIsEclassFinishModal(false);
          navigate('/EClassLivePage');
        }}
        handleMove={() => {
          setIsEclassFinishModal(false);
          navigate('/classList');
        }}
      />
      <VideoLinkModal
        isOpen={isVideoModalOpen}
        setIsOpen={setIsVideoModalOpen}
        videoLink={videoLink}
        setVideoLink={setVideoLink}
        handleClose={() => {
          setEclassContents((prev) => {
            const tempEclassContents = prev.map((eclassContent) => ({
              ...eclassContent,
              contents: [...eclassContent.contents],
            }));
            tempEclassContents[activeStepIndex].contents = [
              ...tempEclassContents[activeStepIndex].contents,
              {
                type: 'html',
                content: `<iframe class="ql-video" frameborder="0" allowfullscreen="true" src=${videoLink}></iframe>`,
              },
            ];
            return tempEclassContents;
          });
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          padding: '16px',
          margin: '0 0 20px 0',
          border: '1px solid #d1d5db', // Tailwind의 border-gray-300
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 강조를 위한 그림자
          backgroundColor: '#ffffff', // 배경색 (흰색)
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white', // Tailwind의 bg-gray-100
            marginRight: '115px',
          }}
        >
          <h1
            style={{
              width: '110px',
              fontSize: '1.5rem', // Tailwind의 text-2xl
              fontWeight: '600', // Tailwind의 font-semibold
              color: '#1f2937', // Tailwind의 text-gray-800
            }}
          >
            수업 제목
          </h1>
          <input
            type="text"
            placeholder="수업 제목을 입력하세요"
            style={{
              width: '800px',
              lineHeight: '36px',
              padding: '8px 16px',
              fontSize: '1rem',
              color: '#374151', // Tailwind의 text-gray-700
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db', // Tailwind의 border-gray-300
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', // Tailwind의 shadow-sm
              outline: 'none',
              transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 2px #3b82f6'; // Tailwind의 focus:ring-2 focus:ring-blue-500
              e.target.style.borderColor = '#3b82f6'; // Tailwind의 focus:border-blue-500
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.borderColor = '#d1d5db';
            }}
            value={eclassTitle}
            onChange={(e) => {
              setEclassTitle(e.target.value);
            }}
          />
        </div>
        <hr
          style={{
            width: '100%',
            borderTop: '1.8px solid #d1d5db', // Tailwind의 border-gray-300
            margin: '20px 0px 0px 0px', // 간격 추가
          }}
        />

        <div style={{ display: 'flex' }}>
          <Stepper
            activeStep={activeStepIndex}
            style={{ width: '920px', overflow: 'auto' }}
          >
            {eclassContents.map((eclassContent, index) => (
              <Step key={index}>
                <StepLabel
                  sx={{
                    transition: 'color 0.3s, transform 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      cursor: 'pointer',
                      color: '#3b82f6', // Tailwind의 focus:ring-blue-500 색상
                      transform: 'scale(1.1)',
                    },
                  }}
                  onClick={() => {
                    setActiveStepIndex(index);
                  }}
                >
                  <input
                    style={{
                      width: '100px',
                      lineHeight: '20px',
                      padding: '2px 6px',
                      fontSize: '12px',
                      color: '#374151', // Tailwind의 text-gray-700
                      backgroundColor: '#ffffff', // Tailwind의 bg-white
                      border: '1px solid #d1d5db', // Tailwind의 border-gray-300
                      borderRadius: '6px', // 둥근 모서리
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', // Tailwind의 shadow-sm
                      outline: 'none',
                      transition: 'box-shadow 0.2s, border-color 0.2s',
                    }}
                    type="text"
                    value={eclassContent.stepTitle}
                    placeholder="스텝 이름 입력"
                    onChange={(e) => {
                      setEclassContents((prev) => {
                        const tempEclassContents = prev.map(
                          (eclassContent) => ({
                            ...eclassContent,
                            contents: [...eclassContent.contents],
                          }),
                        );
                        tempEclassContents[index].stepTitle = e.target.value;
                        return tempEclassContents;
                      });
                    }}
                  />
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <button
              style={{
                display: 'inline-block',
                marginRight: '2px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#fff',
                backgroundColor: '#4caf50',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#388e3c')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4caf50')}
              onClick={() => {
                addStep();
              }}
            >
              스텝 추가
            </button>
            <button
              style={{
                display: 'inline-block',
                marginLeft: '2px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#fff',
                backgroundColor: '#f44336',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#d32f2f')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#f44336')}
              onClick={() => {
                deleteCurStep(activeStepIndex);
              }}
            >
              현재 스텝 삭제
            </button>
          </div>
        </div>
      </div>

      {isEnd ? (
        <div
          style={{
            display: 'flex',
            width: '1200px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '450px',
            border: '1px solid #d1d5db', // Tailwind의 border-gray-300
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 강조를 위한 그림자
            backgroundColor: '#ffffff', // 배경색 (흰색)
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              fontWeight: '500',
              marginBottom: '24px',
            }}
          >
            Finish 버튼으로 E-Class 생성을 완료하세요.
          </span>
          <div>
            <img
              src={thumbnailImage}
              style={{
                height: '200px',
                marginBottom: '40px',
              }}
            />
          </div>
          <div>
            <button
              style={{
                width: '180px',
                textAlign: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: '#8E44AD', // 기본 색상 (짙은 보라색)
                color: '#FFFFFF',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                outline: 'none',
                marginRight: '10px',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#A569BD'; // 마우스 오버 시 밝은 보라색
                e.target.style.transform = 'scale(1.05)'; // 확대 효과
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#8E44AD'; // 기본 보라색
                e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
              }}
              onClick={() => {
                setIsEnd(false);
              }}
            >
              뒤로 가기
            </button>

            <label
              htmlFor="thumbImageUpload"
              style={{
                width: '180px',
                textAlign: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: '#8E44AD', // 기본 색상 (짙은 보라색)
                color: '#FFFFFF',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                outline: 'none',
                marginRight: '10px',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#A569BD'; // 마우스 오버 시 밝은 보라색
                e.target.style.transform = 'scale(1.05)'; // 확대 효과
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#8E44AD'; // 기본 보라색
                e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
              }}
            >
              썸네일 이미지 추가
            </label>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="thumbImageUpload"
              onChange={(e) => {
                handleFileChange(e, 'thumb');
              }}
            />

            <button
              style={{
                width: '120px',
                padding: '0.5rem 1rem',
                backgroundColor: '#FF9800', // 새로운 색상 (주황색)
                color: '#FFFFFF',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                outline: 'none',
                marginRight: '10px',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#FFA500'; // 마우스 오버 시 밝은 주황색
                e.target.style.transform = 'scale(1.05)'; // 확대 효과
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#FF9800'; // 기본 주황색
                e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
              }}
              onClick={async () => {
                const postData = {
                  uuid: classUUID,
                  username: localStorage.getItem('username'),
                  timestamp: new Date().toISOString(),
                  stepName: eclassTitle,
                  stepCount: eclassContents.length,
                  thumbImg: thumbnailImage,
                  contents: eclassContents.map((eclassContent, stepIndex) => ({
                    stepNum: stepIndex + 1,
                    contentName: eclassContent.stepTitle,
                    contents: [
                      ...eclassContent.contents.map((content) => {
                        if (content.type === 'textBox') {
                          return {
                            type: 'textBox',
                            content: {
                              text: '답변을 이곳에 입력해주세요',
                              uuid: uuidv4(),
                            },
                            x: null,
                            y: null,
                          };
                        }
                        if (content.type === 'html') {
                          return {
                            type: content.type,
                            content: content.content,
                            x: null,
                            y: null,
                          };
                        }
                        if (content.type === 'img') {
                          return {
                            type: content.type,
                            content: content.url,
                            x: null,
                            y: null,
                          };
                        }
                        if (content.type === 'data') {
                          return {
                            type: content.type,
                            content: {
                              id: content.content.id,
                              type: content.content.type,
                            },
                            x: null,
                            y: null,
                          };
                        }

                        if (content.type === 'dataInChartButton') {
                          return {
                            type: content.type,
                            content: {
                              dataType: content.content.content.dataType,
                              id: content.content.content.id,
                            },
                            x: null,
                            y: null,
                          };
                        }
                      }),
                    ],
                  })),
                };
                try {
                  await createEclass(postData);
                  setIsEclassFinishModal(true);
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              FINISH
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
          }}
        >
          {/* 왼쪽에 과제 만드는 미리보기란에 랜더링 되는 곳 */}
          <div
            style={{
              width: '750px',
              height: '700px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              overflowY: 'auto',
              margin: '0 20px 80px 0px',
            }}
            className="custom-html-container ql-editor"
          >
            {eclassContents.length > 0 &&
              eclassContents[activeStepIndex].contents.map((item, index) => (
                <div
                  style={{
                    fontFamily: 'Arial',
                  }}
                >
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      margin: '5px 0',
                    }}
                  >
                    {/* 아이템 콘텐츠(답변 박스, 글 상자) */}
                    {(item.type === 'textBox' || item.type === 'html') && (
                      <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    )}
                    {/* 아이템 콘텐츠(이미지) */}
                    {item.type === 'img' && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<img src=${item.url} />`,
                        }}
                      />
                    )}

                    {/* 아이템 콘텐츠(테이블) */}
                    {item.type === 'data' &&
                      React.createElement(
                        item.content.view.type,
                        item.content.view.props,
                      )}

                    {/* 아이템 콘텐츠(그래프) */}
                    {item.type === 'dataInChartButton' && (
                      <div>
                        <button
                          style={{
                            width: '180px',
                            textAlign: 'center',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#8E44AD', // 기본 색상 (짙은 보라색)
                            color: '#FFFFFF',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            border: 'none',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                            transition:
                              'background-color 0.3s ease, transform 0.2s ease',
                            outline: 'none',
                            marginRight: '10px',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#A569BD'; // 마우스 오버 시 밝은 보라색
                            e.target.style.transform = 'scale(1.05)'; // 확대 효과
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#8E44AD'; // 기본 보라색
                            e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                          }}
                          onClick={() => {
                            alert(
                              '학생은 페이지를 이동하여 그래프를 그릴 수 있습니다.',
                            );
                          }}
                        >
                          그래프 그리러 가기
                        </button>
                        {React.createElement(
                          item.content.view.type,
                          item.content.view.props,
                        )}
                      </div>
                    )}
                    {/* 아이콘 버튼 */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '1px',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <GoTriangleUp
                          onClick={() => moveUp(index)}
                          style={{
                            cursor: 'pointer',
                            fontSize: '24px', // 아이콘 크기 증가
                            color: '#007bff', // 기본 색상 파란색
                            transition: 'transform 0.2s ease', // 부드러운 애니메이션 효과
                          }}
                          title="Move Up"
                        />
                        <GoTriangleDown
                          onClick={() => moveDown(index)}
                          style={{
                            cursor: 'pointer',
                            fontSize: '24px', // 아이콘 크기 증가
                            color: '#007bff', // 기본 색상 파란색
                            transition: 'transform 0.2s ease', // 부드러운 애니메이션 효과
                          }}
                          title="Move Down"
                        />
                      </div>

                      <BsFillTrashFill
                        onClick={() => deleteItem(index)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '24px', // 아이콘 크기 증가
                          color: '#e74c3c', // 삭제 버튼 빨간색
                        }}
                        title="Delete"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            {/* 오른쪽 WordProcessor 편집창 */}
            <ReactQuill
              //   ref={quillRef}
              style={{ width: '420px', height: '200px', margin: '0 0 60px' }}
              //   modules={modules}
              //   formats={formats}
              value={quillData}
              onChange={setQuillData}
              placeholder="내용을 입력하세요..."
            />
            <div>
              <button
                style={{
                  width: '120px',
                  padding: '0.6rem 0',
                  backgroundColor: '#FF9800', // 주황색 기본 배경
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  marginRight: '12px',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#FFA726'; // 밝은 주황색
                  e.target.style.transform = 'scale(1.07)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#FF9800'; // 원래 색상
                  e.target.style.transform = 'scale(1)';
                }}
                onClick={() => {
                  setEclassContents((prev) => {
                    const tempEclassContents = prev.map((eclassContent) => ({
                      ...eclassContent,
                      contents: [...eclassContent.contents],
                    }));
                    tempEclassContents[activeStepIndex].contents = [
                      ...tempEclassContents[activeStepIndex].contents,
                      {
                        type: 'html',
                        content: quillData,
                      },
                    ];
                    return tempEclassContents;
                  });

                  setQuillData(null);
                }}
              >
                글상자 +
              </button>
              <button
                style={{
                  width: '120px',
                  padding: '0.6rem 0',
                  backgroundColor: '#FF9800', // 주황색 기본 배경
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  marginRight: '12px',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#FFA726'; // 밝은 주황색
                  e.target.style.transform = 'scale(1.07)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#FF9800'; // 원래 색상
                  e.target.style.transform = 'scale(1)';
                }}
                onClick={() => {
                  setEclassContents((prev) => {
                    const tempEclassContents = prev.map((eclassContent) => ({
                      ...eclassContent,
                      contents: [...eclassContent.contents],
                    }));
                    tempEclassContents[activeStepIndex].contents = [
                      ...tempEclassContents[activeStepIndex].contents,
                      {
                        type: 'textBox',
                        content: `<textarea
              style="width: 550px; height: 150px; padding: 10px; fontSize: 16px; lineHeight: 1.5; color: #374151; border: 1px solid #D1D5DB; borderRadius: 8px; boxShadow: 0px 4px 10px rgba(0, 0, 0, 0.1); outline: none; resize: vertical; backgroundColor: #F9FAFB;";
              placeholder="학생이 여기에 답변을 입력합니다"
              disabled />`,
                      },
                    ];
                    return tempEclassContents;
                  });
                }}
              >
                답변 박스 +
              </button>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '10px',
                  gap: '10px',
                }}
              >
                <button
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: '#FF9800',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    if (e.target === e.currentTarget) {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (e.target === e.currentTarget) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                  onClick={() => {
                    setIsVideoModalOpen(true);
                  }}
                >
                  <BiSolidVideos size="24px" />
                </button>

                <label
                  htmlFor="imageUpload"
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: '#FF9800',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    if (e.target === e.currentTarget) {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (e.target === e.currentTarget) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <BiImageAdd size="24px" />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="imageUpload"
                  onChange={(e) => {
                    handleFileChange(e, 'image');
                  }}
                />

                <DataTableButton
                  summary={summary}
                  onSelectData={handleSelectData}
                  type="table"
                />
                <DataTableButton
                  summary={summary}
                  onSelectData={handleSelectData}
                  type="graph"
                />
              </div>

              {/* <div
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <button
                  style={{
                    width: '120px',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#FF9800', // 새로운 색상 (주황색)
                    color: '#FFFFFF',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                    transition:
                      'background-color 0.3s ease, transform 0.2s ease',
                    outline: 'none',
                    marginRight: '10px',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#FFA500'; // 마우스 오버 시 밝은 주황색
                    e.target.style.transform = 'scale(1.05)'; // 확대 효과
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#FF9800'; // 기본 주황색
                    e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                  }}
                  onClick={() => {
                    setEclassContents((prev) => {
                      const tempEclassContents = prev.map((eclassContent) => ({
                        ...eclassContent,
                        contents: [...eclassContent.contents],
                      }));
                      tempEclassContents[activeStepIndex].contents = [
                        ...tempEclassContents[activeStepIndex].contents,
                        {
                          type: 'html',
                          content: quillData,
                        },
                      ];
                      return tempEclassContents;
                    });

                    setQuillData(null);
                  }}
                >
                  글상자 포함
                </button>
                <button
                  style={{
                    width: '140px',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#FF9800', // 새로운 색상 (주황색)
                    color: '#FFFFFF',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                    transition:
                      'background-color 0.3s ease, transform 0.2s ease',
                    outline: 'none',
                    marginRight: '10px',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#FFA500'; // 마우스 오버 시 밝은 주황색
                    e.target.style.transform = 'scale(1.05)'; // 확대 효과
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#FF9800'; // 기본 주황색
                    e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                  }}
                  onClick={() => {
                    setEclassContents((prev) => {
                      const tempEclassContents = prev.map((eclassContent) => ({
                        ...eclassContent,
                        contents: [...eclassContent.contents],
                      }));
                      tempEclassContents[activeStepIndex].contents = [
                        ...tempEclassContents[activeStepIndex].contents,
                        {
                          type: 'textBox',
                          content: `<textarea
                style="width: 550px; height: 150px; padding: 10px; fontSize: 16px; lineHeight: 1.5; color: #374151; border: 1px solid #D1D5DB; borderRadius: 8px;  boxShadow: 0px 4px 10px rgba(0, 0, 0, 0.1); outline: none; resize: vertical; backgroundColor: #F9FAFB";
                placeholder="학생이 여기에 답변을 입력합니다"
                disabled/>`,
                        },
                      ];
                      return tempEclassContents;
                    });
                  }}
                >
                  답변 박스 추가
                </button>
              </div> */}
              {/* <div
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <button
                  style={{
                    width: '120px',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#FF9800', // 새로운 색상 (주황색)
                    color: '#FFFFFF',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                    transition:
                      'background-color 0.3s ease, transform 0.2s ease',
                    outline: 'none',
                    marginRight: '10px',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#FFA500'; // 마우스 오버 시 밝은 주황색
                    e.target.style.transform = 'scale(1.05)'; // 확대 효과
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#FF9800'; // 기본 주황색
                    e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                  }}
                  onClick={() => {
                    setIsVideoModalOpen(true);
                  }}
                >
                  동영상 추가
                </button>
                <label
                  htmlFor="imageUpload"
                  style={{
                    width: '120px',
                    textAlign: 'center',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#FF9800', // 새로운 색상 (주황색)
                    color: '#FFFFFF',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                    transition:
                      'background-color 0.3s ease, transform 0.2s ease',
                    outline: 'none',
                    marginRight: '10px',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#FFA500'; // 마우스 오버 시 밝은 주황색
                    e.target.style.transform = 'scale(1.05)'; // 확대 효과
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#FF9800'; // 기본 주황색
                    e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                  }}
                >
                  이미지 추가
                </label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="imageUpload"
                  onChange={(e) => {
                    handleFileChange(e, 'image');
                  }}
                />
              </div> */}

              {/* <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              > */}
              {/* 데이터 추가하기 버튼 */}
              {/* <DataTableButton
                  summary={summary}
                  onSelectData={handleSelectData}
                  type="table"
                />
                <DataTableButton
                  summary={summary}
                  onSelectData={handleSelectData}
                  type="graph"
                />
              </div> */}
            </div>
            <button
              style={{
                width: '170px',
                padding: '0.5rem 1rem',
                backgroundColor: '#6A1B9A', // 기본 색상 (보라색)
                color: '#FFFFFF',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                outline: 'none',
                marginLeft: '250px',
                marginTop: '100px',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#AB47BC'; // 마우스 오버 시 밝은 보라색
                e.target.style.transform = 'scale(1.05)'; // 확대 효과
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#6A1B9A'; // 기본 보라색
                e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
              }}
              onClick={async () => {
                setIsEnd(true);
              }}
            >
              수업 생성
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateClassPage;
