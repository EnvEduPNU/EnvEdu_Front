import styled from "styled-components";

export const Wrapper = styled.div`
  width: 500px;
  display: flex;
  border: 1px solid #00c4c4;
  border-radius: 4px;
  position: relative;
  background-color: #fff;
  padding: 0 0 0 10px;
  height: 40px;
  min-height: 40px;
  line-height: 40px;
  color: #212529;
`;

export const SearchTag = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  position: relative;
  margin: auto 5px;
  border-radius: 100px;
  background: #f2f4f6;
  width: auto;
  max-width: 42%;
  height: 28px;
  color: #495057;
  position: relative;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    margin: auto 24px auto 12px;
    line-height: 29px;
  }
`;
export const Button = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  color: #495057;
  border: none;
  border-radius: 100px;
  background-color: transparent;
`;

export const InputWrapper = styled.div`
  display: flex;
  position: relative;
  flex: 1 1 0%;
  margin-right: 40px;
`;
export const Input = styled.input`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  flex-grow: 1;
  outline: none;
  background: none;
  padding-right: 32px;
  width: 100%;
  -webkit-appearance: none;
  -ms-appearance: none;
  appearance: none;
  font-size: 14px;
  margin: 0;
  border: 0;
  padding: 0;
  vertical-align: baseline;
`;

export const SearchBtn = styled.button`
  position: absolute;
  top: 52%;
  right: 16px;
  left: auto;
  transform: translateY(-52%);
  z-index: 1;
  pointer-events: visible;
  width: 28px;
  height: 28px;
  /* color: #495057; */
  background-color: unset;
  border: none;
  svg {
    transform: translateY(-30%) translateX(-13%);
  }
`;

export const Modal = styled.div`
  position: absolute;
  border-radius: 16px;
  box-shadow: 0 0 5px rgba(10, 22, 70, 0.06),
    0 16px 16px -1px rgba(10, 22, 70, 0.1);
  background-color: #fff;
  height: 500px;
  max-height: 90vh;
  overflow: hidden;
  width: 700px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SubSection = styled.section`
  /* width: 100%; */
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

export const ButtonWrapper = styled.div`
  /* flex: 1; */
  display: flex;
  justify-content: flex-end;
  button {
    border: none;
    background-color: #00c4c4;
  }
`;
