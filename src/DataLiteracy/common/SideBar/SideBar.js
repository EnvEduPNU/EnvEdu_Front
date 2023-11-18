import "./SideBar.scss";
import * as Styled from "./Styled";

function SideBar({ activeIdx, isShow, setisShow }) {
  const menus = ["데이터 불러오기", "그래프 그리기", "그래프 해석하기"];
  const onClickOverlay = () => {
    setisShow(state => !state);
  };
  return (
    <>
      {isShow && <Styled.Overlay onClick={onClickOverlay} />}
      <Styled.Wrapper $isShow={isShow}>
        <Styled.SubTitle>그래프 그리기</Styled.SubTitle>
        <Styled.Ul>
          {menus.map((menu, idx) => (
            <Styled.Li key={menu + idx} $isActive={activeIdx === idx}>
              {idx + 1}. {menu}
            </Styled.Li>
          ))}
        </Styled.Ul>
      </Styled.Wrapper>
    </>
  );
}

export default SideBar;
