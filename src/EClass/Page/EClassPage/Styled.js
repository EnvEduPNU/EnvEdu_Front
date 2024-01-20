import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: grey;
  z-index: 10000;
`;
export const Paper = styled.div`
  height: 842px;
  width: 595px;
  margin: 30px;
  background-color: white;
  /* text-align: center; */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 3px solid blue;
  cursor: pointer;
  overflow-y: hidden;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #7f3e99;
  text-align: center;
`;

export const SutTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
`;

export const TableWrapper = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
