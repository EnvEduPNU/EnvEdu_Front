import styled from "styled-components";

export const Wrapper = styled.div`
  border: 1px solid rgba(34, 36, 38, 0.1);
  border-top: none;
`;

export const Box = styled.div`
  display: flex;
`;

export const Number = styled.div`
  box-sizing: border-box;
  width: 50px;
  height: 50px;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(34, 36, 38, 0.1);
  border-right: 1px solid rgba(34, 36, 38, 0.1);
`;

export const Data = styled.div`
  width: 100%;
  border-top: 1px solid rgba(34, 36, 38, 0.1);
  height: 50px;
  color: rgba(0, 0, 0, 0.87);
  padding-left: 0.6em;
  padding-right: 0.6em;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #f2f2f2;
    cursor: pointer;
  }
`;
