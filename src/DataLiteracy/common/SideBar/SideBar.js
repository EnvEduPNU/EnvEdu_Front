import { useNavigate } from "react-router-dom";
import "./SideBar.scss";
import * as Styled from "./Styled";

function SideBar({ activeIdx, isShow, setisShow }) {
  const navigate = useNavigate();
  const menus = ["데이터 불러오기", "그래프 그리기", "그래프 해석하기"];
  const onClickOverlay = () => {
    setisShow(state => !state);
  };
  const onClickMenu = idx => {
    switch (idx) {
      case 0:
        navigate("/dataLiteracy/dataload");
        return;
      case 1:
        navigate("/dataLiteracy/drawGraph");
        return;
      case 2:
        navigate("/dataLiteracy/graphInterpreter");
        return;
      default:
        return;
    }
  };
  return (
    <>
      {isShow && <Styled.Overlay onClick={onClickOverlay} />}
      <Styled.Wrapper $isShow={isShow}>
        <Styled.SubTitle>그래프 그리기</Styled.SubTitle>
        <Styled.Ul>
          {menus.map((menu, idx) => (
            <Styled.Li
              onClick={() => onClickMenu(idx)}
              key={menu + idx}
              $isActive={activeIdx === idx}
            >
              {idx + 1}. {menu}
            </Styled.Li>
          ))}
        </Styled.Ul>
      </Styled.Wrapper>
    </>
  );
}

export default SideBar;
