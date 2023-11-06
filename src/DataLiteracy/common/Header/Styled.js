import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  margin-bottom: 30px;
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
`;
