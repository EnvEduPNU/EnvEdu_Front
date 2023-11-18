import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  span {
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }
  svg {
    cursor: pointer;
  }
  position: relative;
`;

export const Menu = styled.div`
  top: calc(100% - 3px);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  position: absolute;
  background-color: #fff;
  border: 1px solid rgba(34, 36, 38, 0.15);
`;

export const Item = styled.div`
  cursor: pointer;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  &:hover {
    background-color: #f7f7f7;
  }
  ${props =>
    props.$isSelect &&
    css`
      font-weight: 600;
      background-color: #f7f7f7;
    `}
`;
