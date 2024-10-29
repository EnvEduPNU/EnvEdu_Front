import React, { useState, useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import { engToKor } from './engToKor';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { IconButton, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const DataTable = ({ type, id, handleMenuToggle }) => {
  const [details, setDetails] = useState([]); // 초기 값을 빈 배열로 설정
  const [headers, setHeaders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFull, setIsFull] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('데이터 타입 보기 : ' + type);

    if (type === '커스텀 데이터') {
      const fetchCustomData = async () => {
        try {
          const response = await customAxios.get(`/api/custom/${id}`);
          let data = response.data;

          // 데이터가 배열이 아닌 경우 배열로 감싸기
          let normalizedData = Array.isArray(data) ? data : [data];

          console.log(
            '커스텀 데이터 조회 : ' + JSON.stringify(normalizedData, null, 2),
          );

          setDetails(normalizedData); // 유효한 배열을 설정

          // `numericFields`와 `stringFields`를 order에 따라 정렬 후, 테이블 헤더로 추가
          const orderedFields = [];

          normalizedData.forEach((item) => {
            item.numericFields.forEach((field) => {
              Object.keys(field).forEach((key) => {
                orderedFields.push({ key, order: field[key].order });
              });
            });
            item.stringFields.forEach((field) => {
              Object.keys(field).forEach((key) => {
                orderedFields.push({ key, order: field[key].order });
              });
            });
          });

          // order 기준으로 정렬된 헤더 생성
          const sortedHeaders = orderedFields
            .sort((a, b) => a.order - b.order)
            .map((field) => field.key);

          // 중복 제거 후 헤더 설정
          const uniqueHeaders = [...new Set(sortedHeaders)];
          setHeaders(uniqueHeaders); // 헤더 설정
        } catch (error) {
          console.log('데이터 가져오기 중 오류:', error);
          setDetails([]); // 오류 발생 시 빈 배열로 설정
        }
      };

      fetchCustomData();
    } else {
      let path = '';
      if (type === '수질 데이터') {
        path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === '대기질 데이터') {
        path = `/air-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === 'SEED') {
        path = `/seed/mine/chunk?dataUUID=${id}`;
      }

      customAxios
        .get(path)
        .then((res) => {
          const data = res.data;

          // 데이터가 배열인지 확인, 배열이 아니면 빈 배열로 설정
          if (!Array.isArray(data)) {
            console.error('API에서 받은 데이터가 배열이 아닙니다:', data);
            setDetails([]);
            return;
          }

          setDetails(data);

          // 필요없는 헤더 지우기
          let headers = Object.keys(data[0] || {}).filter(
            (key) =>
              key !== 'id' &&
              key !== 'dataUUID' &&
              key !== 'saveDate' &&
              key !== 'dateString' &&
              key !== 'sessionid' &&
              key !== 'unit',
          );

          // 값이 없는 컬럼 필터링
          headers = headers.filter((header) => {
            return data.some(
              (item) =>
                item[header] !== null &&
                item[header] !== undefined &&
                item[header] !== '',
            );
          });

          setHeaders(headers);
        })
        .catch((err) => {
          console.log('데이터 가져오기 중 오류:', err);
          setDetails([]); // 오류 발생 시 빈 배열로 설정
        });
    }
  }, [type, id]);

  const handleFullCheck = () => {
    setIsFull(!isFull);
    if (isFull) setSelectedItems([]);
    else setSelectedItems(details);
  };

  const handleViewCheckBoxChange = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item),
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleDownload = () => {
    if (selectedItems.length === 0) {
      alert('엑셀 파일로 내보낼 데이터를 한 개 이상 선택해 주세요.');
    } else {
      const modifiedSelectedItems = selectedItems.map((item) => {
        const newItem = {};

        for (const key in item) {
          newItem[engToKor(key)] = item[key];
        }

        delete newItem.dataUUID;
        delete newItem.id;
        delete newItem.dateString;

        return newItem;
      });

      const filename = window.prompt('파일명을 입력해 주세요.');
      if (filename !== null) {
        const ws = XLSX.utils.json_to_sheet(modifiedSelectedItems);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${filename}.xlsx`);
      } else {
        alert('엑셀 파일명을 입력해 주세요.');
      }
    }
  };

  return (
    <>
      {details.length !== 0 ? (
        <div>
          <Typography variant="h3">My Data</Typography>

          <div>
            {/* 메뉴 아이콘 버튼 */}
            <IconButton onClick={handleMenuToggle}>
              <MenuIcon fontSize="large" />
            </IconButton>
            {/* 엑셀 다운로드 버튼 */}
            <Button
              className="excel-download"
              onClick={handleDownload}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              엑셀 파일로 저장
            </Button>
            <button
              className="excel-download"
              onClick={() => navigate(-1)} // 뒤로가기 기능
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              뒤로가기
            </button>
          </div>
          <table
            border="1"
            className="myData-detail"
            style={{
              tableLayout: 'fixed',
              width: '100%',
              borderCollapse: 'collapse',
              margin: '10px 0',
            }}
          >
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    style={{
                      width: `${100 / headers.length}%`,
                      padding: '8px',
                      backgroundColor: '#f4f6f8',
                      color: '#333',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderBottom: '2px solid #e0e0e0',
                    }}
                  >
                    {engToKor(header)}
                  </th>
                ))}
                <th style={{ width: '50px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    onChange={handleFullCheck}
                    checked={isFull}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((row, rowIndex) => {
                const rows = [];
                let currentRow = [];

                headers.forEach((header) => {
                  currentRow.push(
                    <td
                      key={`${rowIndex}-${header}`}
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        color: '#555',
                        borderBottom: '1px solid #ddd',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row[header] || ''}
                    </td>,
                  );
                });

                rows.push(
                  <tr
                    key={`row-${rowIndex}`}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : '#fff',
                    }}
                  >
                    {currentRow}
                    <td style={{ textAlign: 'center', padding: '8px' }}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(row)}
                        onChange={() => handleViewCheckBoxChange(row)}
                      />
                    </td>
                  </tr>,
                );

                return rows;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'grey',
          }}
        >
          <div>데이터가 없습니다</div>
          <div style={{ fontSize: '3rem', marginTop: '1rem' }}>😔</div>
        </div>
      )}
    </>
  );
};

export default DataTable;
