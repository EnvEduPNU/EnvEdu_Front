import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  span {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.87);
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;

  background: transparent;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  line-height: normal;

  /* Corrects font smoothing for webkit */
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  padding: 0 5px;
  min-width: fit-content;
  width: 35px;
  height: 25px;
  border-radius: 5px;
  font-weight: 700;
  line-height: 1em;
  font-size: 14px;
  font-style: normal;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  background: #e0e1e2 none;
  cursor: pointer;

  ${props =>
    props.$isSelected &&
    css`
      color: #fff;
      background-color: #d01919;
    `}
`;
