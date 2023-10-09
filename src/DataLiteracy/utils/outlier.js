function isNumericColumn(data, colIndex) {
  for (let i = 1; i < data.length; i++) {
    if (data[i][colIndex] !== null && typeof data[i][colIndex] !== "number") {
      return false;
    }
  }
  return true;
}

function getColumnData(data, colIndex) {
  return data.slice(1).map(row => row[colIndex]);
}

function processOutliers(data, colIndex, outlierFunction) {
  if (!isNumericColumn(data, colIndex)) return getColumnData(data, colIndex);

  let columnData = getColumnData(data, colIndex);
  let outliers = new Set(outlierFunction(columnData));

  return columnData.map(val => {
    if (outliers.has(val)) {
      return NaN; // 이상치에 대한 처리. 예: NaN으로 설정
    }
    return val;
  });
}

export function processDatasetByMethod(data, method) {
  let result = [data[0]]; // 헤더는 그대로 복사
  for (let i = 0; i < data[0].length; i++) {
    let processedColumn = processOutliers(data, i, method);
    for (let j = 0; j < processedColumn.length; j++) {
      if (result[j + 1]) {
        result[j + 1].push(processedColumn[j]);
      } else {
        result.push([processedColumn[j]]);
      }
    }
  }
  return result;
}

// Z-Score
export function findOutliersByZScore(data) {
  let sum = data.reduce((acc, val) => acc + val, 0);
  let mean = sum / data.length;

  let variance =
    data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  let stdDev = Math.sqrt(variance);

  let zScores = data.map(val => (val - mean) / stdDev);

  return data.filter((val, idx) => Math.abs(zScores[idx]) > 2);
}

// IQR (Interquartile Range)
export function findOutliersByIQR(data) {
  let sortedData = [...data].sort((a, b) => a - b);
  let q1 = sortedData[Math.floor(sortedData.length * 0.25)];
  let q3 = sortedData[Math.floor(sortedData.length * 0.75)];

  let iqr = q3 - q1;
  let lowerBound = q1 - 1.5 * iqr;
  let upperBound = q3 + 1.5 * iqr;

  return data.filter(val => val < lowerBound || val > upperBound);
}

// MAD (Median Absolute Deviation)
export function findOutliersByMAD(data) {
  let median = findMedian(data);
  let devs = data.map(val => Math.abs(val - median));
  let mad = findMedian(devs);

  let threshold = 2;
  let modifiedZScore = devs.map(dev => (0.6745 * dev) / mad);

  return data.filter((val, idx) => modifiedZScore[idx] > threshold);
}

function findMedian(data) {
  let sortedData = [...data].sort((a, b) => a - b);
  let half = Math.floor(sortedData.length / 2);

  if (sortedData.length % 2) return sortedData[half];
  return (sortedData[half - 1] + sortedData[half]) / 2.0;
}
