import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: grey;
  z-index: 10000;
  padding-bottom: 30px;
  .pageCreateBtn {
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

export const PaperWrapper = styled.div`
  padding-top: 30px;
  box-sizing: border-box;
`;
export const Paper = styled.div`
  height: 842px;
  width: 595px;
  background-color: white;
  /* text-align: center; */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
