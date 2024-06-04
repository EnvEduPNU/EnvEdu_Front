import styled, { css } from "styled-components";

export const Notice = styled.div`
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 155vh;
  font-size: 16px;
  font-weight: bold;
`;

export const TableHeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  border: 1px solid rgba(34, 36, 38, 0.15);
  overflow-x: auto;
`;

export const Wrapper = styled.div`
  width: 100%;
  justify-self: flex-end;
  display: flex;
  border: 1px solid rgba(34, 36, 38, 0.15);
  max-height: 600px;
  overflow: auto;
  border-radius: 5px;
`;

export const Column = styled.div`
  width: 100%;
  background-color: #f8f8f8;

  min-width: 130px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 700;

  ${(props) =>
    props.$isNotEnd &&
    css`
      border-right: 1px solid rgba(34, 36, 38, 0.15);
    `}
`;

export const FirstColumn = styled(Column)`
  max-width: 150px;
  min-width: 70px;
`;

export const HeaderWrapper = styled.div`
  padding: 0 10px;
  box-shadow: 0 8px 5px -5px rgba(0, 0, 0, 0.3);
  z-index: 3;
  /* height: 100%; */
`;

export const Header = styled.div`
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
  height: 80px;
`;

export const TableHeader = styled.div`
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
`;

export const HeaderStartar = styled(Header)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Th = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2;
  height: 35px;
  max-height: 35px;
  overflow: auto;
  white-space: nowrap;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
`;

export const Circle = styled.div`
  cursor: pointer;
  background-color: #dfe0e1;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #cacbcd;
  }
`;

export const Box = styled.div`
  display: flex;
  align-items: center;
  line-height: 2;
  ${(props) =>
    props.$isNotEnd &&
    css`
      border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    `}
`;

export const Data = styled.div`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  &:focus {
    outline: none;
  }
  cursor: crosshair;
  padding: 5px 10px;
  background-color: inherit;
  line-height: 2;
  background-color: #fff;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);

  ${(props) =>
    props.$isEditCell &&
    css`
      /* padding: 0px; */
      background-color: #d9d9d9;
    `}
`;

export const Input = styled.input`
  user-select: none; /* standard syntax */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */

  width: 100%;
  height: 100%;
  background-color: #d9d9d9;
  font-size: 14px;
  font-weight: 500;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  &:focus {
    outline: none;
  }
`;

export const InputDiv = styled.div`
  user-select: none; /* standard syntax */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */

  background-color: inherit;
  width: 100%;
  height: 100%;
  min-height: 28px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  &:focus {
    outline: none;
  }
`;

export const RowNumber = styled.div`
  font-size: 14px;

  padding: 5px 10px;
  background-color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 2;
  background-color: #fff;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
`;

export const Button = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;

  background: transparent;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  line-height: normal;

  /* Corrects font smoothing for webkit */
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  font-weight: 600;
  font-size: 14px;
  color: #21ba45;
  border: 1px solid #21ba45;
  width: 55px;
  padding: 3px 5px;
  border-radius: 5px;
  margin: 5px 0;
  ${(props) =>
    props.$isSelected &&
    css`
      color: #fff;
      background-color: #21ba45;
    `}
`;
