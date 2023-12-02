import { usetutorialStroe } from "../../store/tutorialStore";
import * as Styled from "./Styled";

function TutorialDescription({
  position = "right",
  title,
  description,
  prevButtonClick,
  nextButtonClick,
}) {
  const { step, totalStepSize, addStep, minusStep } = usetutorialStroe();
  const onClick = e => {
    e.stopPropagation();
  };

  const onClickPrevButton = () => {
    if (prevButtonClick != null) prevButtonClick();
    minusStep();
  };
  const onCliclNextButton = () => {
    if (nextButtonClick != null) nextButtonClick();
    addStep();
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
            <Styled.LeftButton onClick={onClickPrevButton}>
              {"<"} 이전
            </Styled.LeftButton>
            <Styled.RightButton onClick={onCliclNextButton}>
              다음 {">"}
            </Styled.RightButton>
          </Styled.ButtonWrapper>
        </Styled.Bottom>
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default TutorialDescription;
