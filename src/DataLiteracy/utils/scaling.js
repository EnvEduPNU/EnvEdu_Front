function log10(val) {
  return Math.log(val) / Math.LN10;
}

function roundToOneDecimalPlace(num) {
  return Math.round(num * 10) / 10;
}

function isNumericColumn(data, colIndex) {
  for (let i = 1; i < data.length; i++) {
    if (data[i][colIndex] !== null && typeof data[i][colIndex] !== "number") {
      return false;
    }
  }
  return true;
}

export function minMaxScalingForDataset(dataset) {
  const scaledDataset = dataset.map(v => [...v]);
  for (let colIndex = 0; colIndex < scaledDataset[0].length; colIndex++) {
    if (!isNumericColumn(scaledDataset, colIndex)) continue;
    const columnData = dataset.map(row => row[colIndex]).slice(1);
    const min = Math.min(...columnData);
    const max = Math.max(...columnData);
    for (let rowIndex = 1; rowIndex < scaledDataset.length; rowIndex++) {
      scaledDataset[rowIndex][colIndex] = roundToOneDecimalPlace(
        (scaledDataset[rowIndex][colIndex] - min) / (max - min)
      );
    }
  }
  return scaledDataset;
}

export function zScoreNormalizationForDataset(dataset) {
  const normalizedDataset = dataset.map(v => [...v]);
  for (let colIndex = 0; colIndex < normalizedDataset[0].length; colIndex++) {
    if (!isNumericColumn(normalizedDataset, colIndex)) continue;
    const columnData = normalizedDataset.map(row => row[colIndex]).slice(1);
    const mean =
      columnData.reduce((acc, v) => acc + (v || 0), 0) / columnData.length;
    const variance =
      columnData.reduce((acc, v) => acc + Math.pow((v || 0) - mean, 2), 0) /
      columnData.length;
    const stdDev = Math.sqrt(variance);
    for (let rowIndex = 1; rowIndex < normalizedDataset.length; rowIndex++) {
      normalizedDataset[rowIndex][colIndex] = roundToOneDecimalPlace(
        (normalizedDataset[rowIndex][colIndex] - mean) / stdDev
      );
    }
  }
  return normalizedDataset;
}

export function logTransformForDataset(dataset) {
  const logDataset = dataset.map(v => [...v]);
  for (let colIndex = 0; colIndex < logDataset[0].length; colIndex++) {
    if (!isNumericColumn(logDataset, colIndex)) continue;
    for (let rowIndex = 1; rowIndex < logDataset.length; rowIndex++) {
      const value = logDataset[rowIndex][colIndex];
      logDataset[rowIndex][colIndex] =
        value > 0 ? roundToOneDecimalPlace(log10(value)) : value;
    }
  }
  return logDataset;
}

export function sqrtTransformForDataset(dataset) {
  const sqrtDataset = dataset.map(v => [...v]);
  for (let colIndex = 0; colIndex < sqrtDataset[0].length; colIndex++) {
    if (!isNumericColumn(sqrtDataset, colIndex)) continue;
    for (let rowIndex = 1; rowIndex < sqrtDataset.length; rowIndex++) {
      const value = sqrtDataset[rowIndex][colIndex];
      sqrtDataset[rowIndex][colIndex] =
        value >= 0 ? roundToOneDecimalPlace(Math.sqrt(value)) : value;
    }
  }
  return sqrtDataset;
}
