import React, { useEffect, useState } from 'react';
import { saveWaterByPlace } from '../apis/water';
import { KeyTwoTone } from '@mui/icons-material';
import TitleMemoInputModal from '../modals/TitleMemoInputModal';

function PlaceWaterDataList({ waterlistData }) {
  const headers = [
    '측정 장소',
    '측정 일',
    '회차',
    '수심(m)',
    '수온(°C)',
    'DO(㎎/L)',
    'BOD(㎎/L)',
    'COD(㎎/L)',
    'SS(㎎/L)',
    'TN(㎎/L)',
    'TP(㎎/L)',
    'TOC(㎎/L)',
  ];

  const getRowData = (item) => [
    item.ptnm,
    item.date,
    item.wmwk,
    item.wmdep,
    item.temp,
    item.do,
    item.bod,
    item.cod,
    item.ss,
    item.tn,
    item.tp,
    item.toc,
  ];

  const getRowDataToServer = (item) => [
    {
      key: 'PTNM',
      value: item.ptnm,
    },
    {
      key: 'ITEMDATE',
      value: item.date,
    },
    {
      key: 'ITEMWMWK',
      value: item.wmwk,
    },
    {
      key: 'ITEMWNDEP',
      value: item.wmdep,
    },
    {
      key: 'ITEMTEMP',
      value: item.temp,
    },
    {
      key: 'ITEMDO',
      value: item.do,
    },
    {
      key: 'ITEMBOD',
      value: item.bod,
    },
    {
      key: 'ITEMCOD',
      value: item.cod,
    },
    {
      key: 'ITEMSS',
      value: item.ss,
    },
    {
      key: 'ITEMTN',
      value: item.tn,
    },
    {
      key: 'ITEMTP',
      value: item.tp,
    },
    {
      key: 'ITEMTOC',
      value: item.toc,
    },
  ];

  // 상태 관리: 선택된 열
  const [filteredColumns, setFilteredColumns] = useState(
    new Array(headers.length).fill(true), // 기본적으로 모든 열을 표시
  );

  // 상태 관리: 선택된 행
  const [filteredRows, setFilteredRows] = useState(
    new Array(waterlistData.length).fill(false), // 기본적으로 모든 열을 표시
  );

  const [isOpen, setIsOpen] = useState(false);

  const [allChecked, setAllChecked] = useState(false);

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
    setFilteredRows(new Array(waterlistData.length).fill(false));
  }, [waterlistData]);
  console.log(waterlistData);
  return (
    <div
      style={{
        margin: '2rem auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {waterlistData.length === 0 ? (
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
          <TitleMemoInputModal
            type="waterPlace"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            dataList={waterlistData}
            filteredRows={filteredRows}
            filteredColumns={filteredColumns}
            getRowDataToServer={getRowDataToServer}
          />
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
                  <input
                    type="checkbox"
                    style={{
                      marginRight: '0.5rem',
                      width: '16px',
                    }}
                    checked={allChecked}
                    onChange={() => {
                      if (allChecked === false) {
                        setFilteredRows(
                          new Array(waterlistData.length).fill(true),
                        );
                      } else {
                        setFilteredRows(
                          new Array(waterlistData.length).fill(false),
                        );
                      }
                      setAllChecked((prev) => !prev);
                    }}
                  />
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
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
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
              {waterlistData.map((item, index) => (
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
                    onClick={() => {
                      toggleRow(index);
                    }}
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
        onClick={() => {
          setIsOpen(true);
        }}
      >
        데이터 저장하기
      </button>
    </div>
  );
}

export default PlaceWaterDataList;
