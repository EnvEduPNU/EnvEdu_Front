import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  padding: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  margin-bottom: 15px;
  & > * {
    width: 33%;
  }
`;

export const Box = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  /* background-color: rgba(0, 0, 0, 0.6); */
  svg {
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-left: 10px;
    margin-right: 50px;
  }
`;

export const Middle = styled.div`
  display: flex;

  justify-content: center;
`;

export const LastBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  .graphSelector {
    cursor: pointer;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    width: 160px;
    height: 100%;
    color: #000;
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-bottom: 6px solid #7f3f99;
  }
  /* ${props =>
    props.$isHighlight &&
    css`
      z-index: 1500 !important;
      position: relative;
    `} */
`;
