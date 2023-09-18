export const randomColor = (transparency = 0.5) =>
  `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  }, ${transparency})`;

export const colorsArray = [
  "rgba(31, 119, 180, 0.6)", // 청색
  "rgba(255, 127, 14, 0.6)", // 주황색
  "rgba(44, 160, 44, 0.6)", // 녹색
  "rgba(214, 39, 40, 0.6)", // 빨간색
  "rgba(148, 103, 189, 0.6)", // 보라색
  "rgba(140, 86, 75, 0.6)", // 갈색
  "rgba(227, 119, 194, 0.6)", // 분홍색
  "rgba(127, 127, 127, 0.6)", // 회색
  "rgba(188, 189, 34, 0.6)", // 노란색
  "rgba(23, 190, 207, 0.6)", // 청록색
];
