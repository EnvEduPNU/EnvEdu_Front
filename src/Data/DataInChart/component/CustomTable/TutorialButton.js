import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TutorialSelector from "./TutorialSelector";

// Button 컴포넌트 정의
function TutorialButton({ buttonName }) {
  const navigator = useNavigate();
  const [buttonClick, setButtonClick] = useState(false);

  return (
    <>
      <div
        className="showBtn"
        onClick={() => setButtonClick(true)} // 클릭 이벤트 핸들러 추가
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
      {buttonClick && (
        <TutorialSelector
          buttonClick={buttonClick}
          setButtonClick={setButtonClick}
        />
      )}
    </>
  );
}

export default TutorialButton;
