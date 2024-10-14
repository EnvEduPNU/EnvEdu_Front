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
]);

const CategoricalTypes = new Set([
  '지역',
  '농업지대',
  '도시',
  '분류',
  '월',
  '연도',
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
