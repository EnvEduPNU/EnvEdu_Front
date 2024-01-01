import DrawGraph from "../DrwaGraph/DrawGraph/DrawGraph";
import Blackboard from "../Slide/Blackboard/Blackboard";
import BottomSilde from "../Slide/BottomSlide/BottomSilde";
import LeftSilde from "../Slide/LeftSilde/LeftSilde";
import RightSilde from "../Slide/RightSilde/RightSilde";
import TopSlide from "../Slide/TopSilde/TopSilde";
import * as Styled from "./Styled";

import TopSlidePage from "./topSlidePage";
import BottomSlidePage from "./bottomSildePage";
import LeftSlidePage from "./leftSlidePage";

function SlidePage() {
  return (
    <Styled.Wrapper>
      <LeftSilde>
        <div style={{ width: "600px" }}>
          <LeftSlidePage />
        </div>
      </LeftSilde>
      <RightSilde>
        right입니다.
        <div style={{ width: "400px" }}>
          test
        </div>
      </RightSilde>
      <BottomSilde>
        <div style={{ height: "300px" }}>
          <BottomSlidePage />
        </div>
      </BottomSilde>
      <TopSlide>
        <div style={{ height: "250px" }}>
          <TopSlidePage />
        </div>
      </TopSlide>
      <Blackboard>
        <DrawGraph />
      </Blackboard>
    </Styled.Wrapper>
  );
}

export default SlidePage;
