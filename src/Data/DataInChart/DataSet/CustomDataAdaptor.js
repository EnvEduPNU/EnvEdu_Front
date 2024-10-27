function CustomDataAdaptor() {
  const transformData = (data) => {
    const numericFields = data.numericFields;
    const categoricFields = data.stringFields;

    // 첫 번째 헤더 배열 및 데이터 배열 생성
    const firstHeaders = [];
    const allKeys = new Set(); // 중복 키를 체크하기 위한 Set

    // 헤더 구성
    [...numericFields, ...categoricFields].forEach((item) => {
      Object.keys(item).forEach((key) => {
        const order = item[key].order;

        if (!allKeys.has(key)) {
          allKeys.add(key);
          firstHeaders.push({ key, order });
        }
      });
    });

    // 첫 번째 헤더 정렬
    const sortedFirstHeaders = firstHeaders
      .sort((a, b) => a.order - b.order)
      .map((h) => h.key);

    // numeric과 categoric 데이터를 개별적으로 저장
    const numericRows = numericFields.map((item) => {
      const rowData = new Array(sortedFirstHeaders.length).fill(null);
      Object.keys(item).forEach((key) => {
        const value = item[key].value;
        const headerIndex = sortedFirstHeaders.indexOf(key);
        if (value !== null && value !== undefined) {
          rowData[headerIndex] = value;
        }
      });
      return rowData;
    });

    const categoricRows = categoricFields.map((item) => {
      const rowData = new Array(sortedFirstHeaders.length).fill(null);
      Object.keys(item).forEach((key) => {
        const value = item[key].value;
        const headerIndex = sortedFirstHeaders.indexOf(key);
        if (value !== null && value !== undefined) {
          rowData[headerIndex] = value;
        }
      });
      return rowData;
    });

    // numeric과 categoric 데이터를 병합하여 rows 생성
    const rows = numericRows.map((numericRow, index) => {
      const categoricRow = categoricRows[index] || [];
      return numericRow.map((value, colIndex) =>
        value !== null && value !== undefined ? value : categoricRow[colIndex],
      );
    });

    // 최종 배열 생성
    const finalData = [
      [...sortedFirstHeaders], // 첫 번째 행에 헤더들 추가
      ...rows, // 병합된 행 추가
    ];

    return finalData;
  };

  // 값을 반환하는 함수
  const getTransformedData = (data) => {
    const transformedData = transformData(data);
    return transformedData;
  };

  return { getTransformedData }; // getTransformedData 반환
}

export default CustomDataAdaptor;
