import { usetutorialStroe } from "../../store/tutorialStore";
import { tutorials } from "../../utils/tutorials";
import * as Styled from "./Styled";

function TutorialDescription({
  position = "right",
  title,
  description,
  prevButtonClick,
  nextButtonClick,
  top,
  left,
  width,
}) {
  const { step, addStep, minusStep } = usetutorialStroe();
  const onClick = e => {
    e.stopPropagation();
  };

  const onClickPrevButton = () => {
    if (isStart()) return;

    if (prevButtonClick != null) prevButtonClick();
    minusStep();
  };
  const onCliclNextButton = () => {
    if (isEnd()) return;

    if (nextButtonClick != null) nextButtonClick();
    addStep();
  };

  const isStart = () => {
    return step === 0;
  };

  const isEnd = () => {
    return step === tutorials.length - 1;
  };

  return (
    <Styled.Wrapper
      onClick={onClick}
      className="tutorial-description"
      $position={position}
      style={{ top, left, width }}
    >
      <Styled.Box>
        <Styled.Title>{tutorials[step].title}</Styled.Title>
        <Styled.Text>{tutorials[step].description}</Styled.Text>
        <Styled.Bottom>
          <Styled.StepDescription>
            {step + 1} / {tutorials.length}
          </Styled.StepDescription>
          <Styled.ButtonWrapper>
            <Styled.LeftButton
              onClick={onClickPrevButton}
              $isDisable={isStart()}
            >
              {"<"} 이전
            </Styled.LeftButton>
            <Styled.RightButton
              onClick={onCliclNextButton}
              $isDisable={isEnd()}
            >
              다음 {">"}
            </Styled.RightButton>
          </Styled.ButtonWrapper>
        </Styled.Bottom>
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default TutorialDescription;
