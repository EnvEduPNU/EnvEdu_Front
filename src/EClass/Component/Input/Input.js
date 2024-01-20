import { useState } from "react";
import * as Styled from "./Styled";

const Input = ({ placeholder }) => {
  const [value, setValue] = useState("");
  return (
    <Styled.Input
      placeholder={placeholder}
      st
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
};

export default Input;
