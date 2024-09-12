import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  background-color: #f1f3f5;
  width: 100%;
  position: relative;
  border: 1px solid #e9ebee;
  border-radius: 4px;
  padding-top: 52.51%;
`;

export const Preview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${props =>
    props.$isImg &&
    css`
      justify-content: flex-end;
      align-items: flex-end;
    `}

  position: absolute;
  left: 0;
  top: 0;
  padding: 12px;
  width: 100%;
  height: 100%;

  &::before {
    content: "이미지 업로드";
    display: block;

    font-weight: 400;
    line-height: 1.43;
    letter-spacing: -0.3px;
    font-size: 14px;
    color: #fff;
    padding: 10px 12px;
    border-radius: 4px;
    background-color: #858a8d;
    z-index: 1;
    ${props =>
      props.$isImg &&
      css`
        display: none;
      `}
  }

  &::after {
    content: "변경하기";
    display: block;
    font-weight: 400;
    line-height: 1.43;
    letter-spacing: -0.3px;
    font-size: 14px;
    color: #fff;
    display: none;
    padding: 10px 12px;
    border-radius: 4px;
    background-color: #858a8d;
    z-index: 1;

    ${props =>
      props.$isImg &&
      css`
        display: block;
      `}
  }
  cursor: pointer;
`;

export const Img = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: 50% 50%;
  object-position: 50% 50%;
  max-width: 100%;
  display: block;
  margin: 0;
`;
