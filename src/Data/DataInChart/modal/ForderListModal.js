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
    //수질 데이터
    PTNM: '조사지점명',
    WMYR: '측정연도',
    WMOD: '측정월',
    ITEMTEMP: '수온(°C)',
    ITEMPH: 'pH',
    ITEMDOC: 'DO(㎎/L)',
    ITEMBOD: 'BOD(㎎/L)',
    ITEMCOD: 'COD(㎎/L)',
    ITEMTN: '총질소(㎎/L)',
    ITEMTP: '총인(㎎/L)',
    ITEMTRANS: '투명도(㎎/L)',
    ITEMCLOA: '클로로필-a(㎎/L)',
    ITEMEC: '전기전도도(µS/㎝)',
    ITEMTOC: 'TOC(㎎/L)',

    //대기질 데이터
    stationName: '조사지점명',
    dataTime: '측정일',
    so2Value: '아황산가스 농도(ppm)',
    coValue: '일산화탄소 농도(ppm)',
    o3Value: '오존 농도(ppm)',
    no2Value: '이산화질소 농도(ppm)',
    pm10Value: '미세먼지(PM10) 농도(㎍/㎥)',
    pm25Value: '미세먼지(PM2.5)  농도(㎍/㎥)',

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
      } else if (type === '대기질 데이터') {
        path = `/air-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === 'SEED') {
        path = `/seed/mine/chunk?dataUUID=${id}`;
      } else if (type === '데이터없음') {
        console.log('데이터 없음');
        return;
      }

      customAxios
        .get(path)
        .then((res) => {
          console.log(res.data);
          let headers = Object.keys(res.data[0]).filter(
            (key) =>
              key !== 'id' &&
              key !== 'dataUUID' &&
              key !== 'saveDate' &&
              key !== 'dateString' &&
              key !== 'sessionid' &&
              key !== 'memo' &&
              key !== 'dataLabel',
          );

          const attributesToCheck = [
            'co2',
            'dox',
            'dust',
            'hum',
            'hum_EARTH',
            'lux',
            'ph',
            'pre',
            'temp',
            'tur',
          ];

          const keysToExclude = [
            'id',
            'dataUUID',
            'saveDate',
            'dateString',
            'sessionid',
            'unit',
            'memo',
            'dataLabel',
          ];

          for (const attribute of attributesToCheck) {
            const isAllNone = res.data.every(
              (item) => item[attribute] === -99999.0,
            );
            if (isAllNone) {
              // 해당 속성이 모두 -99999.0일 때, keysToExclude에 추가(헤더에 따른 values도 제거해줘야함)
              if (!keysToExclude.includes(attribute)) {
                keysToExclude.push(attribute);
              }
              // 해당 속성이 모두 -99999.0일 때, headers에서 제거
              headers = headers.filter((header) => header !== attribute);
            }
          }

          headers = headers.map((header) => engToKor(header));

          // 중요한 데이터들은 들어온 데이터 리스트에서 제거
          const values = res.data.map((item) => {
            const filteredItem = Object.keys(item)
              .filter((key) => !keysToExclude.includes(key))
              .reduce((obj, key) => {
                obj[key] = convertToNumber(item[key]);
                return obj;
              }, {});

            console.log(
              '값들이 어떻게 필터 되나 : ' + Object.values(filteredItem),
            );
            return Object.values(filteredItem);
          });
          console.log(values);
          // 최종 결과 생성 (헤더 + 값)
          const recombined = [headers, ...values];
          console.log(recombined);
          setData(recombined, '없음', true);
          // localStorage.setItem("data", JSON.stringify(recombined));
          // window.location.reload();
        })
        .catch((err) => console.log(err));
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
