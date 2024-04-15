import * as Styled from "./Styled";
import DrawGraph from "../component/DrawGraph/DrawGraph";
import LeftSilde from "../component/LeftSilde/LeftSilde";
import LeftSlidePage from "./leftSlidePage";
import TopSlide from "../component/TopSilde/TopSilde";
import Blackboard from "../component/Blackboard/Blackboard";
import { useSlideStore } from "../store/slideStore";
import Header from "../../../Header/Header";

function DataInChartPage() {
  const { isShowTop, showTop, closeTop } = useSlideStore();

  return (
    <Styled.Wrapper>
      <LeftSilde>
        <div style={{ width: "1000px" }}>
          <LeftSlidePage />
        </div>
      </LeftSilde>

      <TopSlide>
        <div style={{ height: "100px" }}>
          {isShowTop && <Header />}
        </div>
      </TopSlide>

      <Blackboard>
        <DrawGraph />
      </Blackboard>
    </Styled.Wrapper>
  );
}

export default DataInChartPage;
