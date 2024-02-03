import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  max-width: 300px;
  height: 100%;
`;

export const Box = styled.div`
  width: 130px;
  padding: 10px 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  color: #333333;
  border: 1px solid rgba(34, 36, 38, 0.15);
  cursor: pointer;
  svg {
    width: 25px;
    height: 25px;
  }
  span {
    margin-left: 9px;
    white-space: nowrap;
  }
  border-bottom: 6px solid #f0f0f0;
  ${props =>
    props.$isSelect &&
    css`
      color: #000;
      background-color: #f0f0f0;
      border-bottom: 6px solid #7f3f99;
      transform: translateY(1px); /* 클릭 시 아래로 이동 효과 */
      box-shadow: 0 5px 5px hsla(0, 0%, 100%, 0.35);
    `}
`;
