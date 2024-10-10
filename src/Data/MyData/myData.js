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
    if (!isLoading) {
      customAxios
        .get('/mydata/list')
        .then((res) => {
          const formattedData = res.data.map((data) => ({
            ...data,
            saveDate: data.saveDate.split('T')[0],
            dataLabel:
              data.dataLabel === 'AIRQUALITY'
                ? '대기질 데이터'
                : data.dataLabel === 'OCEANQUALITY'
                ? '수질 데이터'
                : data.dataLabel,
          }));
          setSummary(formattedData);
        })
        .catch((err) => console.log(err));
    }
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
