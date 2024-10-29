const NumericTypes = new Set([
  '강수일수',
  '평균 강수량',
  '평균기온 (℃)',
  '강수량 (mm)',
  '일조시간 (hr)',
  '기온',
  '무게 %',
  '맑은날 이용인원',
  '강우 이용인원',
  '강설 이용인원',
  '플라스틱',
  '스티로폼',
  '나무류',
  '강수량',
  '도심지역',
  '서북지역',
  '동남지역',
  '수온(°C)',
  'pH',
  'DO(㎎/L)',
  'BOD(㎎/L)',
  'COD(㎎/L)',
  '총질소(㎎/L)',
  '총인(㎎/L)',
  '투명도(㎎/L)',
  '클로로필-a(㎎/L)',
  '전기전도도(µS/㎝)',
  'TOC(㎎/L)',
  '아황산가스 농도(ppm)',
  '일산화탄소 농도(ppm)',
  '오존 농도(ppm)',
  '이산화질소 농도(ppm)',
  '미세먼지(PM10) 농도(㎍/㎥)',
  '미세먼지(PM2.5)  농도(㎍/㎥)',
  '저장 주기',
  '사용자명',
  '습도',
  '기온',
  '탁도',
  'pH',
  '미세먼지',
  '용존산소량',
  '이산화탄소',
  '조도',
  '토양 습도',
  '기압',
]);

const CategoricalTypes = new Set([
  '지역',
  '농업지대',
  '도시',
  '분류',
  '월',
  '연도',
  '조사지점명',
  '측정연도',
  '측정월',
  '측정일',
  '소속',
]);

export const selectVariableType = (name) => {
  if (NumericTypes.has(name)) {
    return 'Numeric';
  }

  if (CategoricalTypes.has(name)) {
    return 'Categorical';
  }

  return null;
};
