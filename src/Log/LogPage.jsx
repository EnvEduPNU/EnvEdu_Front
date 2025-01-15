import React, { useEffect, useState } from 'react';
import { deleteLog, getAllLog } from './apis/log';
import * as XLSX from 'xlsx';
import { engToKor } from './engToKor';
import { customAxios } from '../Common/CustomAxios';
import { convertToNumber } from '../Data/DataInChart/store/utils/convertToNumber';
import { sampleDatas } from '../Data/DataInChart/DataSet/sampleDatas';

function LogPage() {
  const [logs, setLogs] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]); // 선택된 로그 ID 관리

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getAllLog();
      setLogs(
        data.sort((a, b) => a.logCollectionEndTime - b.logCollectionEndTime),
      );
    };
    fetchData();
  }, []);

  const handleLogDownload = (logDatas) => {
    // 1. 데이터를 워크시트 형식으로 변환
    const worksheet = XLSX.utils.json_to_sheet(logDatas);

    // 2. 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');

    // 3. 엑셀 파일 다운로드
    XLSX.writeFile(workbook, 'log_data.xlsx');
  };

  const handleDataDownload = (dataType, dataUUID) => {
    console.log(dataType, dataUUID);
    let tableData = '';
    let title = '';
    if (dataType == 'expert') {
      title = dataUUID;
      tableData = sampleDatas[title];

      // 1. 데이터를 워크시트 형식으로 변환
      const worksheet = XLSX.utils.json_to_sheet(tableData);

      // 2. 워크북 생성
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'tableData');

      // 3. 엑셀 파일 다운로드
      XLSX.writeFile(workbook, `${title}.xlsx`);
    } else if (dataType === 'CUSTOM') {
      const fetchCustomData = async () => {
        try {
          const res = await customAxios.get(`/api/custom/${dataUUID}`);

          title = res.data.title;
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
          title = res.data.title;
          tableData = data;

          // 1. 데이터를 워크시트 형식으로 변환
          const worksheet = XLSX.utils.json_to_sheet(tableData);

          // 2. 워크북 생성
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'tableData');

          // 3. 엑셀 파일 다운로드
          XLSX.writeFile(workbook, `${title}.xlsx`);
        } catch (error) {
          console.log('데이터 가져오기 중 오류:', error);
        }
      };

      fetchCustomData();
    } else {
      let path = '';
      if (dataType === '수질 데이터') {
        path = `/ocean-quality/mine/chunk?dataUUID=${dataUUID}`;
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
            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];
            console.log(recombined);
            console.log(res);
            tableData = recombined;
            title = res.data[0].title;

            // 1. 데이터를 워크시트 형식으로 변환
            const worksheet = XLSX.utils.json_to_sheet(tableData);

            // 2. 워크북 생성
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'tableData');

            // 3. 엑셀 파일 다운로드
            XLSX.writeFile(workbook, `${title}.xlsx`);
          })
          .catch((err) => console.log(err));
      } else if (dataType === '대기질 데이터') {
        path = `/air-quality/mine/chunk?dataUUID=${dataUUID}`;
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
                  if (item[key] === null) return;
                  else if (isNaN(item[key])) newItem[key] = item[key];
                  else newItem[key] = Number(item[key]);
                } else {
                  newItem[key] = null; // 해당 키가 없으면 null로 설정
                }
              });
              return newItem;
            });

            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];

            tableData = recombined;
            title = res.data.title;
            console.log(tableData);
            console.log(title);

            // 1. 데이터를 워크시트 형식으로 변환
            const worksheet = XLSX.utils.json_to_sheet(tableData);

            // 2. 워크북 생성
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'tableData');

            // 3. 엑셀 파일 다운로드
            XLSX.writeFile(workbook, `${title}.xlsx`);
          })
          .catch((err) => console.log(err));
      } else if (dataType === '시도별 대기질 데이터') {
        path = `/city-air-quality/mine/chunk?dataUUID=${dataUUID}`;
        customAxios
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
            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];
            console.log(recombined);
            tableData = recombined;
            title = res.data.memo;

            // 1. 데이터를 워크시트 형식으로 변환
            const worksheet = XLSX.utils.json_to_sheet(tableData);

            // 2. 워크북 생성
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'tableData');

            // 3. 엑셀 파일 다운로드
            XLSX.writeFile(workbook, `${title}.xlsx`);
          })
          .catch((err) => console.log(err));
      } else if (dataType === 'SEED') {
        path = `/seed/mine/chunk?dataUUID=${dataUUID}`;
      } else if (dataType === '데이터없음') {
        console.log('데이터 없음');
        return;
      }
    }
  };

  const handleGraphDownload = (graphImage) => {
    console.log(`Downloading ${graphImage}`);

    const link = document.createElement('a');
    link.href = graphImage; // Base64 이미지 URL
    link.download = '그래프_완성본.jpg'; // 파일 이름
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 링크 제거
  };

  const handleCheckboxChange = (logUuid) => {
    if (selectedLogs.includes(logUuid)) {
      setSelectedLogs(selectedLogs.filter((id) => id !== logUuid));
    } else {
      setSelectedLogs([...selectedLogs, logUuid]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (let i = 0; i < selectedLogs.length; i++) {
        await deleteLog(selectedLogs[i]);
      }
      const { data } = await getAllLog();
      setLogs(
        data.sort((a, b) => a.logCollectionEndTime - b.logCollectionEndTime),
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}
      >
        Log Page
      </h1>
      <button
        style={{
          padding: '8px 16px',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
        onClick={handleDeleteSelected}
        disabled={selectedLogs.length === 0}
      >
        선택 삭제
      </button>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f9f9f9' }}>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              선택
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              로그 번호
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              로그 개수
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              로그 다운로드
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              사용된 데이터 다운로드
            </th>
            <th
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              그래프 이미지 다운로드
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={log.logUuid}
              style={{
                textAlign: 'center',
                backgroundColor: '#fff',
                hover: { backgroundColor: '#f1f1f1' },
              }}
            >
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <input
                  type="checkbox"
                  checked={selectedLogs.includes(log.logUuid)}
                  onChange={() => handleCheckboxChange(log.logUuid)}
                />
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {index + 1}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {log.content.length}개
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleLogDownload(log.content)}
                >
                  다운로드
                </button>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    handleDataDownload(
                      log.content[0].memo.split(':')[0],
                      log.content[0].memo.split(':')[1],
                    )
                  }
                >
                  다운로드
                </button>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#6f42c1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleGraphDownload(log.graphImage)}
                >
                  다운로드
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogPage;
