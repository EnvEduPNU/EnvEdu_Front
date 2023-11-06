import Tab from "../Tab/Tab";
import * as Styled from "./Styled";
import { ReactComponent as MenuBarIcon } from "../../image/MenuBarIcon.svg";

function Header() {
  return (
    <Styled.Wrapper>
      <Styled.Box>
        <MenuBarIcon />
        <span>23년 7월 농업지대 기상</span>
      </Styled.Box>
      <Styled.Middle>
        <Tab />
      </Styled.Middle>
      <Styled.LastBox>{""}</Styled.LastBox>
    </Styled.Wrapper>
  );
}

export default Header;
