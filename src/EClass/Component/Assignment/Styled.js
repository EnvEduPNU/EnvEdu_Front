import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: grey;
  z-index: 10000;
  .pdfBtn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    border: none;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 2px #e4e4e4;
    background-color: white;
    cursor: pointer;
    transition: 1s;
  }
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
`;

export const ActivityWrapper = styled.div`
  width: 100%;
  padding: 5px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-radius: 5px;
`;

export const ActivityHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
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
