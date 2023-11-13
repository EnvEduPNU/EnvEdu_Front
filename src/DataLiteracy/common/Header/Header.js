import Tab from "../Tab/Tab";
import * as Styled from "./Styled";
import { ReactComponent as MenuBarIcon } from "../../image/MenuBarIcon.svg";
import SideBar from "../SideBar/SideBar";
import { useState } from "react";

function Header() {
  const [isShow, setisShow] = useState(false);
  const onClickMenu = () => {
    setisShow(state => !state);
  };
  return (
    <>
      <Styled.Wrapper>
        <Styled.Box>
          <MenuBarIcon onClick={onClickMenu} />
          <span>23년 7월 농업지대 기상</span>
        </Styled.Box>
        <Styled.Middle>
          <Tab />
        </Styled.Middle>
        <Styled.LastBox>{""}</Styled.LastBox>
      </Styled.Wrapper>
      <SideBar activeIdx={1} isShow={isShow} setisShow={setisShow} />
    </>
  );
}

export default Header;
