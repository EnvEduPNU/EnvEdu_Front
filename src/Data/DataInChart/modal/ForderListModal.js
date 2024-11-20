import * as React from 'react';
import { customAxios } from '../../../Common/CustomAxios';
import { useGraphDataStore } from '../store/graphStore';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import ButtonClose from '../component/DrawGraph/ButtonClose';

import { useTabStore } from '../store/tabStore';
import { convertToNumber } from '../store/utils/convertToNumber';
import ReactModal from 'react-modal';
import zIndex from '@mui/material/styles/zIndex';

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: '100%',
    height: '100vh',
    zIndex: '9999',
    position: 'fixed',
    top: '0',
    left: '0',
  },
  content: {
    width: '600px',
    height: '620px',
    zIndex: '150',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'white',
    padding: '20px',
    overflow: 'auto',
  },
};

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
    ITEMITEMCODE: '변인',
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

// Data&Chart 안의 테이블에 들어가는 데이터들을 다루는 컴포넌트 및 모달
export default function ForderListModal({
  filteredData,
  modalOpen,
  setModalOpen,
  dataType,
}) {
  console.log(filteredData);

  const { setData } = useGraphDataStore();

  const getTable = (type, id) => {
    if (type === 'CUSTOM') {
      customAxios
        .get(`api/custom/${id}`)
        .then((res) => {
          //수정 필요
          console.log(res.data.title);
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
          setData(data, title, true, variables);

          // localStorage.setItem('data', JSON.stringify(data));
          // localStorage.setItem('title', JSON.stringify(title));

          setModalOpen(false);
        })
        .catch((err) => console.log(err));
    } else {
      let path = '';
      if (type === '수질 데이터') {
        path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
        customAxios
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
                  if (isNaN(item[key])) newItem[key] = item[key];
                  else newItem[key] = Number(item[key]);
                } else {
                  newItem[key] = null; // 해당 키가 없으면 null로 설정
                }
              });
              return newItem;
            });
            console.log(transformedData);
            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];
            console.log(recombined);
            setData(recombined, res.data[0].title, true);
            setModalOpen(false);
          })
          .catch((err) => console.log(err));
      } else if (type === '대기질 데이터') {
        path = `/air-quality/mine/chunk?dataUUID=${id}`;
        customAxios
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
                  if (isNaN(item[key])) newItem[key] = item[key];
                  else newItem[key] = Number(item[key]);
                } else {
                  newItem[key] = null; // 해당 키가 없으면 null로 설정
                }
              });
              return newItem;
            });
            console.log(transformedData);
            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];
            console.log(recombined);
            setData(recombined, res.data.title, true);
            setModalOpen(false);
          })
          .catch((err) => console.log(err));
      } else if (type === '시도별 대기질 데이터') {
        path = `/air-city-quality/mine/chunk?dataUUID=${id}`;
        customAxios
          .get(path)
          .then((res) => {
            // 남기고 싶은 키 목록
            const keysToKeep = [
              'ITEMITEMCODE',
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
            const transformedData = res.data.map((item) => {
              const newItem = {};
              keysToKeep.forEach((key) => {
                if (item[key] !== undefined) {
                  newItem[key] = item[key];
                } else {
                  newItem[key] = null; // 해당 키가 없으면 null로 설정
                }
              });
              return newItem;
            });
            console.log(transformedData);
            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];
            console.log(recombined);
            setData(recombined, res.data[0].title, true);
            setModalOpen(false);
          })
          .catch((err) => console.log(err));
      } else if (type === 'SEED') {
        path = `/seed/mine/chunk?dataUUID=${id}`;
      } else if (type === '데이터없음') {
        console.log('데이터 없음');
        return;
      }
    }
  };
  console.log(filteredData);
  return (
    <ReactModal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)} // 모달 외부를 클릭하거나 ESC 키로 닫기
      style={customModalStyles}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2
          style={{
            fontWeight: 'bold',
            fontSize: '1.5rem', // 2xl 크기
            margin: '8px 0',
          }}
        >
          {dataType}
        </h2>

        <div
          style={{
            height: '500px',
            overflow: 'auto',
            marginTop: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd', // 테이블 전체 테두리 추가
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead
              style={{
                backgroundColor: '#f0f4f8',
                color: '#333',
                textAlign: 'left',
                borderBottom: '2px solid #ddd',
              }}
            >
              <tr>
                <th
                  style={{
                    padding: '10px 0px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                  }}
                  key="dataLabel"
                >
                  데이터 종류
                </th>
                <th
                  style={{
                    padding: '10px 15px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                  }}
                  key="title"
                >
                  제목
                </th>
                <th
                  style={{
                    padding: '10px 15px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                  }}
                  key="memo"
                >
                  메모
                </th>
                <th
                  style={{
                    padding: '10px 15px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                  }}
                  key="saveDate"
                >
                  저장 일시
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => getTable(item.dataLabel, item.dataUUID)}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#eaf3ff')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? '#ffffff' : '#f9fafb')
                  }
                >
                  <td
                    style={{
                      padding: '10px 15px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {item.dataLabel}
                  </td>
                  <td
                    style={{
                      padding: '10px 15px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {item.title}
                  </td>
                  <td
                    style={{
                      padding: '10px 15px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {item.memo}
                  </td>
                  <td
                    style={{
                      padding: '10px 15px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {item.saveDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setModalOpen(false)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.2s',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c53030';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e53e3e';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>
      </div>
    </ReactModal>
  );
}
