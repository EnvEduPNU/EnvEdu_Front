import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  width: 260px;
  max-width: 260px;
  position: absolute;
  top: 0;
  left: -260px;
  height: 100%;
  z-index: 1033;
  background-color: #fff;
  border-right: 1px solid #ccc;
  box-shadow: 5px 0 8px -5px rgba(0, 0, 0, 0.5);
  padding: 20px;
  color: rgba(0, 0, 0, 0.87);
  transition: 0.3s ease;
  ${props =>
    props.$isShow &&
    css`
      left: 0px;
    `}
`;

export const SubTitle = styled.div`
  display: block;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 20px;
  color: #7f3e99;
  border-bottom: 1px solid #dededf;
`;

export const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0px;
  gap: 30px;
  color: rgba(0, 0, 0, 0.87);
`;

export const Li = styled.li`
  cursor: pointer;
  color: rgba(40, 40, 40, 0.3);
  font-size: 14px;
  ${props =>
    props.$isActive &&
    css`
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    `}
`;

export const Overlay = styled.div`
  position: fixed;
  z-index: 1033;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  height: -webkit-fill-available;
  background: rgba(0, 0, 0, 0.6);
`;
