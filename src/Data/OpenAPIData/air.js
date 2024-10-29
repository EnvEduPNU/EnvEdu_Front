import React, { useState, useEffect, useMemo } from 'react';
import './OpenApi.scss';
import { customAxios } from '../../Common/CustomAxios';
import { Link } from 'react-router-dom';

function Air() {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    customAxios.get('/air-quality?location=부산').then((response) => {
      const jsonData = response.data;
      setData(jsonData);
      setFilteredData(jsonData);

      // Set the table headers dynamically
      const initialHeaders = Object.keys(jsonData[0]).filter(
        (key) =>
          !['id', 'dataUUID', 'saveDate', 'PTNM', 'memo', 'dataLabel'].includes(
            key,
          ),
      );
      setHeaders(initialHeaders);
    });
  }, []);

  const options = useMemo(
    () =>
      data.map((station) => ({
        value: station.stationName,
        label: station.stationName,
      })),
    [data],
  );

  const handleSaveMyData = async (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      alert('저장할 데이터를 선택하세요.');
      return;
    }

    const memoInput = prompt('(선택) 메모를 입력하세요.');
    const memo = memoInput?.trim() || '';

    // 필터링된 헤더들만 포함된 데이터 생성
    const filteredItemsToSave = selectedItems.map((item) => {
      const filteredItem = {};
      headers.forEach((header) => {
        filteredItem[header] = item[header];
      });
      return filteredItem;
    });

    try {
      await customAxios.post('/air-quality', {
        data: filteredItemsToSave,
        memo,
      });
      alert('데이터 저장을 성공했습니다!');
    } catch (err) {
      console.error(err);
      alert('데이터 저장을 실패했습니다.');
    }
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === '전체') {
      setSelectedOption(null);
      setFilteredData(data);
      setSelectedItems([]);
    } else {
      const selectedStation = data.find(
        (singleData) => singleData.stationName === value,
      );
      setSelectedOption(selectedStation);
      setFilteredData([selectedStation]);
      setSelectedItems([]);
    }
  };

  const handleFullCheck = () => {
    if (isFull) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...filteredData]);
    }
    setIsFull(!isFull);
  };

  const handleViewCheckBoxChange = (item) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem !== item,
        );
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const handlePropertyCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setHeaders((prevHeaders) =>
      checked
        ? [...prevHeaders, name]
        : prevHeaders.filter((header) => header !== name),
    );
  };

  const engToKor = (name) => {
    const kor = {
      stationName: '조사지점명',
      dataTime: '측정일',
      so2Value: '아황산가스 농도(ppm)',
      coValue: '일산화탄소 농도(ppm)',
      o3Value: '오존 농도(ppm)',
      no2Value: '이산화질소 농도(ppm)',
      pm10Value: '미세먼지(PM10) 농도(㎍/㎥)',
      pm25Value: '미세먼지(PM2.5) 농도(㎍/㎥)',
    };
    return kor[name] || '';
  };

  return (
    <div>
      <div id="wrap-openapi-div">
        <div style={{ marginTop: '1.875rem' }}>
          <label className="filter-label" style={{ marginRight: '0.625rem' }}>
            측정소명 필터링
          </label>
          <select
            value={selectedOption ? selectedOption.stationName : ''}
            onChange={handleSelectChange}
            className="air-buttons"
          >
            <option key="전체" value="전체">
              전체
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label className="filter-label">추가/삭제</label>
          <div
            style={{
              margin: '0.625rem 0',
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {headers.map((header) => (
              <label key={header}>
                <input
                  type="checkbox"
                  name={header}
                  value={header}
                  checked={headers.includes(header)}
                  onChange={handlePropertyCheckboxChange}
                />
                {engToKor(header)}
              </label>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            id="table-btn"
            onClick={handleSaveMyData}
            style={{ marginRight: '0.3rem' }}
          >
            데이터 저장하기
          </button>
        </div>

        {filteredData.length !== 0 && (
          <table border="1" className="openAPI-table">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{engToKor(header)}</th>
                ))}
                <th>
                  <input
                    type="checkbox"
                    onChange={handleFullCheck}
                    checked={isFull}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  {headers.map((header) =>
                    header === 'stationName' ? (
                      <td key={header}>
                        <Link
                          to={'/openAPI/past'}
                          state={{ stationName: item[header] }}
                        >
                          {item[header]}
                        </Link>
                      </td>
                    ) : (
                      <td key={header}>{item[header]}</td>
                    ),
                  )}
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
        )}
      </div>
    </div>
  );
}

export default Air;
