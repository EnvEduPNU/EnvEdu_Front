import { useState } from "react";
import * as Styled from "./Styled";

function ButtonSelector({ value, axisLength, onChange }) {
  const [axis, setAxis] = useState(null);

  const axisArr = axisLength === 2 ? ["X", "Y"] : ["X", "Y", "Z"];
  const onClickButton = v => {
    if (axis === v) {
      setAxis(null);
      onChange(v);
      return;
    }

    onChange(v);
    setAxis(v);
  };
  return (
    <Styled.Wrapper>
      <span>{value}</span>
      <Styled.ButtonWrapper>
        {axisArr.map(v => (
          <Styled.Button
            key={v}
            onClick={() => onClickButton(v)}
            $isSelected={axis === v}
          >
            {v}
          </Styled.Button>
        ))}
      </Styled.ButtonWrapper>
    </Styled.Wrapper>
  );
}

export default ButtonSelector;
