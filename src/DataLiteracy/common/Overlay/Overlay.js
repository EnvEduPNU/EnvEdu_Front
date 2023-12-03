import * as Styled from "./Styled";

function Overlay({ position }) {
  return (
    <>
      <div
        className="top-dark"
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1100,
          top: 0,
          left: position.left,
          height: position.top,
          width: position.width, // width 계산
          overflow: "hidden",
        }}
      ></div>
      <div
        className="left-dark"
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1100,
          top: 0,
          left: 0,
          height: position.top + position.height + position.bottom,
          width: position.left,
        }}
      ></div>
      <div
        className="right-dark"
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1100,
          top: 0,
          left: position.left + position.width,
          height: position.top + position.height + position.bottom,
          width: position.right, // width 계산
          overflow: "hidden",
        }}
      ></div>
      <div
        className="bottom-dark"
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1100,
          top: position.top + position.height,
          left: position.left,
          height: position.bottom,
          width: position.width, // width 계산
          overflow: "hidden",
        }}
      ></div>
    </>
  );
}

export default Overlay;
