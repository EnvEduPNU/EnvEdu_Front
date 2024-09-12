import { useCallback, useState } from "react";
import * as Styled from "./Styled";

const Input = ({
  onChange,
  placeholder,
  defaultValue = "",
  disabled = false,
}) => {
  const [value, setValue] = useState(defaultValue);

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
      disabled={disabled}
    />
  );
};

export default Input;
