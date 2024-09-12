import { Button } from "react-bootstrap";
import { customAxios } from "../../../Common/CustomAxios";
import { useGraphDataStore } from "../../../Study/store/graphStore";

const engToKor = name => {
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

function SeedForStudent() {
  const setData = useGraphDataStore(state => state.setData);

  const getTable = (type, id) => {
    let path = "";
    if (type === "OCEANQUALITY") {
      path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
    } else if (type === "AIRQUALITY") {
      path = `/air-quality/mine/chunk?dataUUID=${id}`;
    } else if (type === "SEED") {
      path = `/seed/mine/chunk?dataUUID=${id}`;
    }

    customAxios
      .get(path)
      .then(res => {
        let headers = Object.keys(res.data[0]).filter(
          key =>
            key !== "id" &&
            key !== "dataUUID" &&
            key !== "saveDate" &&
            key !== "dateString"
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
          const isAllZero = res.data.every(item => item[attribute] === 0);
          // 해당 속성이 모두 0일 때, headers에서 제거
          if (isAllZero) {
            headers = headers.filter(header => header !== attribute);
          }
        }

        headers = headers.map(header => engToKor(header));

        // 각각의 딕셔너리에서 값만 추출하여 리스트로 변환
        const keysToExclude = ["id", "dataUUID", "saveDate", "dateString"];

        const values = res.data.map(item => {
          const filteredItem = Object.keys(item)
            .filter(key => !keysToExclude.includes(key))
            .reduce((obj, key) => {
              obj[key] = item[key];
              return obj;
            }, {});
          return Object.values(filteredItem);
        });

        // 최종 결과 생성 (헤더 + 값)
        const recombined = [headers, ...values];
        setData(recombined);
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const getData = () => {
    customAxios
      .get("/mydata/list")
      .then(res => {
        const lastElement = res.data[res.data.length - 1];
        const type = lastElement.dataLabel;
        const id = lastElement.dataUUID;
        getTable(type, id);
      })
      .catch(err => console.log(err));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <a href="/socket" target="_blank">
        <Button variant="dark">측정하러 가기</Button>
      </a>

      <Button variant="dark" style={{ marginTop: "0.5rem" }} onClick={getData}>
        측정한 값 가져오기
      </Button>
    </div>
  );
}

export default SeedForStudent;
