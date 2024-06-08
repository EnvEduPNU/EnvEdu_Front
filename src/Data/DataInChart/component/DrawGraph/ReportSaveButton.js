import React from "react";

// 닫기 버튼 컴포넌트
function ReportSaveButton(props) {
  return (
    <div
      className="showBtn"
      onClick={() => props.handleClose()}
      style={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "0.9rem",
        fontWeight: "600",
        width: "7rem",
        height: "1.75rem",
        margin: "1rem 0rem",
        background: "#feecfe",
        borderRadius: "1rem",
        border: "none",
        marginRight: "0.75rem",
      }}
    >
      {props.buttonName}
    </div>
  );
}

export default ReportSaveButton;
