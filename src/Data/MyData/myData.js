import React, { useState, useEffect } from "react";
import { customAxios } from "../../Common/CustomAxios";
import "./myData.scss";
import DataTable from "./DataTable";
import MultiTablePage from "./MultiTablePage";

const MyData = () => {
  const [summary, setSummary] = useState([]);
  const [myDataTable, setMyDataTable] = useState(false);
  const [dataType, setDataType] = useState(null);
  const [dataId, setDataId] = useState(null);

  useEffect(() => {
    customAxios
      .get("/mydata/list")
      .then((res) => {
        const formattedData = res.data.map((data) => ({
          ...data,
          saveDate: data.saveDate.split("T")[0],
          dataLabel:
            data.dataLabel === "AIRQUALITY"
              ? "대기질 데이터"
              : data.dataLabel === "OCEANQUALITY"
              ? "수질 데이터"
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
      <div className="myData-left">
        <div className="myData-folder">
          <button
            style={{
              border: "none",
              fontWeight: "600",
              borderRadius: "0.625rem",
              margin: "10px",
              backgroundColor: "white",
            }}
            onClick={() => window.location.reload()}
          >
            My Data
          </button>
        </div>

        <div className="myData-summary">
          <div style={{ overflow: "auto", height: "20rem" }}>
            <div className="yellow-btn" style={{ width: "100%" }}>
              My Data
            </div>
            <>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th key="saveDate">저장 일시</th>
                    <th key="dataLabel">데이터 종류</th>
                    <th key="memo">메모</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => getTable(item.dataLabel, item.dataUUID)}
                    >
                      <td>{item.saveDate}</td>
                      <td>{item.dataLabel}</td>
                      <td>{item.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          </div>
        </div>
      </div>

      {/* 왼쪽 메뉴 리스트 제외 한 오른쪽 페이지 */}
      <div className="myData-right">
        <>
          {myDataTable && dataType && dataId && (
            <DataTable type={dataType} id={dataId} />
          )}

          {!myDataTable && (
            <div>
              <MultiTablePage />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default MyData;
