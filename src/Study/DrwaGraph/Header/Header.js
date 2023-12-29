import Tab from "../Tab/Tab";
import * as Styled from "./Styled";
import GraphSelector from "../../../DataLiteracy/common/GraphSelector/GraphSelector";
import { useGraphDataStore } from "../../store/graphStore";

function Header() {
  const { title } = useGraphDataStore();

  return (
    <Styled.Wrapper>
      <Styled.Box>
        <span>{title}</span>
      </Styled.Box>
      <Styled.Middle>
        <Tab />
      </Styled.Middle>
      <Styled.LastBox>
        <GraphSelector />
      </Styled.LastBox>
    </Styled.Wrapper>
  );
}

export default Header;
