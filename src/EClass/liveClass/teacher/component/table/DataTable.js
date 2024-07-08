import React, { useState, useEffect } from "react";
import { customAxios } from "../../../../../Common/CustomAxios";
import { engToKor } from "../../../../../Data/MyData/engToKor";

// 수업 자료 생성 페이지의 paper에 나오는 테이블
const DataTable = ({ type, id, setContent }) => {
  const [details, setDetails] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [contents, setContents] = useState([]);

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

          // Filter out unnecessary headers
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

    handleSelectData(type, id);
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

  const handleSelectData = async (type, id) => {
    try {
      let path = "";
      if (type === "수질 데이터") {
        path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === "대기질 데이터") {
        path = `/air-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === "SEED") {
        path = `/seed/mine/chunk?dataUUID=${id}`;
      } else if (type === "CUSTOM") {
        path = `/dataLiteracy/customData/download/${id}`;
      }

      const response = await customAxios.get(path);
      const dataContent = response.data; // Get JSON data

      // Convert JSON data to table format and add to contents
      const headers = Object.keys(dataContent[0]);
      const tableContent = (
        <table border="1" style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataContent.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

      console.log("리프팅되는중");
      // 현재 상태 컨텐츠
      setContents([...contents, { type: "data", content: tableContent }]);
      // 리프팅 되는 상태 컨텐츠
      setContent([...contents, { type: "data", content: tableContent }]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      {details.length !== 0 && !isCustom && (
        <>
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
