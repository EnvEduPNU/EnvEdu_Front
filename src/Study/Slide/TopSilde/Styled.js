import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  min-height: 260px;
  position: absolute;
  left: 0;
  top: ${props =>
    props.$height > 260 ? `${props.$height * -1 + 10}px` : "-250px"};
  z-index: 1033;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  box-shadow: 5px -5px 5px 5px rgba(0, 0, 0, 0.5);
  padding: 10px;
  color: rgba(0, 0, 0, 0.87);
  transition: 0.3s ease;
  ${props =>
    props.$isShow &&
    css`
      top: 0px;
      z-index: 1034;
    `}
`;
