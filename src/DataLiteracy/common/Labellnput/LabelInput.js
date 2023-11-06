import { useCallback, useState } from "react";
import * as Styled from "./Styled";

function LabelInput({ labelName, defaultValue, onChange }) {
  const [value, setValue] = useState(defaultValue);
  const onChangeInput = e => {
    const newValue = e.target.value;

    onChange(newValue);
    setValue(newValue);
  };
  return (
    <Styled.Wrapper>
      <Styled.Label>{labelName}</Styled.Label>
      <Styled.Input type="number" value={value} onChange={onChangeInput} />
    </Styled.Wrapper>
  );
}

export default LabelInput;
