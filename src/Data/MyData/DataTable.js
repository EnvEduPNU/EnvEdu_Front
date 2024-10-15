import React, { useState, useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import { engToKor } from './engToKor';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const DataTable = ({ type, id }) => {
  const [details, setDetails] = useState([]); // 초기 값을 빈 배열로 설정
  const [headers, setHeaders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

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
          setIsCustom(true); // 커스텀 데이터 플래그 설정

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
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* 엑셀 다운로드 버튼 */}
            <button
              className="excel-download"
              onClick={handleDownload}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              엑셀 파일로 저장
            </button>
            {/* <button
              className="excel-download"
              onClick={() => navigate(-1)} // 뒤로가기 기능
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              뒤로가기
            </button> */}
          </div>
          <table
            border="1"
            className="myData-detail"
            style={{ tableLayout: 'fixed', width: '100%' }}
          >
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    style={{ width: `${100 / headers.length}%` }}
                  >
                    {engToKor(header)}
                  </th>
                ))}
                <th style={{ width: '50px' }}>
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
                const totalFields = [];

                headers.forEach((header) => {
                  // numericFields의 값을 개별 셀에 넣음
                  row.numericFields
                    ?.map((field) => field[header])
                    .filter(Boolean)
                    .forEach((field) => {
                      totalFields.push({
                        value: field.value || '',
                        order: field.order,
                      });
                    });

                  // stringFields의 값을 개별 셀에 넣음
                  row.stringFields
                    ?.map((field) => field[header])
                    .filter(Boolean)
                    .forEach((field) => {
                      totalFields.push({
                        value: field.value || '',
                        order: field.order,
                      });
                    });

                  // 직접 할당된 값이 있으면 그 값도 추가
                  if (row[header]) {
                    totalFields.push({ value: row[header], order: -1 }); // order: -1로 직접 할당된 값을 구분
                  }
                });

                // totalFields를 order 순으로 정렬
                totalFields.sort((a, b) => a.order - b.order);

                const rows = [];
                let currentRow = [];

                // totalFields 배열을 헤더의 수에 맞게 나누어 각 tr 생성
                totalFields.forEach((field, fieldIndex) => {
                  currentRow.push(
                    <td key={`cell-${rowIndex}-${fieldIndex}`}>
                      {field.value}
                    </td>,
                  );

                  // 헤더 수에 맞게 각 tr을 생성
                  if (currentRow.length === headers.length) {
                    rows.push(
                      <tr key={`row-${rowIndex}-${fieldIndex}`}>
                        {currentRow}
                        {/* 각 tr에 체크박스 추가 */}
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(row)}
                            onChange={() => handleViewCheckBoxChange(row)}
                          />
                        </td>
                      </tr>,
                    );
                    currentRow = []; // 새로운 행을 위해 초기화
                  }
                });

                // 마지막에 남은 값들이 있으면 그들을 위한 tr 추가
                if (currentRow.length > 0) {
                  rows.push(
                    <tr key={`row-${rowIndex}-remaining`}>
                      {currentRow}
                      {/* 각 tr에 체크박스 추가 */}
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(row)}
                          onChange={() => handleViewCheckBoxChange(row)}
                        />
                      </td>
                    </tr>,
                  );
                }

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
