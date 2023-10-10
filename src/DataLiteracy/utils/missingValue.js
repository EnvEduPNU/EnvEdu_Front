function isNumericColumn(data, colIndex) {
  for (let i = 1; i < data.length; i++) {
    // Start from 1 to skip header row
    if (data[i][colIndex] !== null && typeof data[i][colIndex] !== "number") {
      return false;
    }
  }
  return true;
}

export function meanImputation(data) {
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
    if (rowIndex === 0) return row; // Header row remains unchanged
    return row.map((cell, colIndex) =>
      cell === null && columnMeans[colIndex] !== null
        ? columnMeans[colIndex]
        : cell
    );
  });
}

// 중앙값 대체
export function medianImputation(data) {
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
    if (rowIndex === 0) return row; // Header row remains unchanged
    return row.map((cell, colIndex) =>
      cell === null ? columnMedians[colIndex] : cell
    );
  });
}

// 최빈값 대체
export function modeImputation(data) {
  let columnModes = [];

  for (let col = 1; col < data[0].length; col++) {
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
    if (rowIndex === 0) return row; // Header row remains unchanged
    return row.map((cell, colIndex) =>
      cell === null ? columnModes[colIndex] : cell
    );
  });
}

// 선형 보간법
export function linearInterpolation(data) {
  let newData = data.map(v => [...v]);

  for (let col = 0; col < data[0].length; col++) {
    if (isNumericColumn(data, col)) {
      for (let row = 1; row < newData.length; row++) {
        if (newData[row][col] === null) {
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
