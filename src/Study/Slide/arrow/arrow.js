import React from "react";
import { ReactComponent as ArrowIcon } from "../../image/rightarrow.svg";

function Arrow({ direction, onClick, style }) {
  // 방향에 따른 회전 각도 설정
  const getRotation = () => {
    switch (direction) {
      case "left":
        return "rotate(180deg)";
      case "top":
        return "rotate(-90deg)";
      case "bottom":
        return "rotate(90deg)";
      default:
        return "rotate(0deg)";
    }
  };

  // style 객체에서 기존의 transform 값을 가져오기
  const currentTransform = style.transform || "";

  return (
    <ArrowIcon
      onClick={onClick}
      style={{
        ...style,
        transform: `${currentTransform} ${getRotation()}`,
        cursor: "pointer",
      }}
    />
  );
}

export default Arrow;
