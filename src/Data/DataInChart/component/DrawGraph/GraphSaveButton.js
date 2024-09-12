import React from "react";

// 닫기 버튼 컴포넌트
function GraphSaveButton(props) {
  return (
    <div
      className="showBtn"
      onClick={() => props.setPdfClick(true)}
      style={{
        position: "relative",
        cursor: "pointer",
        justifyContent: "center",
        textAlign: "center",
        fontWeight: 600,
        fontSize: "18px",
        width: "160px",
        height: "5vh",
        margin: "2vh 0 2vh 2vh",
        paddingTop: "5px",
        color: "#000",
        border: "1px solid rgba(34, 36, 38, 0.15)",
        borderBottom: "6px solid #7f3f99",
      }}
    >
      {props.buttonName}
    </div>
  );
}

export default GraphSaveButton;
