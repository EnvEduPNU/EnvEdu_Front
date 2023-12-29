import useComponentPosition from "../../../DataLiteracy/hooks/useComponentPosition";
import { useSlideStore } from "../../store/slideStore";
import Arrow from "../arrow/arrow";
import * as Styled from "./Styled";

function RightSilde({ children }) {
  const { ref, position } = useComponentPosition();
  const { isShowRight, showRight, closeRight } = useSlideStore();

  const onClickArrow = () => {
    if (isShowRight) closeRight();
    else showRight();
  };
  return (
    <Styled.Wrapper ref={ref} $isShow={isShowRight} $width={position.width}>
      {children}
      <Arrow
        direction={!isShowRight ? "left" : "right"}
        style={{
          position: "absolute",
          top: "50%",
          left: "-30px",
          transform: "translateY(-50%)",
        }}
        onClick={onClickArrow}
      />
    </Styled.Wrapper>
  );
}

export default RightSilde;
