import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: #fff;
  z-index: 10000;
  padding-top: 30px;
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
  margin-top: 30px;
  border: 1px solid #ced4da;
  border-radius: 4px;
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
  color: #212529;
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

export const Block = styled.div`
  width: 595px;
`;

export const Label = styled.label`
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: -0.3px;
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
  color: #1b1c1d;
`;

export const InputWrapper = styled.div`
  width: 595px;
  display: flex;
  padding: 10px 12px;
  letter-spacing: -0.3px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: #fff;
  &:focus-within {
    border: 1px solid #00c471;
  }
`;

export const Input = styled.input`
  padding: 0;
  width: 100%;
  line-height: 1.43;
  letter-spacing: -0.3px;
  font-size: 14px;
  border: 0;
  background: none;

  &:focus {
    outline: none;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  resize: none;
  font-size: 0.9rem;
  border: none;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  word-wrap: break-word;
  font-family: inherit;
  height: 150px;
  &:focus {
    border: 1px solid #00c471;
    outline: none;
  }
  &::placeholder {
    line-height: 24px;
    font-weight: 400;
    font-size: 15px;
    font-family: inherit;
    letter-spacing: -0.005em;
  }
`;

export const MainSection = styled.section`
  position: sticky;
  top: 30px;
  width: 100%;
  height: 900px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SubSection = styled.section`
  width: 100%;
`;

export const SaveButton = styled.div`
  width: 100%;
  height: 48px;
  color: #fff;
  border: 1px solid #00c471;
  background-color: #00c471;
  pointer-events: unset;
  font-weight: 700;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;

export const CancelButton = styled.div`
  width: 100%;
  height: 48px;
  color: #495057;
  border: 1px solid #d5dbe2;
  background-color: #fff;
  pointer-events: unset;
  font-weight: 700;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;

export const MainSectionWrapper = styled.section`
  width: 100%;
  position: relative;
`;
