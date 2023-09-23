export const DRAW_GRAPH = "drawGraph";

export const storeLocalStorage = (localStorageKey, key, value) => {
  const localStorageValue = JSON.parse(localStorage.getItem(localStorageKey));
  localStorage.setItem(
    localStorageKey,
    JSON.stringify({
      ...localStorageValue,
      [key]: value,
    })
  );
};

export const getLocalStorage = (localStorageKey, key) => {
  const localStorageValue =
    JSON.parse(localStorage.getItem(localStorageKey)) || null;
  if (localStorageValue === null) return null;
  return localStorageValue[key];
};

export const getAxisScale = graph => {
  const drawGraph = JSON.parse(localStorage.getItem(DRAW_GRAPH));
  const selectedGraph = drawGraph?.selectedGraph;
  if (selectedGraph === null || selectedGraph !== graph) return null;
  return drawGraph.axisScale;
};
