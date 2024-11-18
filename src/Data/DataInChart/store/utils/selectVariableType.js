const NumericTypes = new Set([
  // 전문가 데이터
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
  // 수질
  '회차',
  '수심',
  '수온',
  '용존 산소',
  'BOD',
  'COD',
  '부유물',
  '총 질소',
  '총인',
  '총유기탄소',
  // 대기질
  '산소 농도(ppm)',
  '오존 농도(ppm)',
  '미세먼지(PM10) 농도(㎍/㎥)',
  '미세먼지(PM2.5) 농도(㎍/㎥)',
  '아황산가스 농도(ppm)',
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
