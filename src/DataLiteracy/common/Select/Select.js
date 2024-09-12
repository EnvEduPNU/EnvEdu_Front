import * as Styled from "./Styled";
import { ReactComponent as ArrowIcon } from "../../image/ArrowIcon.svg";
import { useState } from "react";
import Portal from "../../../Portal";
import useComponentPosition from "../../hooks/useComponentPosition";

function Select({ defaultValue, items, onChange }) {
  const [value, setValue] = useState(defaultValue);
  const [isShow, setIsShow] = useState(false);
  const { ref, position } = useComponentPosition();
  const onClickArrowIcon = () => {
    setIsShow((state) => !state);
  };

  const onClickItem = (item) => {
    if (onChange != null) onChange(item);
    setValue(item);
    setIsShow((state) => !state);
  };

  return (
    <Styled.Wrapper ref={ref}>
      <span onClick={onClickArrowIcon}>
        {value} <ArrowIcon />
      </span>
      {isShow && (
        <Portal>
          <Styled.Menu style={{ top: position.top + 30, left: position.left }}>
            {items.map((item) => (
              <Styled.Item
                onClick={() => onClickItem(item)}
                key={item}
                $isSelect={item == value}
              >
                {item}
              </Styled.Item>
            ))}
          </Styled.Menu>
        </Portal>
      )}
    </Styled.Wrapper>
  );
}

export default Select;
