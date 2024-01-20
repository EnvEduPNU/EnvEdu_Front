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
