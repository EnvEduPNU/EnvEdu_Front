import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
`;

export const Button = styled.button`
  width: fit-content;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  padding: 5px 10px;
  &:hover {
    background-color: #7f3e99;
    color: #fff;
  }
`;
