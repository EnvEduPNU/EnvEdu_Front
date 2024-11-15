import React, { useEffect, useState } from 'react';

function CityAirList({ cityAirDataList }) {
  const headers = [
    '변인',
    '시간',
    '대구',
    '충남',
    '인천',
    '대전',
    '경북',
    '세종',
    '광주',
    '전북',
    '강원',
    '울산',
    '전남',
    '서울',
    '부산',
    '제주',
    '충북',
    '경남',
    '경기',
  ];

  // 상태 관리: 선택된 열
  const [filteredColumns, setFilteredColumns] = useState(
    new Array(headers.length).fill(true), // 기본적으로 모든 열을 표시
  );

  // 상태 관리: 선택된 행
  const [filteredRows, setFilteredRows] = useState(
    new Array(cityAirDataList.length).fill(false), // 기본적으로 모든 행을 표시
  );

  const toggleColumn = (index) => {
    // 해당 열을 선택/해제
    setFilteredColumns((prev) =>
      prev.map((value, idx) => (idx === index ? !value : value)),
    );
  };

  const toggleRow = (index) => {
    // 해당 행을 선택/해제
    setFilteredRows((prev) =>
      prev.map((value, idx) => (idx === index ? !value : value)),
    );
  };

  useEffect(() => {
    setFilteredRows(new Array(cityAirDataList.length).fill(false));
  }, [cityAirDataList]);

  return (
    <div
      style={{
        overflow: 'auto',
        margin: '2rem auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {cityAirDataList.length === 0 ? (
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
                  fontSize: '0.875rem', // fontsize 축소
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
                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    선택
                  </div>
                </th>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      padding: '0.3rem 1rem',
                      border: '1px solid #D1D5DB',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleColumn(index)}
                  >
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filteredColumns[index]}
                        readOnly
                        style={{ marginRight: '0.3rem', width: '16px' }}
                      />
                      {header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cityAirDataList.map((item, index) => (
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
                      padding: '0.5rem 1rem',
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
                  {[
                    'itemCode',
                    'dataTime',
                    'daegu',
                    'chungnam',
                    'incheon',
                    'daejeon',
                    'gyeongbuk',
                    'sejong',
                    'gwangju',
                    'jeonbuk',
                    'gangwon',
                    'ulsan',
                    'jeonnam',
                    'seoul',
                    'busan',
                    'jeju',
                    'chungbuk',
                    'gyeongnam',
                    'gyeonggi',
                  ].map((value, idx) =>
                    filteredColumns[idx] ? (
                      <td
                        key={value}
                        style={{
                          padding: '0.75rem 1.5rem',
                          border: '1px solid #D1D5DB',
                        }}
                      >
                        {item[value]}
                      </td>
                    ) : (
                      <td
                        key={value}
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

      {/* 데이터 저장하기 버튼 */}
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
      >
        데이터 저장하기
      </button>
    </div>
  );
}

export default CityAirList;
