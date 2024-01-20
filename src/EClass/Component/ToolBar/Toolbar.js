import { Button } from "react-bootstrap";
import * as Styled from "./Styled";
import H2 from "../H2/H2";
import H1 from "../H1/H1";
import Seed from "../Seed/Seed";
import Argument from "../Argument/Argument";

function Toolbar({ setActivity }) {
  const onClickBtn = component => {
    setActivity(state => [...state, component]);
  };
  return (
    <Styled.Wrapper>
      <Styled.Tool onClick={() => onClickBtn(<H1 />)}>H1</Styled.Tool>
      <Styled.Tool onClick={() => onClickBtn(<H2 />)}>H2</Styled.Tool>
      <Styled.Tool onClick={() => onClickBtn(<Seed />)}>SEED 측정</Styled.Tool>
      <Styled.Tool onClick={() => onClickBtn(<Argument />)}>토론</Styled.Tool>
    </Styled.Wrapper>
  );
}

export default Toolbar;
