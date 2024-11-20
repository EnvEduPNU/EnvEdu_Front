import React, { useState, useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import { engToKor } from './engToKor';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { IconButton, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { convertToNumber } from '../DataInChart/store/utils/convertToNumber';

const DataTable = ({ type, id, handleMenuToggle }) => {
  const [details, setDetails] = useState([]); // 초기 값을 빈 배열로 설정
  const [headers, setHeaders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('데이터 타입 보기 : ' + type);

    if (type === '커스텀 데이터') {
      const fetchCustomData = async () => {
        try {
          const res = await customAxios.get(`/api/custom/${id}`);

          setTitle(res.data.title);
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
          setData(data);
          // // 데이터가 배열이 아닌 경우 배열로 감싸기
          // let normalizedData = Array.isArray(data) ? data : [data];

          // console.log(
          //   '커스텀 데이터 조회 : ' + JSON.stringify(normalizedData, null, 2),
          // );

          // setDetails(normalizedData); // 유효한 배열을 설정

          // // `numericFields`와 `stringFields`를 order에 따라 정렬 후, 테이블 헤더로 추가
          // const orderedFields = [];

          // normalizedData.forEach((item) => {
          //   item.numericFields.forEach((field) => {
          //     Object.keys(field).forEach((key) => {
          //       orderedFields.push({ key, order: field[key].order });
          //     });
          //   });
          //   item.stringFields.forEach((field) => {
          //     Object.keys(field).forEach((key) => {
          //       orderedFields.push({ key, order: field[key].order });
          //     });
          //   });
          // });

          // // order 기준으로 정렬된 헤더 생성
          // const sortedHeaders = orderedFields
          //   .sort((a, b) => a.order - b.order)
          //   .map((field) => field.key);

          // // 중복 제거 후 헤더 설정
          // const uniqueHeaders = [...new Set(sortedHeaders)];
          // setHeaders(uniqueHeaders); // 헤더 설정
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
              'ITEMN02',
              'ITEM03',
              'ITEMPM10',
              'ITEMPM25',
              'ITEMS02VALUE',
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
          })
          .catch((err) => console.log(err));
      } else if (type === 'SEED') {
        path = `/seed/mine/chunk?dataUUID=${id}`;
      } else if (type === '데이터없음') {
        console.log('데이터 없음');
        return;
      }
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
      {data.length !== 0 ? (
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
              onClick={() => window.location.reload()} // 뒤로가기 기능
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              뒤로가기
            </button>
          </div>
          <table
            style={{
              width: '100%',
              border: '1px solid rgba(34, 36, 38, 0.15)',
              borderCollapse: 'collapse',
              borderRadius: '8px',
              captionSide: 'top',
            }}
          >
            <caption
              style={{
                fontSize: '24px',
                fontWeight: '600',
                padding: '10px',
                textAlign: 'center',
                color: 'black',
              }}
            >
              {title}
            </caption>
            <thead>
              <tr>
                {['', ...data[0]].map((header, headerIndex) => (
                  <th
                    key={headerIndex}
                    style={{
                      border: '1px solid rgba(34, 36, 38, 0.15)',
                      padding: '10px',
                      textAlign: 'center',
                      fontSize: '18px',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {[rowIndex, ...row].map((value, valueIndex) => (
                    <td
                      key={valueIndex}
                      style={{
                        border: '1px solid rgba(34, 36, 38, 0.15)',
                        textAlign: 'center',
                        padding: '0.5rem',
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>{value}</span>
                    </td>
                  ))}
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
