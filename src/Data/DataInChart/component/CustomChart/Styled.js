import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  width: 160vh;
  height: 65vh;
  border-radius: 5px;
  border: 1px solid rgba(34, 36, 38, 0.15);
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
  padding: 14px;
`;

export const Graph = styled.div``;
export const AcitwGraphWrapper = styled.div`
  position: "absolute";
  background-color: rgb(255, 255, 255);
  z-index: 1100;
  /* top: position.top;
              left: position.left;
              height: position.height;
              width: position.width; */
  overflow: "hidden";
  /* display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  border: 1px solid rgba(34, 36, 38, 0.15);
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
  padding: 14px; */
`;

export const ErrorMessage = styled.div`
  width: fit-content;
  border-radius: 5px;
  background-color: #fff6f6;
  color: #9f3a38;
  box-shadow: inset 0 0 0 1px #e0b4b4, 0 0 0 0 transparent;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 21px;
`;
