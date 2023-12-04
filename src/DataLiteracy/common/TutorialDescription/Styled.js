import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  text-align: start;
  position: absolute;
  width: 300px;
  background-color: #ffffff;
  border-radius: 0.25rem;
  box-shadow: 0 6px 12px rgba(50, 50, 80, 0.06);
  display: flex;
  padding: 20px;
  line-height: 1.4;
  z-index: 1300;
  &::after {
    ${props =>
      props.$position === "right" &&
      css`
        content: "";
        position: absolute;
        right: -20px;
        top: 50%;
        margin-top: -10px;
        border-top: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid #ffffff;
      `}

    ${props =>
      props.$position === "bottom" &&
      css`
        content: "";
        position: absolute;
        bottom: -20px;
        left: 50%;
        margin-left: -10px;
        border-top: 10px solid #ffffff;
        border-right: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
      `}

    ${props =>
      props.$position === "left" &&
      css`
        content: "";
        position: absolute;
        left: -20px;
        top: 50%;
        margin-top: -10px;
        border-top: 10px solid transparent;
        border-right: 10px solid #ffffff;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
      `}

    ${props =>
      props.$position === "top" &&
      css`
        content: "";
        position: absolute;
        top: -20px;
        left: 50%;
        margin-left: -10px;
        border-top: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #ffffff;
        border-left: 10px solid transparent;
      `}
  }
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Title = styled.div`
  color: #263747 !important;
  font-size: 16px !important;
  font-weight: 600 !important;
`;

export const StepDescription = styled.span`
  color: #a6b4c2;
`;

export const ButtonWrapper = styled.div`
  display: flex;
`;

export const LeftButton = styled.div`
  width: fit-content;
  padding: 2px 6px 2px 8px;
  border-color: #0078ff;
  background-color: #0078ff;
  color: #fff;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0053f4;
  }
  ${props =>
    props.$isDisable &&
    css`
      background: #a6c9ff;
      &:hover {
        background-color: #a6c9ff;
      }
    `}
`;

export const RightButton = styled.div`
  width: fit-content;
  padding: 2px 8px 2px 6px;
  border-color: #0078ff;
  background-color: #0078ff;
  color: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0053f4;
  }

  ${props =>
    props.$isDisable &&
    css`
      background: #a6c9ff;
      &:hover {
        background-color: #a6c9ff;
      }
    `}
`;

export const Text = styled.span`
  font-size: 0.85rem !important;
  line-height: 1.5rem !important;
  font-weight: 600;
  color: #263747 !important;
`;
