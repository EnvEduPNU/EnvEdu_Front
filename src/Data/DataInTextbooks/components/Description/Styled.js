import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 50%;
  height: 200px;
  color: rgba(0, 0, 0, 0.87);
  padding: 16px;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 5px;
  /* background: rgba(0, 0, 0, 0.25); */
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
`;

export const SubTitle = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
`;
