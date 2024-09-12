//항목 이름 (한국어 -> 영어)
export const engToKor = (name) => {
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
