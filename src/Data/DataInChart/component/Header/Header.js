import Tab from "../Tab/Tab";
import * as Styled from "./Styled";

import { useGraphDataStore } from "../../store/graphStore";

// 왼쪽 메뉴의 Table 과 Graph 탭 상위 컴포넌트
function Header({ isEclassTab = false }) {
  const { title } = useGraphDataStore();

  return (
    <>
      <Styled.Box>
        <span>{title}</span>
      </Styled.Box>
      <Styled.Middle>
        <Tab isEclassTab={isEclassTab} />
      </Styled.Middle>
      {/* <Styled.LastBox>
        <GraphSelector />
      </Styled.LastBox> */}
    </>
  );
}

export default Header;
