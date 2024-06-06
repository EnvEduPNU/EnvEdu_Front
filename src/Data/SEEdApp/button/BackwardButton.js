import React from "react";
import { useNavigate } from "react-router-dom";

// Button 컴포넌트 정의
function BackwardButton({ buttonName }) {
  const navigator = useNavigate();

  const goBack = () => {
    navigator(-1);
  };

  return (
    <div
      className="showBtn"
      onClick={() => goBack()} // 클릭 이벤트 핸들러 추가
      style={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "0.9rem",
        fontWeight: "600",
        width: "15rem",
        height: "1.75rem",
        margin: "1rem 0rem",
        background: "#feecfe",
        borderRadius: "1rem", // 올바른 '1rem' 표기로 수정
        border: "none",
        marginRight: "0.75rem",
      }}
    >
      {buttonName} {/* props로 받은 버튼 이름을 표시 */}
    </div>
  );
}

export default BackwardButton;
