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
import RightSildePage from "./rightSlidePage";
import Header from '../../Header/Header'
import { useEffect, useState } from "react";

function SlidePage() {
  const [isVisible, setIsVisible] = useState(false);

  const showNavbar = () => {
    setIsVisible(true);
  };

  const hideNavbar = () => {
    setIsVisible(false);
  };
  useEffect(() =>{
    console.log(isVisible)
  }, [isVisible])

  return (
    <Styled.Wrapper>
      <LeftSilde>
        <div style={{ width: "600px" }}>
          <LeftSlidePage />
        </div>
      </LeftSilde>
      <RightSilde>
        <div style={{ width: "600px" }}>
          <RightSildePage />
        </div>
      </RightSilde>
      <BottomSilde>
        <div style={{ height: "300px" }}>
          <BottomSlidePage />
        </div>
      </BottomSilde>
      <TopSlide>
        <div style={{ height: "200px", background: 'pink' }}>
          <TopSlidePage/>
        </div>
      </TopSlide>
      <Blackboard>
        <DrawGraph />
      </Blackboard>
    </Styled.Wrapper>
  );
}

export default SlidePage;
