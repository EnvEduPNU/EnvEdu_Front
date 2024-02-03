import CreateEClass from "../CreateEclass/CreateEclass";
import Blackboard from "../Slide/Blackboard/Blackboard";
import LeftSilde from "../Slide/LeftSilde/LeftSilde";
import LeftSlidePage from "./leftSlidePage";
import * as Styled from "./Styled";

function CreateEClassPage() {
  return (
    <Styled.Wrapper>
      <LeftSilde>
        <div style={{ width: "1000px" }}>
          <LeftSlidePage />
        </div>
      </LeftSilde>
      <Blackboard>
        <CreateEClass />
      </Blackboard>
    </Styled.Wrapper>
  );
}

export default CreateEClassPage;
