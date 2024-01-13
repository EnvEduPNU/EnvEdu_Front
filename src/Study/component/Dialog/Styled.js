import styled from "styled-components";

export const Wrapper = styled.div`
  min-width: 333px;
  max-width: calc(100vw - 32px);
  padding: 20px 20px 80px;
  display: flex;
  flex-direction: column;
  .confirm_button {
    align-self: center;
    border-radius: 90px;
    max-width: 208px;
  }
`;

export const header = styled.div`
  text-align: end;
  svg {
    cursor: pointer;
  }
`;

export const Contents = styled.div`
  margin-bottom: 39px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  .content {
    align-self: flex-start;
  }
`;

export const SubText = styled.div`
  margin-top: 16px;
  text-align: center;
  font-weight: 400;
  font-size: 15px;
  line-height: 19px;
  letter-spacing: -0.005em;
  color: #ccc;
`;
