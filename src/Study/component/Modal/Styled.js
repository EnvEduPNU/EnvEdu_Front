import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1051;
  transform: translate(-50%, -50%);
`;

export const Block = styled.div`
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 20px;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  height: -webkit-fill-available;
  background: rgba(0, 0, 0, 0.6);
`;
