import * as Styled from "./Styled";
import { ReactComponent as GraphIcon } from "../../image/GraphIcon.svg";
import { ReactComponent as TableIcon } from "../../image/TableIcon.svg";
import { ustTabStore } from "../../store/tabStore";

function Tab() {
  const { tab, changeTab } = ustTabStore();
  const onClickTab = () => {
    changeTab();
  };
  return (
    <Styled.Wrapper>
      <Styled.Box onClick={onClickTab} $isSelect={tab === "table"}>
        <TableIcon />
        <span>Table</span>
      </Styled.Box>
      <Styled.Box onClick={onClickTab} $isSelect={tab === "graph"}>
        <GraphIcon />
        <span>Graph</span>
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default Tab;
