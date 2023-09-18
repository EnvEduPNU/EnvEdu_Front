export const randomColor = (transparency = 0.5) =>
  `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  }, ${transparency})`;
