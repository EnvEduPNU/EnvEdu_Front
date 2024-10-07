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

  useEffect(() => {
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
  }, []);

  const getTable = (type, id) => {
    setMyDataTable(true);
    setDataType(type);
    setDataId(id);
  };

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
