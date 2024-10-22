export const convertToNumber = (value) => {
  // 문자열이 숫자로 변환 가능한지 확인
  if (!isNaN(value)) {
    return Number(value); // 숫자로 변환
  }
  return value; // 변환 불가능한 경우 원래 값 반환
};
