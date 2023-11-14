import Tab from "../Tab/Tab";
import * as Styled from "./Styled";
import { ReactComponent as MenuBarIcon } from "../../image/MenuBarIcon.svg";
import SideBar from "../SideBar/SideBar";
import { useState } from "react";
import { Button } from "react-bootstrap";
import GraphSelector from "../GraphSelector/GraphSelector";
import { useGraphDataStore } from "../../store/graphStore";

function Header() {
  const { title } = useGraphDataStore();
  const [isShow, setisShow] = useState(false);
  const onClickMenu = () => {
    setisShow(state => !state);
  };
  return (
    <>
      <Styled.Wrapper>
        <Styled.Box>
          <MenuBarIcon onClick={onClickMenu} />
          <span>{title}</span>
        </Styled.Box>
        <Styled.Middle>
          <Tab />
        </Styled.Middle>
        <Styled.LastBox>
          <GraphSelector />
        </Styled.LastBox>
      </Styled.Wrapper>
      <SideBar activeIdx={1} isShow={isShow} setisShow={setisShow} />
    </>
  );
}

export default Header;
