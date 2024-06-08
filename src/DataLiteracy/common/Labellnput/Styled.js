import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Label = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
`;

export const Input = styled.input`
  user-select: none; /* standard syntax */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  &:focus {
    outline: none;
  }
  border: 1px solid rgba(34, 36, 38, 0.15);
  width: 80px;
  font-size: 14px;
`;
