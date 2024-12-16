import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { v4 as uuidv4 } from 'uuid';
import '../../classData/LectureCardCarousel.scss';
import {
  createEclass,
  getEClassDatas,
  putEClassThumbnail,
} from '../api/eclass';
import basicImage from '../../../assets/img/basicImage.png';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { customAxios } from '../../../Common/CustomAxios';
import axios from 'axios';
import { convertToNumber } from '../../../Data/DataInChart/store/utils/convertToNumber';
import { useNavigate } from 'react-router-dom';

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

function LectureCardCarousel({
  lectureSummary,
  getLectureDataTable,
  setClassDatas,
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [moreEditArr, setMoreEditArr] = useState(
    Array(lectureSummary.length).fill(0),
  );

  useEffect(() => {
    setMoreEditArr(Array(lectureSummary.length).fill(false));
  }, [lectureSummary]);

  const nextCard = () => {
    if (currentIndex < lectureSummary.length - 4) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleDeleteLecture = async (uuid, timestamp, index) => {
    // 삭제 확인 대화상자 표시
    const isConfirmed = window.confirm('정말로 이 E-Class를 삭제하시겠습니까?');

    if (!isConfirmed) {
      // 사용자가 삭제를 취소하면 함수 종료
      return;
    }

    try {
      const response = await customAxios.get(
        `/api/eclass/eclass-check?lectureDataUuid=${uuid}`,
      );

      if (response.data) {
        alert('E-Class 실행에서 사용중입니다!');
        navigate('/EClassLivePage');
        return;
      } else {
        await customAxios.delete(
          `/api/steps/deleteLectureContent/${uuid}/${timestamp}`,
        );

        alert('E-Class가 성공적으로 삭제되었습니다.');
        window.location.reload();

        const response = await getEClassDatas();
        setClassDatas(
          response.data
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((item, index) => ({
              uuid: item.uuid,
              thumbImg: item.thumbImg,
              stepName: item.stepName,
              username: item.username,
              timestamp: item.timestamp,
              index,
            })),
        );

        setMoreEditArr((prev) => {
          const copiedMoreEditArr = [...prev];
          copiedMoreEditArr[index] = false;
          return copiedMoreEditArr;
        });
      }
    } catch (error) {
      console.error('Error checking lecture:', error);
      alert('E-Class 검증 중 오류가 발생했습니다.');
    }
  };

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

  const modifyThumbnail = async (e, uuid, timestamp, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await handleUpload(file, uuid);
      await putEClassThumbnail(uuid, timestamp, imageUrl);
      alert('성공적으로 썸네일이 수정되었습니다.');
      const response = await getEClassDatas();
      setClassDatas(
        response.data
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map((item, index) => ({
            uuid: item.uuid,
            thumbImg: item.thumbImg,
            stepName: item.stepName,
            username: item.username,
            timestamp: item.timestamp,
            index,
          })),
      );

      setMoreEditArr((prev) => {
        const copiedMoreEditArr = [...prev];
        copiedMoreEditArr[index] = false;
        return copiedMoreEditArr;
      });
    }
  };
  console.log(lectureSummary);
  console.log(moreEditArr);

  return (
    <div className="carousel-container">
      {/* 카드 목록 */}

      <div className="carousel-cards">
        {/* 왼쪽 화살표 */}
        <IconButton
          onClick={prevCard}
          className="carousel-arrow left-arrow"
          disabled={currentIndex === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>
        {lectureSummary
          .slice(currentIndex, currentIndex + 4)
          .map((lecture, index) => {
            // 이미지가 있는지 확인

            return (
              <div key={index} className="lecture-card">
                <button
                  onClick={(e) => {
                    setMoreEditArr((prev) => {
                      const copiedMoreEditArr = [...prev];
                      copiedMoreEditArr[lecture.index] =
                        !copiedMoreEditArr[lecture.index];
                      return copiedMoreEditArr;
                    });
                    e.stopPropagation(); // 카드 클릭 이벤트가 트리거되지 않도록
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(128, 128, 128, 0.1)'; // 회색 반투명
                    e.target.style.transform = 'scale(1.05)'; // 확대 효과
                    e.target.style.borderRadius = '4px';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white'; // 기본 주황색
                    e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                  }}
                  style={{
                    backgroundColor: '#white', // 기본 배경색
                    color: 'black',
                    position: 'absolute',
                    top: '4px',
                    right: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    transition:
                      'transform 0.2s ease, background-color 0.2s ease', // 부드러운 애니메이션
                  }}
                  aria-label="delete"
                >
                  <AiOutlineEllipsis size="24" />
                </button>
                {moreEditArr[index] && (
                  <div
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      flexDirection: 'column',
                      top: '16px',
                      right: '20px',
                      gap: '8px', // 버튼 간격 추가
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: '#f5f5f5', // 연한 회색 배경
                        color: '#333', // 텍스트 색상
                        border: '1px solid #ccc', // 테두리
                        borderRadius: '4px', // 둥근 모서리
                        fontSize: '14px', // 텍스트 크기
                        cursor: 'pointer', // 포인터 모양
                        transition:
                          'background-color 0.2s ease, transform 0.2s ease', // 부드러운 애니메이션
                        padding: '0 2px',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e0e0e0'; // hover 시 배경색 변경
                        e.target.style.transform = 'scale(1.05)'; // hover 시 확대
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5'; // 기본 배경으로 복구
                        e.target.style.transform = 'scale(1)'; // 크기 복구
                      }}
                      onClick={() => {
                        handleDeleteLecture(
                          lecture.uuid,
                          lecture.timestamp,
                          lecture.index,
                        );
                      }}
                    >
                      삭제
                    </button>

                    <label
                      htmlFor="thumbImageUpload"
                      style={{
                        backgroundColor: '#f5f5f5', // 연한 회색 배경
                        color: '#333', // 텍스트 색상
                        border: '1px solid #ccc', // 테두리
                        borderRadius: '4px', // 둥근 모서리
                        fontSize: '14px', // 텍스트 크기
                        cursor: 'pointer', // 포인터 모양
                        transition:
                          'background-color 0.2s ease, transform 0.2s ease', // 부드러운 애니메이션
                        padding: '0 2px',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e0e0e0'; // hover 시 배경색 변경
                        e.target.style.transform = 'scale(1.05)'; // hover 시 확대
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5'; // 기본 배경으로 복구
                        e.target.style.transform = 'scale(1)'; // 크기 복구
                      }}
                    >
                      썸네일 수정
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="thumbImageUpload"
                      onChange={(e) => {
                        modifyThumbnail(
                          e,
                          lecture.uuid,
                          lecture.timestamp,
                          lecture.index,
                        );
                      }}
                    />
                    <button
                      style={{
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition:
                          'background-color 0.2s ease, transform 0.2s ease',
                        padding: '0 2px',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e0e0e0';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.transform = 'scale(1)';
                      }}
                      onClick={async () => {
                        const response = await getEClassDatas();
                        const eclassData = response.data.filter(
                          (value) => value.uuid === lecture.uuid,
                        )[0];

                        const newEclassContents = [];

                        // 첫 번째 단계: eclassData.contents 반복
                        for (let i = 0; i < eclassData.contents.length; i++) {
                          const step = eclassData.contents[i];
                          const newStep = {
                            stepTitle: step.contentName,
                            contents: [],
                          };

                          // 두 번째 단계: step.contents 반복
                          for (let j = 0; j < step.contents.length; j++) {
                            const content = step.contents[j];

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

                                      data[
                                        Math.floor(table[key].order / columns) +
                                          1
                                      ][table[key].order % columns] =
                                        convertToNumber(table[key].value);
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
                                      data[
                                        Math.floor(table[key].order / columns) +
                                          1
                                      ][table[key].order % columns] =
                                        convertToNumber(table[key].value);
                                    });
                                    console.log(data);
                                    dataContent = data;

                                    // localStorage.setItem('data', JSON.stringify(data));
                                    // localStorage.setItem('title', JSON.stringify(title));

                                    // JSON 데이터를 테이블 형식으로 변환하여 contents에 추가
                                    let headers = dataContent[0];

                                    tableContent = (
                                      <div
                                        style={{
                                          width: 'auto',
                                          overflowX: 'auto',
                                        }}
                                      >
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
                                                      backgroundColor:
                                                        '#f2f2f2',
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
                                              {dataContent.map(
                                                (row, rowIndex) => (
                                                  <tr
                                                    key={rowIndex}
                                                    style={{
                                                      borderBottom:
                                                        '1px solid #ddd',
                                                    }}
                                                  >
                                                    {row.map((item) => (
                                                      <td
                                                        key={`${rowIndex}-${item}`}
                                                        style={{
                                                          border:
                                                            '1px solid #ddd',
                                                          padding: '8px',
                                                          wordWrap:
                                                            'break-word', // 긴 단어를 줄바꿈
                                                          fontSize: '10px', // 테이블 길이에 맞춰서 size 조절 수정해야함
                                                        }}
                                                      >
                                                        {item}
                                                      </td>
                                                    ))}
                                                  </tr>
                                                ),
                                              )}
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
                                      const transformedData =
                                        res.data[0].data.map((item) => {
                                          const newItem = {};
                                          keysToKeep.forEach((key) => {
                                            if (item[key] !== undefined) {
                                              if (item[key] === null) return;
                                              else if (isNaN(item[key]))
                                                newItem[key] = item[key];
                                              else
                                                newItem[key] = Number(
                                                  item[key],
                                                );
                                            } else {
                                              newItem[key] = null; // 해당 키가 없으면 null로 설정
                                            }
                                          });
                                          return newItem;
                                        });
                                      console.log(transformedData);
                                      headers = Object.keys(transformedData[0]);

                                      headers = headers.map((header) =>
                                        engToKor(header),
                                      );

                                      dataContent = transformedData.map(
                                        (item) => Object.values(item),
                                      );
                                      // 최종 결과 생성 (헤더 + 값)
                                      const recombined = [
                                        headers,
                                        ...dataContent,
                                      ];
                                      console.log(recombined);
                                    })
                                    .catch((err) => console.log(err));
                                } else if (
                                  content.content.type === '대기질 데이터'
                                ) {
                                  path = `/air-quality/mine/chunk?dataUUID=${content.content.id}`;
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
                                      const transformedData = res.data.data.map(
                                        (item) => {
                                          const newItem = {};
                                          keysToKeep.forEach((key) => {
                                            if (item[key] !== undefined) {
                                              if (item[key] === null) return;
                                              else if (isNaN(item[key]))
                                                newItem[key] = item[key];
                                              else
                                                newItem[key] = Number(
                                                  item[key],
                                                );
                                            } else {
                                              newItem[key] = null; // 해당 키가 없으면 null로 설정
                                            }
                                          });
                                          return newItem;
                                        },
                                      );
                                      console.log(transformedData);
                                      headers = Object.keys(transformedData[0]);

                                      headers = headers.map((header) =>
                                        engToKor(header),
                                      );

                                      dataContent = transformedData.map(
                                        (item) => Object.values(item),
                                      );
                                      // 최종 결과 생성 (헤더 + 값)
                                      const recombined = [
                                        headers,
                                        ...dataContent,
                                      ];
                                      console.log(recombined);
                                    })
                                    .catch((err) => console.log(err));
                                } else if (
                                  content.content.type ===
                                  '시도별 대기질 데이터'
                                ) {
                                  path = `/city-air-quality/mine/chunk?dataUUID=${content.content.id}`;
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
                                      const transformedData = res.data.data.map(
                                        (item) => {
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
                                        },
                                      );
                                      console.log(transformedData);
                                      headers = Object.keys(transformedData[0]);

                                      headers = headers.map((header) =>
                                        engToKor(header),
                                      );

                                      dataContent = transformedData.map(
                                        (item) => Object.values(item),
                                      );
                                      // 최종 결과 생성 (헤더 + 값)
                                      const recombined = [
                                        headers,
                                        ...dataContent,
                                      ];
                                      console.log(recombined);
                                    })
                                    .catch((err) => console.log(err));
                                }
                                console.log(dataContent);
                                tableContent = (
                                  <div
                                    style={{ width: 'auto', overflowX: 'auto' }}
                                  >
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
                                              style={{
                                                borderBottom: '1px solid #ddd',
                                              }}
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

                          newEclassContents.push(newStep);
                        }

                        const postData = {
                          uuid: uuidv4(),
                          username: localStorage.getItem('username'),
                          timestamp: new Date().toISOString(),
                          stepName: eclassData.stepName + '복제본',
                          stepCount: newEclassContents.length,
                          thumbImg: eclassData.thumbImg,
                          contents: newEclassContents.map(
                            (eclassContent, stepIndex) => ({
                              stepNum: stepIndex + 1,
                              contentName: eclassContent.stepTitle,
                              contents: [
                                ...eclassContent.contents.map((content) => {
                                  if (content.type === 'textBox') {
                                    return {
                                      type: 'textBox',
                                      content: '답변을 이곳에 입력해주세요',
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
                                      content: content.content,
                                      x: null,
                                      y: null,
                                    };
                                  }
                                }),
                              ],
                            }),
                          ),
                        };
                        try {
                          await createEclass(postData);
                          alert('수업이 정상적으로 복제 되었습니다.');
                          const response = await getEClassDatas();
                          setClassDatas(
                            response.data
                              .sort(
                                (a, b) =>
                                  new Date(b.timestamp) - new Date(a.timestamp),
                              )
                              .map((item, index) => ({
                                uuid: item.uuid,
                                thumbImg: item.thumbImg,
                                stepName: item.stepName,
                                username: item.username,
                                timestamp: item.timestamp,
                                index,
                              })),
                          );
                        } catch (e) {
                          console.log(e);
                        }
                      }}
                    >
                      EClass 복제
                    </button>
                  </div>
                )}
                <div
                  className="lecture-content"
                  onClick={() =>
                    getLectureDataTable(lecture.uuid, lecture.timestamp)
                  }
                >
                  {lecture.thumbImg ? (
                    <img
                      style={{
                        height: '160px',
                      }}
                      src={lecture.thumbImg}
                      alt={lecture.stepName}
                      className="lecture-image"
                    />
                  ) : (
                    <img
                      style={{
                        height: '160px',
                      }}
                      src={basicImage}
                      alt={lecture.stepName}
                      className="lecture-image"
                    />
                  )}
                  <h3>{lecture.stepName}</h3>
                  <p>{lecture.timestamp.split('T')[0]}</p>
                </div>
              </div>
            );
          })}
        {/* 오른쪽 화살표 */}
        <IconButton
          onClick={nextCard}
          className="carousel-arrow right-arrow"
          disabled={currentIndex >= lectureSummary.length - 4}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default LectureCardCarousel;
