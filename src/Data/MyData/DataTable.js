import React, { useState, useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import { engToKor } from './engToKor';
import * as XLSX from 'xlsx';

const DataTable = ({ type, id }) => {
  const [details, setDetails] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (type === 'CUSTOM') {
      customAxios
        .get(`/dataLiteracy/customData/download/${id}`)
        .then((res) => {
          setIsCustom(true);
          setDetails(res.data);
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
      }

      customAxios
        .get(path)
        .then((res) => {
          const data = res.data;
          setDetails(data);

          // 필요없는 헤더 지우기
          let headers = Object.keys(data[0]).filter(
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
        .catch((err) => console.log(err));
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
          {/* 엑셀 다운로드 버튼 */}
          <button
            className="excel-download"
            onClick={handleDownload}
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            엑셀 파일로 저장
          </button>
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
              {isCustom
                ? details.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {details.properties.map((property, propertyIndex) => (
                        <td
                          key={propertyIndex}
                          style={{
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                          }}
                        >
                          {row[propertyIndex]}
                        </td>
                      ))}
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(row)}
                          onChange={() => handleViewCheckBoxChange(row)}
                        />
                      </td>
                    </tr>
                  ))
                : details.map((item) => (
                    <tr key={item.id}>
                      {headers.map((header) => (
                        <td
                          key={header}
                          style={{
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                          }}
                        >
                          {item[header]}
                        </td>
                      ))}
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item)}
                          onChange={() => handleViewCheckBoxChange(item)}
                        />
                      </td>
                    </tr>
                  ))}
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
