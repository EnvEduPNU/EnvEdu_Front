import * as Styled from "./Styled";
import { ReactComponent as GraphIcon } from "../../image/GraphIcon.svg";
import { ReactComponent as TableIcon } from "../../image/TableIcon.svg";

function Tab({ tab, setTab }) {
  const onClickTab = tabType => {
    setTab(tabType);
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
