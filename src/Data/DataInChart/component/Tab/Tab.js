import * as Styled from "./Styled";
import { ReactComponent as GraphIcon } from "../../../../Study/image/GraphIcon.svg";
import { ReactComponent as TableIcon } from "../../../../Study/image/TableIcon.svg";
import { useTabStore } from "../../store/tabStore";
import { useGraphDataStore } from "../../store/graphStore";
import { useEffect } from "react";

function Tab() {
  const { tab, changeTab } = useTabStore();
  const { data, title, variables } = useGraphDataStore();

  const onClickTab = (newTab) => {
    console.log(data, title, variables);
    if (newTab === "graph" && data.length <= 0) {
      alert("데이터를 선택 후 graph 탭을 이용해주세요.");
      return;
    }
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
