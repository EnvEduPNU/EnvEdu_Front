import { useCallback, useState } from "react";
import * as Styled from "./Styled";

const Input = ({ onChange, placeholder }) => {
  const [value, setValue] = useState("");

  const onChangeInput = useCallback(
    e => {
      setValue(e.target.value);
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <Styled.Input
      placeholder={placeholder}
      value={value}
      onChange={onChangeInput}
    />
  );
};

export default Input;
