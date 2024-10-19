import React, { useState, useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import './myDataOrigin.scss';
import DataTable from './DataTable';
import MultiTablePage from './MultiTablePage';
import MyDataSummaryTable from './MyDataSummaryTable';

const MyData = () => {
  const [summary, setSummary] = useState([]);
  const [myDataTable, setMyDataTable] = useState(false);
  const [dataType, setDataType] = useState(null);
  const [dataId, setDataId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (!username) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login'; // 로그인 페이지로 이동
    } else {
      setIsLoading(false); // 로그인 확인이 완료되면 로딩 상태 해제
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLoading) {
          // 첫 번째 요청
          const myDataResponse = await customAxios.get('/mydata/list');
          const myDataFormatted = myDataResponse.data.map((data) => ({
            ...data,
            saveDate: data.saveDate.split('T')[0],
            dataLabel:
              data.dataLabel === 'AIRQUALITY'
                ? '대기질 데이터'
                : data.dataLabel === 'OCEANQUALITY'
                ? '수질 데이터'
                : data.dataLabel,
          }));

          // 두 번째 요청
          const customDataResponse = await customAxios.get('/api/custom/list');
          const customDataFormatted = customDataResponse.data.map((data) => ({
            ...data,
            saveDate: data.saveDate.split('T')[0],
            dataLabel:
              data.dataLabel === 'CUSTOM' ? '커스텀 데이터' : data.dataLabel,
            dynamicFields: data.dynamicFields || {},
          }));

          // 두 데이터를 결합하여 상태 업데이트
          const combinedData = [...myDataFormatted, ...customDataFormatted];
          setSummary(combinedData);
        }
      } catch (error) {
        console.error('데이터 가져오기 중 오류:', error);
      }
    };

    fetchData();
  }, [isLoading]);

  const getTable = (type, id) => {
    setMyDataTable(true);
    setDataType(type);
    setDataId(id);
  };

  // 로딩 중일 때는 로딩 화면을 보여줌
  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중 메시지 표시
  }

  return (
    <div className="myData-container">
      {/* 왼쪽 데이터 테이블 */}
      <section className="myData-left" aria-labelledby="myData-heading">
        <MyDataSummaryTable summary={summary} getTable={getTable} />
      </section>

      {/* 오른쪽 페이지 컨텐츠 */}
      <section className="myData-right">
        {myDataTable && dataType && dataId ? (
          <DataTable type={dataType} id={dataId} />
        ) : (
          <MultiTablePage />
        )}
      </section>
    </div>
  );
};

export default MyData;
