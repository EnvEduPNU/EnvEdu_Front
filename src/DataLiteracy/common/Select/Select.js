import * as Styled from "./Styled";
import { ReactComponent as ArrowIcon } from "../../image/ArrowIcon.svg";
import { useState } from "react";

function Select({ defaultValue, items, onChange }) {
  const [value, setValue] = useState(defaultValue);
  const [isShow, setIsShow] = useState(false);
  const onClickArrowIcon = () => {
    setIsShow(state => !state);
  };

  const onClickItem = item => {
    if (onChange != null) onChange(item);
    setValue(item);
    setIsShow(state => !state);
  };
  return (
    <Styled.Wrapper>
      <span onClick={onClickArrowIcon}>
        {value} <ArrowIcon />
      </span>
      {isShow && (
        <Styled.Menu>
          {items.map(item => (
            <Styled.Item
              onClick={() => onClickItem(item)}
              key={item}
              $isSelect={item == value}
            >
              {item}
            </Styled.Item>
          ))}
        </Styled.Menu>
      )}
    </Styled.Wrapper>
  );
}

export default Select;
