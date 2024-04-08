import useComponentPosition from "../../../DataLiteracy/hooks/useComponentPosition";
import { useSlideStore } from "../../store/slideStore";
import Arrow from "../arrow/arrow";
import * as Styled from "./Styled";

function TopSlide({ children }) {
  const { ref, position } = useComponentPosition();
  const { isShowTop, showTop, closeTop } = useSlideStore();

  const onClickArrow = () => {
    if (isShowTop) closeTop();
    else showTop();
  };
  
  return (
    <Styled.Wrapper ref={ref} $isShow={isShowTop} $height={position.height}>
      {children}
      <Arrow
        direction={!isShowTop ? "bottom" : "top"}
        style={{
          position: "absolute",
          bottom: "-30px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={onClickArrow}
      />
    </Styled.Wrapper>
  );
}

export default TopSlide;
