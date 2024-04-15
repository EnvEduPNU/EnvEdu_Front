import Tab from "../Tab/Tab";
import * as Styled from "./Styled";

import { useGraphDataStore } from "../../store/graphStore";
import GraphSelector from "../GraphSelector/GraphSelector";

function Header({ isEclassTab = false }) {
  const { title } = useGraphDataStore();

  return (
    <Styled.Wrapper>
      <Styled.Box>
        <span>{title}</span>
      </Styled.Box>
      <Styled.Middle>
        <Tab isEclassTab={isEclassTab} />
      </Styled.Middle>
      <Styled.LastBox>
        <GraphSelector />
      </Styled.LastBox>
    </Styled.Wrapper>
  );
}

export default Header;
