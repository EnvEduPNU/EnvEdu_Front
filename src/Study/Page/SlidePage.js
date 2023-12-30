import CustomTable from "../DrwaGraph/CustomTable/CustomTable";
import DrawGraph from "../DrwaGraph/DrawGraph/DrawGraph";
import Header from "../DrwaGraph/Header/Header";
import Blackboard from "../Slide/Blackboard/Blackboard";
import BottomSilde from "../Slide/BottomSlide/BottomSilde";
import LeftSilde from "../Slide/LeftSilde/LeftSilde";
import RightSilde from "../Slide/RightSilde/RightSilde";
import TopSlide from "../Slide/TopSilde/TopSilde";
import * as Styled from "./Styled";

function SlidePage() {
  return (
    <Styled.Wrapper>
      <LeftSilde>
        left입니다.
        <div style={{ width: "800px" }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi
          explicabo incidunt voluptates quia nam amet odit veniam, atque nulla
          tem
        </div>
      </LeftSilde>
      <RightSilde>
        right입니다.
        <div style={{ width: "400px" }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi
          explicabo incidunt voluptates quia nam amet odit veniam, atque nulla
          tem
        </div>
      </RightSilde>
      <BottomSilde>
        bottom입니다.
        <div style={{ height: "200px" }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi
          explicabo incidunt voluptates quia nam amet odit veniam, atque nulla
          tem
        </div>
      </BottomSilde>
      <TopSlide>
        Top입니다.
        <div style={{ height: "200px" }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi
          explicabo incidunt voluptates quia nam amet odit veniam, atque nulla
          tem
        </div>
      </TopSlide>
      <Blackboard>
        <DrawGraph />
      </Blackboard>
    </Styled.Wrapper>
  );
}

export default SlidePage;
