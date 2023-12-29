import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  width: 160px;
  height: 100%;
  color: #000;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-bottom: 6px solid #7f3f99;
  .tutorial-description {
    position: absolute;
    top: 65px;
    right: 0px;
  }
`;
