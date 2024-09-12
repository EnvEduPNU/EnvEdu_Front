import React, { useState, useEffect } from "react";
import { customAxios } from "../../Common/CustomAxios";
import { engToKor } from "./engToKor";
import * as XLSX from "xlsx";

const DataTable = ({ type, id }) => {
  const [details, setDetails] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (type === "CUSTOM") {
      customAxios
        .get(`/dataLiteracy/customData/download/${id}`)
        .then((res) => {
          setIsCustom(true);
          setDetails(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      let path = "";
      if (type === "수질 데이터") {
        path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === "대기질 데이터") {
        path = `/air-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === "SEED") {
        path = `/seed/mine/chunk?dataUUID=${id}`;
      }

      customAxios
        .get(path)
        .then((res) => {
          setDetails(res.data);

          // 필요없는 헤더 지우기
          let headers = Object.keys(res.data[0]).filter(
            (key) =>
              key !== "id" &&
              key !== "dataUUID" &&
              key !== "saveDate" &&
              key !== "dateString" &&
              key !== "sessionid" &&
              key !== "unit"
          );

          const attributesToCheck = [
            "co2",
            "dox",
            "dust",
            "hum",
            "hum_EARTH",
            "lux",
            "ph",
            "pre",
            "temp",
            "tur",
          ];

          for (const attribute of attributesToCheck) {
            const isAllZero = res.data.every(
              (item) => item[attribute] === -99999
            );
            if (isAllZero) {
              headers = headers.filter((header) => header !== attribute);
            }
          }

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
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleDownload = () => {
    if (selectedItems.length === 0) {
      alert("엑셀 파일로 내보낼 데이터를 한 개 이상 선택해 주세요.");
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

      const filename = window.prompt("파일명을 입력해 주세요.");
      if (filename !== null) {
        const ws = XLSX.utils.json_to_sheet(modifiedSelectedItems);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${filename}.xlsx`);
      } else {
        alert("엑셀 파일명을 입력해 주세요.");
      }
    }
  };

  return (
    <>
      {details.length !== 0 && !isCustom && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="excel-download" onClick={handleDownload}>
              엑셀 파일로 저장
            </button>
          </div>
          <table border="1" className="myData-detail">
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
                  ></input>
                </th>
              </tr>
            </thead>
            <tbody>
              {details.map((item) => (
                <tr key={item.id}>
                  {headers.map((header) => (
                    <td key={header}>{item[header]}</td>
                  ))}
                  <td>
                    <input
                      type="checkbox"
                      name={item}
                      checked={selectedItems.includes(item)}
                      onChange={() => handleViewCheckBoxChange(item)}
                    ></input>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {details.length !== 0 && isCustom && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="excel-download" onClick={handleDownload}>
              엑셀 파일로 저장
            </button>
          </div>
          <table border="1" className="myData-detail">
            <thead>
              <tr>
                {details.properties.map((property) => (
                  <th key={property}>{property}</th>
                ))}
                <th>
                  <input
                    type="checkbox"
                    onChange={handleFullCheck}
                    checked={isFull}
                  ></input>
                </th>
              </tr>
            </thead>
            <tbody>
              {details.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((item, itemIndex) => (
                    <td key={itemIndex}>{item}</td>
                  ))}
                  <td>
                    <input
                      type="checkbox"
                      name={row}
                      checked={selectedItems.includes(row)}
                      onChange={() => handleViewCheckBoxChange(row)}
                    ></input>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default DataTable;
