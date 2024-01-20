import styled from "styled-components";

export const Wrapper = styled.div`
  width: 595px;
  display: flex;
  align-items: center;
  padding: 0 25px;
  height: 45px;
  background-color: #f7f9fc;
  border-bottom: 1px solid #ebedf2;
  border-radius: 3px 3px 0 0;
`;

export const Tool = styled.button`
  width: fit-content;
  min-width: 32px;
  height: 32px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* font-size: 1.75rem; */
  cursor: pointer;
  flex-shrink: 0;
  background: inherit;
  outline: none;
  border: none;
  &:hover {
    background-color: #fff;
    border: 1px solid #dadde6;
    border-radius: 3px;
  }
`;

export const ToolGroup = styled.div`
  display: flex;
  gap: 5px;
`;
export const Bar = styled.div`
  display: inline-block;
  width: 1px;
  height: 18px;
  background-color: #e1e3e9;
  margin: 14px 12px;
`;
