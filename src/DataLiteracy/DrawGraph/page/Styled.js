import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1031;
  box-sizing: border-box;
`;

export const GraphTapWrapper = styled.div`
  padding: 0px 30px;
  height: 100%;
`;

export const GraphWrapper = styled.div`
  box-sizing: border-box;
  margin: 10px 0;
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 30px;
  height: 80%;
  /* height: 693px;
  max-height: 693px; */
`;
