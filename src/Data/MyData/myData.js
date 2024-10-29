import React, { useState, useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import DataTable from './DataTable';
import MultiTablePage from './MultiTablePage';
import MyDataSummaryTable from './MyDataSummaryTable';
import { Typography } from '@mui/material';

const MyData = () => {
  const [summary, setSummary] = useState([]);
  const [myDataTable, setMyDataTable] = useState(false);
  const [dataType, setDataType] = useState(null);
  const [dataId, setDataId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (!username) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login';
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLoading) {
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

          const customDataResponse = await customAxios.get('/api/custom/list');
          const customDataFormatted = customDataResponse.data.map((data) => ({
            ...data,
            saveDate: data.saveDate.split('T')[0],
            dataLabel:
              data.dataLabel === 'CUSTOM' ? '커스텀 데이터' : data.dataLabel,
            dynamicFields: data.dynamicFields || {},
          }));

          const combinedData = [...myDataFormatted, ...customDataFormatted];
          setSummary(combinedData);
        }
      } catch (error) {
        console.error('데이터 가져오기 중 오류:', error);
      }
    };

    fetchData();
  }, [isLoading]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const getTable = (type, id) => {
    setMyDataTable(true);
    setDataType(type);
    setDataId(id);
    setMenuOpen(false); // 메뉴 닫기
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '1000px',
      }}
    >
      {/* 슬라이드 메뉴 */}
      <div
        style={{
          position: 'fixed',
          left: menuOpen ? '0' : '-800px',
          top: '100px',
          width: '800px',
          height: 'calc(100% - 20px)', // 화면 높이에서 20px를 빼서 전체 높이를 맞춤
          backgroundColor: '#f8f9fa',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
          overflowY: 'auto',
          transition: 'left 0.3s ease',
          zIndex: 1001,
          padding: '10px',
        }}
      >
        <MyDataSummaryTable summary={summary} getTable={getTable} />
      </div>

      {/* 메뉴 열릴 때 외부 클릭 시 메뉴 닫기 위한 오버레이 */}
      {menuOpen && (
        <div
          onClick={handleMenuToggle}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        />
      )}

      {/* 메인 컨텐츠 */}
      <section className="myData-right" style={{ marginLeft: '260px' }}>
        {myDataTable && dataType && dataId ? (
          <DataTable
            type={dataType}
            id={dataId}
            handleMenuToggle={handleMenuToggle}
          />
        ) : (
          <MultiTablePage handleMenuToggle={handleMenuToggle} />
        )}
      </section>
    </div>
  );
};

export default MyData;
