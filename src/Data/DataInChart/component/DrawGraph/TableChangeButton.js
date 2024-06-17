import React from "react";

// Button 컴포넌트 정의
function TableChangeButton(props) {
  return (
    <div
      className="showBtn"
      onClick={() => props.setTableSaveClick(true)}
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
      {props.buttonName} {/* props로 받은 버튼 이름을 표시 */}
    </div>
  );
}

export default TableChangeButton;
