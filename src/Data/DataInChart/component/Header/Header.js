import Tab from "../Tab/Tab";
import * as Styled from "./Styled";

// 왼쪽 메뉴의 Table 과 Graph 탭 상위 컴포넌트
function Header() {
  return (
    <>
      <Styled.Middle>
        <Tab />
      </Styled.Middle>
      {/* <Styled.LastBox>
        <GraphSelector />
      </Styled.LastBox> */}
    </>
  );
}

export default Header;
