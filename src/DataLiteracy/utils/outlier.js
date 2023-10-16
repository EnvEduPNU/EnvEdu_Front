function isNumericColumn(data, colIndex) {
  for (let i = 1; i < data.length; i++) {
    if (typeof data[i][colIndex] !== "number") {
      return false;
    }
  }
  return true;
}

function findMedian(columnData) {
  let sortedData = [...columnData].sort((a, b) => a - b);
  let half = Math.floor(sortedData.length / 2);

  if (sortedData.length % 2) return sortedData[half];
  return (sortedData[half - 1] + sortedData[half]) / 2.0;
}

export function findOutliersIndicesByZScore(data) {
  let outlierIndices = [];
  data[0].forEach((header, colIndex) => {
    if (!isNumericColumn(data, colIndex)) return;

    let columnData = data.map(row => row[colIndex]).slice(1);
    let mean =
      columnData.reduce((acc, val) => acc + val, 0) / columnData.length;
    let variance =
      columnData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      columnData.length;
    let stdDev = Math.sqrt(variance);
    let zScores = columnData.map(val => (val - mean) / stdDev);

    columnData.forEach((val, rowIndex) => {
      if (Math.abs(zScores[rowIndex]) > 2) {
        outlierIndices.push([rowIndex + 1, colIndex]);
      }
    });
  });

  return outlierIndices;
}

export function findOutliersIndicesByIQR(data) {
  let outlierIndices = [];

  data[0].forEach((header, colIndex) => {
    if (!isNumericColumn(data, colIndex)) return;

    let columnData = data
      .map(row => row[colIndex])
      .slice(1) // 첫 번째 행은 헤더이므로 제외
      .filter(val => val !== null) // null 값을 제외
      .sort((a, b) => a - b);

    let q1 = columnData[Math.floor(columnData.length * 0.25)];
    let q3 = columnData[Math.floor(columnData.length * 0.75)];
    let iqr = q3 - q1;
    let lowerBound = q1 - 1.5 * iqr;
    let upperBound = q3 + 1.5 * iqr;

    data.slice(1).forEach((row, rowIndex) => {
      // 첫 번째 행은 헤더이므로 제외
      const val = row[colIndex];
      if (val !== null && (val < lowerBound || val > upperBound)) {
        outlierIndices.push([rowIndex + 1, colIndex]);
      }
    });
  });

  return outlierIndices;
}

export function findOutliersIndicesByMAD(data) {
  let outlierIndices = [];
  data[0].forEach((header, colIndex) => {
    if (!isNumericColumn(data, colIndex)) return;

    let columnData = data.map(row => row[colIndex]).slice(1);
    let median = findMedian(columnData);
    let devs = columnData.map(val => Math.abs(val - median));
    let mad = findMedian(devs);
    let threshold = 2;
    let modifiedZScores = devs.map(dev => (0.6745 * dev) / mad);

    columnData.forEach((val, rowIndex) => {
      if (modifiedZScores[rowIndex] > threshold) {
        outlierIndices.push([rowIndex + 1, colIndex]);
      }
    });
  });

  return outlierIndices;
}

export function replaceOutliersWithMean(data, outliersIndices) {
  let columnMeans = [];

  for (let col = 0; col < data[0].length; col++) {
    if (isNumericColumn(data, col)) {
      let sum = 0;
      let count = 0;
      for (let row = 1; row < data.length; row++) {
        if (data[row][col] !== null) {
          sum += data[row][col];
          count++;
        }
      }
      columnMeans[col] = count !== 0 ? sum / count : null;
    } else {
      columnMeans[col] = null;
    }
  }

  return data.map((row, rowIndex) => {
    if (rowIndex === 0) return row;
    return row.map((cell, colIndex) => {
      if (
        outliersIndices.some(
          indices => indices[0] === rowIndex && indices[1] === colIndex
        )
      ) {
        return columnMeans[colIndex];
      }
      return cell;
    });
  });
}

export function replaceOutliersWithMedian(data, outliersIndices) {
  let columnMedians = [];

  for (let col = 0; col < data[0].length; col++) {
    if (isNumericColumn(data, col)) {
      let sorted = data
        .slice(1)
        .map(row => row[col])
        .filter(val => val !== null)
        .sort((a, b) => a - b);
      let median;
      if (sorted.length % 2 === 0) {
        median =
          (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
      } else {
        median = sorted[Math.floor(sorted.length / 2)];
      }
      columnMedians[col] = median;
    }
  }

  return data.map((row, rowIndex) => {
    if (rowIndex === 0) return row;
    return row.map((cell, colIndex) => {
      if (
        outliersIndices.some(
          indices => indices[0] === rowIndex && indices[1] === colIndex
        )
      ) {
        return columnMedians[colIndex];
      }
      return cell;
    });
  });
}

export function replaceOutliersWithMode(data, outliersIndices) {
  let columnModes = [];

  for (let col = 0; col < data[0].length; col++) {
    if (isNumericColumn(data, col)) {
      let modeMap = {};
      let maxCount = 0;
      let mode;
      data.slice(1).forEach(row => {
        let val = row[col];
        if (val !== null) {
          modeMap[val] = (modeMap[val] || 0) + 1;
          if (modeMap[val] > maxCount) {
            maxCount = modeMap[val];
            mode = val;
          }
        }
      });
      columnModes[col] = mode;
    }
  }

  return data.map((row, rowIndex) => {
    if (rowIndex === 0) return row;
    return row.map((cell, colIndex) => {
      if (
        outliersIndices.some(
          indices => indices[0] === rowIndex && indices[1] === colIndex
        )
      ) {
        return columnModes[colIndex];
      }
      return cell;
    });
  });
}

export function replaceOutliersWithLinearInterpolation(data, outliersIndices) {
  let newData = data.map(v => [...v]);

  for (let col = 0; col < data[0].length; col++) {
    if (isNumericColumn(data, col)) {
      for (let row = 1; row < newData.length; row++) {
        if (
          outliersIndices.some(
            indices => indices[0] === row && indices[1] === col
          )
        ) {
          let prevIndex = row - 1;
          while (prevIndex >= 1 && newData[prevIndex][col] === null) {
            prevIndex--;
          }
          let nextIndex = row + 1;
          while (
            nextIndex < newData.length &&
            newData[nextIndex][col] === null
          ) {
            nextIndex++;
          }
          let prevValue = prevIndex >= 1 ? newData[prevIndex][col] : null;
          let nextValue =
            nextIndex < newData.length ? newData[nextIndex][col] : null;

          if (prevValue !== null && nextValue !== null) {
            newData[row][col] = (prevValue + nextValue) / 2;
          } else if (prevValue !== null) {
            newData[row][col] = prevValue;
          } else if (nextValue !== null) {
            newData[row][col] = nextValue;
          }
        }
      }
    }
  }

  return newData;
}
