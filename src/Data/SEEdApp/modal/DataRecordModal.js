import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function DataRecordModal(props) {
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>데이터 기록하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: "flex" }}>
          <div style={labelStyle}>시간 간격</div>
          <input
            style={inputStyle}
            value={props.period}
            onChange={(e) => props.setPeriod(e.target.value)}
            placeholder="단위는 초"
          />
        </div>
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <div style={labelStyle}>측정 위치</div>
          <input
            style={inputStyle}
            value={props.location}
            onChange={(e) => props.setLocation(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", marginTop: "1rem" }}>
          <div style={labelStyle}>메모</div>
          <input
            style={inputStyle}
            value={props.memo}
            onChange={(e) => props.setMemo(e.target.value)}
          />
        </div>
        <Button
          style={buttonStyle}
          onClick={() => {
            props.onHide();
            props.setSaveTest(true);
          }}
        >
          확인
        </Button>
      </Modal.Body>
    </Modal>
  );
}

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "1.25rem",
  width: "11rem",
  height: "2rem",
  borderRadius: "1.25rem",
  background: "#CBE0FF",
  marginRight: "1.5rem",
};

const inputStyle = {
  width: "40%",
  height: "2rem",
  borderRadius: "0.625rem",
  background: "#fff",
  border: "1px solid #d2d2d2",
  outline: "none",
  fontSize: "1.25rem",
  padding: "0 1rem",
  marginRight: "1rem",
};

const buttonStyle = {
  width: "10rem",
  borderRadius: "1.25rem",
  background: "#d9dcff",
  border: "none",
  color: "#000",
  fontSize: "1.25rem",
};

export default DataRecordModal;
