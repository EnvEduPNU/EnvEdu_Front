import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow-y: scroll;
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

export const ButtonSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LabelInputWrapper = styled.div`
  display: flex;
  gap: 30px;
`;
