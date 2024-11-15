import React, { useEffect, useState } from 'react';
import { saveAirByPlace } from '../apis/air';

function AirPlaceList({ airDataList }) {
  const headers = [
    '측정 장소',
    '측정 일',
    '이산화질소 농도(ppm)',
    '오존 농도(ppm)',
    '미세먼지(PM10) 농도(㎍/㎥)',
    '미세먼지(PM2.5) 농도(㎍/㎥)',
    '아황산가스 농도(ppm)',
  ];

  const getRowData = (item) => [
    item.stationName,
    item.date,
    item.no2,
    item.o3,
    item.pm10,
    item.pm25,
    item.so2Value,
  ];

  const getRowDataToServer = (item) => [
    {
      key: 'stationName',
      value: item.stationName,
    },
    {
      key: 'ITEMDATE',
      value: item.date,
    },
    {
      key: 'ITEMNO2',
      value: item.no2,
    },
    {
      key: 'ITEMO3',
      value: item.o3,
    },
    {
      key: 'ITEMPM10',
      value: item.pm10,
    },
    {
      key: 'ITEMPM25',
      value: item.pm25,
    },
    {
      key: 'ITEMSO2VALUE',
      value: item.so2Value,
    },
  ];

  const [filteredColumns, setFilteredColumns] = useState(
    new Array(headers.length).fill(true),
  );

  const [filteredRows, setFilteredRows] = useState(
    new Array(airDataList.length).fill(false),
  );

  const toggleColumn = (index) => {
    setFilteredColumns((prev) =>
      prev.map((value, idx) => (idx === index ? !value : value)),
    );
  };

  const toggleRow = (index) => {
    setFilteredRows((prev) =>
      prev.map((value, idx) => (idx === index ? !value : value)),
    );
  };

  useEffect(() => {
    setFilteredRows(new Array(airDataList.length).fill(false));
  }, [airDataList]);

  return (
    <div
      style={{
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {airDataList.length === 0 ? (
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#F3F4F6',
            color: '#374151',
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '80%',
          }}
        >
          <p style={{ fontSize: '1.25rem', fontWeight: '500' }}>
            데이터를 찾을 수 없습니다.
          </p>
          <p style={{ fontSize: '1rem', color: '#6B7280' }}>
            새로운 데이터를 불러오거나 조건을 다시 설정해주세요.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              minWidth: '100%',
              backgroundColor: '#ffffff',
              border: '1px solid #D1D5DB',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#E5E7EB',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                }}
              >
                <th
                  key="checkboxHeader"
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex' }}>선택</div>
                </th>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #D1D5DB',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleColumn(index)}
                  >
                    <div style={{ display: 'flex' }}>
                      <input
                        type="checkbox"
                        checked={filteredColumns[index]}
                        readOnly
                        style={{ marginRight: '0.5rem', width: '16px' }}
                      />
                      {header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {airDataList.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    textAlign: 'center',
                    backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#F3F4F6')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? '#F9FAFB' : '#FFFFFF')
                  }
                >
                  <td
                    key="checkbox"
                    style={{
                      padding: '0.75rem 1.5rem',
                      border: '1px solid #D1D5DB',
                    }}
                    onClick={() => toggleRow(index)}
                  >
                    <input
                      type="checkbox"
                      checked={filteredRows[index]}
                      readOnly
                      style={{ marginRight: '0.5rem', width: '16px' }}
                    />
                  </td>
                  {getRowData(item).map((value, idx) =>
                    filteredColumns[idx] ? (
                      <td
                        key={idx}
                        style={{
                          padding: '0.75rem 1.5rem',
                          border: '1px solid #D1D5DB',
                        }}
                      >
                        {value}
                      </td>
                    ) : (
                      <td
                        key={idx}
                        style={{
                          padding: '0.75rem 1.5rem',
                          border: '1px solid #D1D5DB',
                        }}
                      ></td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        style={{
          position: 'fixed',
          top: '10rem',
          right: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          zIndex: 999,
        }}
        onClick={() => {
          let saveToDataList = airDataList
            .map((waterDatas, rowIndex) => {
              console.log(waterDatas);
              if (filteredRows[rowIndex] === true)
                return getRowDataToServer(waterDatas).map(
                  (data, columnIndex) => {
                    console.log(data);
                    if (filteredColumns[columnIndex] === true)
                      return {
                        [data.key]: data.value,
                      };
                    else
                      return {
                        [data.key]: null,
                      };
                  },
                );
              else return null;
            })
            .filter((value) => value !== null);
          console.log(saveToDataList);

          let realSaveToDataList = [];

          for (let i = 0; i < saveToDataList.length; i++) {
            const result = Object.assign(
              {},
              ...Object.values(saveToDataList[i]),
            );
            realSaveToDataList.push(result);
          }
          console.log(realSaveToDataList);
          const memo = '메모';
          // saveAirByPlace(realSaveToDataList, memo);
        }}
      >
        데이터 저장하기
      </button>
    </div>
  );
}

export default AirPlaceList;
