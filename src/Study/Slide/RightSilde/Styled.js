import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  min-width: 260px;
  max-width: 90%;
  position: absolute;
  top: 0;
  right: ${props =>
    props.$width > 260 ? `${props.$width * -1 + 10}px` : "-250px"};
  height: 100%;
  z-index: 1033;
  background-color: #fff;
  border-left: 1px solid #ccc;
  box-shadow: -5px 0 8px -5px rgba(0, 0, 0, 0.5);
  padding: 10px;
  color: rgba(0, 0, 0, 0.87);
  transition: 0.3s ease;
  ${props =>
    props.$isShow &&
    css`
      right: 0px;
      z-index: 1034;
    `}
`;
