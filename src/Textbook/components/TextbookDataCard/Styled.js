import styled from "styled-components";

export const Wrapper = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  padding: 20px 20px;
`;

export const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

export const Description = styled.div`
  font-size: 16px;
`;

export const Tags = styled.div`
  display: flex;
  gap: 5px;
  justify-content: flex-end;
`;
