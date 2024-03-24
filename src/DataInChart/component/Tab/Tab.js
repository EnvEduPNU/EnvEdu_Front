import * as Styled from "./Styled";
import { ReactComponent as GraphIcon } from "../../../Study/image/GraphIcon.svg";
import { ReactComponent as TableIcon } from "../../../Study/image/TableIcon.svg";
import { useTabStore } from "../../store/tabStore";

function Tab() {
  const { tab, changeTab } = useTabStore();

  const onClickTab = newTab => {
    changeTab(newTab);
  };

  return (
    <Styled.Wrapper>
      <Styled.Box
        onClick={() => onClickTab("table")}
        $isSelect={tab === "table"}
      >
        <TableIcon />
        <span>Table</span>
      </Styled.Box>
      <Styled.Box
        onClick={() => onClickTab("graph")}
        $isSelect={tab === "graph"}
      >
        <GraphIcon />
        <span>Graph</span>
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default Tab;
