import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { customAxios } from "../../../Common/CustomAxios";
import { useGraphDataStore } from "../store/graphStore";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Button from "../component/DrawGraph/PublicDataButton";
import ButtonClose from "../component/DrawGraph/ButtonClose";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  zIndex: 1000,
};

const summaryTableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ddd",
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

const tableHeaderStyle = {
  ...tableCellStyle, // spread operator to inherit styles from tableCellStyle
  backgroundColor: "#fdeecf",
};

const tableRowStyle = {
  backgroundColor: "#f2f2f2",
  cursor: "pointer",
};

const tableRowHoverStyle = {
  backgroundColor: "#ccc",
  cursor: "pointer",
};

const tableRowHoverOutStyle = {
  backgroundColor: "#FFF",
  cursor: "pointer",
};

//항목 이름 (한국어 -> 영어)
const engToKor = (name) => {
  const kor = {
    //수질 데이터
    PTNM: "조사지점명",
    WMYR: "측정연도",
    WMOD: "측정월",
    ITEMTEMP: "수온(°C)",
    ITEMPH: "pH",
    ITEMDOC: "DO(㎎/L)",
    ITEMBOD: "BOD(㎎/L)",
    ITEMCOD: "COD(㎎/L)",
    ITEMTN: "총질소(㎎/L)",
    ITEMTP: "총인(㎎/L)",
    ITEMTRANS: "투명도(㎎/L)",
    ITEMCLOA: "클로로필-a(㎎/L)",
    ITEMEC: "전기전도도(µS/㎝)",
    ITEMTOC: "TOC(㎎/L)",

    //대기질 데이터
    stationName: "조사지점명",
    dataTime: "측정일",
    so2Value: "아황산가스 농도(ppm)",
    coValue: "일산화탄소 농도(ppm)",
    o3Value: "오존 농도(ppm)",
    no2Value: "이산화질소 농도(ppm)",
    pm10Value: "미세먼지(PM10) 농도(㎍/㎥)",
    pm25Value: "미세먼지(PM2.5)  농도(㎍/㎥)",

    //SEED 데이터
    measuredDate: "측정 시간",
    location: "측정 장소",
    unit: "소속",
    period: "저장 주기",
    username: "사용자명",
    hum: "습도",
    temp: "기온",
    tur: "탁도",
    ph: "pH",
    dust: "미세먼지",
    dox: "용존산소량",
    co2: "이산화탄소",
    lux: "조도",
    hum_EARTH: "토양 습도",
    pre: "기압",
  };
  return kor[name] || name;
};

// Data&Chart 안의 테이블에 들어가는 데이터들을 다루는 컴포넌트 및 모달
export default function ForderListModal(props) {
  const [open, setOpen] = useState(false);
  const [forderType, setforderType] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const { setData } = useGraphDataStore();

  useEffect(() => {
    const ModalOpen = props.modalOpen;
    if (ModalOpen) {
      handleOpen();
    }
    const allCheck = props.filteredData[0].total;
    const noneCheck = props.filteredData[0].none;
    if (allCheck === "전체") {
      console.log("타이틀 확인 : " + allCheck);
      setforderType(allCheck);
    } else if (noneCheck) {
      console.log("타이틀 확인 : " + noneCheck);

      setforderType(noneCheck);
    } else {
      setforderType(props.filteredData[0].dataLabel);
      console.log("확인해보자" + JSON.stringify(props.filteredData));
    }
  }, [props]);

  const getTable = (type, id) => {
    if (type === "CUSTOM") {
      customAxios
        .get(`/dataLiteracy/customData/download/${id}`)
        .then((res) => {
          //수정 필요
          let headers = res.data.properties; // ['a','b','c]

          let values = res.data.data; // [[1,2,3], [4,5,6]]

          // 최종 결과 생성 (헤더 + 값)
          const recombined = [headers, ...values];

          setData(recombined);
          // localStorage.setItem("data", JSON.stringify(recombined));
          // window.location.reload();
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
      } else if (type === "데이터없음") {
        console.log("데이터 없음");
        return;
      }

      customAxios
        .get(path)
        .then((res) => {
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

          const keysToExclude = [
            "id",
            "dataUUID",
            "saveDate",
            "dateString",
            "sessionid",
            "unit",
          ];

          for (const attribute of attributesToCheck) {
            const isAllNone = res.data.every(
              (item) => item[attribute] === -99999.0
            );
            if (isAllNone) {
              // 해당 속성이 모두 -99999.0일 때, keysToExclude에 추가(헤더에 따른 values도 제거해줘야함)
              if (!keysToExclude.includes(attribute)) {
                keysToExclude.push(attribute);
              }
              // 해당 속성이 모두 -99999.0일 때, headers에서 제거
              headers = headers.filter((header) => header !== attribute);
            }
          }

          headers = headers.map((header) => engToKor(header));

          // 중요한 데이터들은 들어온 데이터 리스트에서 제거
          const values = res.data.map((item) => {
            const filteredItem = Object.keys(item)
              .filter((key) => !keysToExclude.includes(key))
              .reduce((obj, key) => {
                obj[key] = item[key];
                return obj;
              }, {});

            console.log(
              "값들이 어떻게 필터 되나 : " + Object.values(filteredItem)
            );
            return Object.values(filteredItem);
          });

          // 최종 결과 생성 (헤더 + 값)
          const recombined = [headers, ...values];

          setData(recombined);
          // localStorage.setItem("data", JSON.stringify(recombined));
          // window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography style={{ padding: "1rem", fontSize: "2rem" }}>
            {forderType}
          </Typography>
          <table style={summaryTableStyle}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th key="saveDate">저장 일시</th>
                <th key="dataLabel">데이터 종류</th>
                <th key="memo">메모</th>
              </tr>
            </thead>
            <tbody>
              {props.filteredData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    getTable(item.dataLabel, item.dataUUID);
                  }}
                  style={
                    (tableRowStyle,
                    hoverIndex === index
                      ? tableRowHoverStyle
                      : tableRowHoverOutStyle)
                  }
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <td>{item.saveDate}</td>
                  <td>{item.dataLabel}</td>
                  <td>{item.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ButtonClose buttonName={"닫기"} handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
}
