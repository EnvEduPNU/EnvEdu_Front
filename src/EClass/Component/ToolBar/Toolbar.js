import { Button } from "react-bootstrap";
import * as Styled from "./Styled";
import H2 from "../H2/H2";
import H1 from "../H1/H1";
import Seed from "../Seed/Seed";
import Argument from "../Argument/Argument";
import ImageTool from "../ImageTool/ImageTool";
import YoutubeTool from "../YoutubeTool/YoutubeTool";
import Question from "../Question/Question";

function Toolbar({ setActivity }) {
  const onClickBtn = component => {
    setActivity(state => [...state, component]);
  };
  return (
    <Styled.Wrapper>
      <Styled.ToolGroup>
        <Styled.Tool onClick={() => onClickBtn(<H1 />)}>H1</Styled.Tool>
        <Styled.Tool onClick={() => onClickBtn(<H2 />)}>H2</Styled.Tool>
      </Styled.ToolGroup>
      <Styled.Bar></Styled.Bar>
      <Styled.ToolGroup>
        <Styled.Tool onClick={() => onClickBtn(<Seed />)}>SEED</Styled.Tool>
        <Styled.Tool onClick={() => onClickBtn(<Argument />)}>토론</Styled.Tool>
        <Styled.Tool onClick={() => onClickBtn(<Question />)}>질문</Styled.Tool>
      </Styled.ToolGroup>
      <Styled.Bar></Styled.Bar>
      <Styled.ToolGroup>
        <ImageTool setActivity={setActivity} />
        <YoutubeTool setActivity={setActivity} />
      </Styled.ToolGroup>
    </Styled.Wrapper>
  );
}

export default Toolbar;
