import styled from "styled-components";

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
