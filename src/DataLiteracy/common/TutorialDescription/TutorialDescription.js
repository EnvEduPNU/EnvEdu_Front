import { usetutorialStroe } from "../../store/tutorialStore";
import * as Styled from "./Styled";

function TutorialDescription({ position = "right", title, description }) {
  const { step, totalStepSize } = usetutorialStroe();
  const onClick = e => {
    e.stopPropagation();
  };
  return (
    <Styled.Wrapper
      onClick={onClick}
      className="tutorial-description"
      $position={position}
    >
      <Styled.Box>
        <Styled.Title>{title}</Styled.Title>
        <Styled.Text>{description}</Styled.Text>
        <Styled.Bottom>
          <Styled.StepDescription>
            {step + 1} / {totalStepSize}
          </Styled.StepDescription>
          <Styled.ButtonWrapper>
            <Styled.LeftButton>{"<"} 이전</Styled.LeftButton>
            <Styled.RightButton>다음 {">"}</Styled.RightButton>
          </Styled.ButtonWrapper>
        </Styled.Bottom>
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default TutorialDescription;
