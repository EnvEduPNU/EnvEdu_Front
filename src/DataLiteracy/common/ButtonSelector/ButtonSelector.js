import { useState } from "react";
import * as Styled from "./Styled";

function ButtonSelector({ value, selectList, onChange, defaultValue = null }) {
  const [selected, setSelected] = useState(defaultValue);

  const onClickButton = v => {
    onChange(v);

    if (selected === v) {
      setSelected(null);
      return;
    }
    setSelected(v);
  };
  return (
    <Styled.Wrapper>
      <span>{value}</span>
      <Styled.ButtonWrapper>
        {selectList.map(v => (
          <Styled.Button
            key={v}
            onClick={() => onClickButton(v)}
            $isSelected={selected === v}
          >
            {v}
          </Styled.Button>
        ))}
      </Styled.ButtonWrapper>
    </Styled.Wrapper>
  );
}

export default ButtonSelector;
