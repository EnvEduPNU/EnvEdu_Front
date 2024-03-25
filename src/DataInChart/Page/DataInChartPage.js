import * as Styled from "./Styled";
import DrawGraph from "../component/DrawGraph/DrawGraph";
import LeftSilde from "../component/LeftSilde/LeftSilde";
import LeftSlidePage from "./leftSlidePage";
import Blackboard from "../component/Blackboard/Blackboard";

function DataInChartPage() {
  return (
    <Styled.Wrapper>
      <LeftSilde>
        <div style={{ width: "1000px" }}>
          <LeftSlidePage />
        </div>
      </LeftSilde>
      <Blackboard>
        <DrawGraph />
      </Blackboard>
    </Styled.Wrapper>
  );
}

export default DataInChartPage;
