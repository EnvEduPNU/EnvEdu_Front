import * as Styled from "./Styled";
import { ReactComponent as GraphIcon } from "../../image/GraphIcon.svg";
import { ReactComponent as TableIcon } from "../../image/TableIcon.svg";
import { useTabStore } from "../../store/tabStore";
import { useGraphDataStore } from "../../store/graphStore";

function Tab({ isEclassTab = false }) {
  const { data } = useGraphDataStore();
  const { tab, changeTab } = useTabStore();

  const onClickTab = newTab => {
    if (newTab === "graph" && data.length <= 0) {
      alert("데이터를 선택후 graph 탭을 이용해주세요.");
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

      {isEclassTab ? (
        <Styled.Box
          onClick={() => onClickTab("eclass")}
          $isSelect={tab === "eclass"}
        >
          <span>E-Class</span>
        </Styled.Box>
      ) : (
        <Styled.Box
          onClick={() => onClickTab("assignment")}
          $isSelect={tab === "assignment"}
        >
          <TableIcon />
          <span>Assignment</span>
        </Styled.Box>
      )}
    </Styled.Wrapper>
  );
}

export default Tab;
