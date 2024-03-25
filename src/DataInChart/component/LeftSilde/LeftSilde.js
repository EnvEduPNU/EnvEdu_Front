import useComponentPosition from "../../../DataLiteracy/hooks/useComponentPosition";
import { useSlideStore } from "../../store/slideStore";
import * as Styled from "./Styled";
import Arrow from "../arrow/arrow";

function LeftSilde({ children }) {
  const { ref, position } = useComponentPosition();
  const { isShowLeft, showLeft, closeLeft } = useSlideStore();

  const onClickArrow = () => {
    if (isShowLeft) closeLeft();
    else showLeft();
  };
  return (
    <Styled.Wrapper ref={ref} $isShow={isShowLeft} $width={position.width}>
      {children}
      <Arrow
        direction={!isShowLeft ? "right" : "left"}
        style={{
          position: "absolute",
          top: "50%",
          right: "-30px",
          transform: "translateY(-50%)",
        }}
        onClick={onClickArrow}
      />
    </Styled.Wrapper>
  );
}

export default LeftSilde;
