import styled from "styled-components";

export const Wrapper = styled.div``;

export const Paper = styled.div`
  height: 842px;
  width: 595px;
  background-color: white;
  /* text-align: center; */
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  overflow-y: hidden;
`;

export const ActivityWrapper = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  /* gap: 3px; */
  border-radius: 5px;
`;

export const ActivityEditHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 5px;
`;
