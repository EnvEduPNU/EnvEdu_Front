import useComponentPosition from "../../../DataLiteracy/hooks/useComponentPosition";
import { useSlideStore } from "../../store/slideStore";
import Arrow from "../arrow/arrow";
import * as Styled from "./Styled";

function BottomSilde({ children }) {
  const { ref, position } = useComponentPosition();
  const { isShowBottom, showBottom, closeBottom } = useSlideStore();

  const onClickArrow = () => {
    if (isShowBottom) closeBottom();
    else showBottom();
  };
  return (
    <Styled.Wrapper ref={ref} $isShow={isShowBottom} $height={position.height}>
      {children}
      <Arrow
        direction={!isShowBottom ? "top" : "bottom"}
        style={{
          position: "absolute",
          top: "-30px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={onClickArrow}
      />
    </Styled.Wrapper>
  );
}

export default BottomSilde;
