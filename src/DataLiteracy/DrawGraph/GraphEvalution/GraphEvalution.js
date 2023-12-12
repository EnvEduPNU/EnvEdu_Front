import { useNavigate } from "react-router-dom";
import Textarea from "../../common/Textarea/Textarea";
import { useGraphInterpreterStore } from "../../store/graphInterpreterStore";
import * as Styled from "./Styled";
import Portal from "../../../Portal";
import TutorialDescription from "../../common/TutorialDescription/TutorialDescription";
import { usetutorialStroe } from "../../store/tutorialStore";
import useComponentPosition from "../../hooks/useComponentPosition";
import Overlay from "../../common/Overlay/Overlay";

function GraphEvalution() {
  return (
    <Styled.Wrapper>
      <GraphPurposeEvalution />
      <GraphInfomationEvalution />
      <NextButton />
    </Styled.Wrapper>
  );
}
const NextButton = () => {
  const naviagte = useNavigate();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  const onClickNextButton = () => {
    naviagte("/dataLiteracy/graphInterpreter");
  };
  return (
    <Styled.ButtonWrapper>
      <Styled.Button ref={ref} onClick={onClickNextButton}>
        다음
      </Styled.Button>
      {isTutorial && step === 12 && (
        <Portal>
          <TutorialDescription
            position="right"
            top={position.top - 100}
            left={position.left - 430}
            width={"400px"}
            nextButtonClick={() => {
              onClickNextButton();
            }}
          />
          <Overlay position={position} />
        </Portal>
      )}
    </Styled.ButtonWrapper>
  );
};

const GraphPurposeEvalution = () => {
  const {
    userData: { purpose },
    changeUserData,
  } = useGraphInterpreterStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  return (
    <Styled.Box ref={ref}>
      <Styled.Title>
        1. 그래프가 목적에 맞게 잘 그려졌는지 설명해봅시다.
      </Styled.Title>
      <Textarea
        value={purpose}
        onChange={e => changeUserData("purpose", e.target.value)}
      />
      {isTutorial && step === 10 && (
        <Portal>
          <TutorialDescription
            position="bottom"
            top={position.top - 220}
            left={position.left}
            width={"400px"}
          />
          <Overlay position={position} />
        </Portal>
      )}
    </Styled.Box>
  );
};

const GraphInfomationEvalution = () => {
  const {
    userData: { infomation },
    changeUserData,
  } = useGraphInterpreterStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  return (
    <Styled.Box ref={ref}>
      <Styled.Title>2. 그래프를 보고 알 수 있는 정보를 써봅시다.</Styled.Title>
      <Textarea
        value={infomation}
        onChange={e => changeUserData("infomation", e.target.value)}
      />
      {isTutorial && step === 11 && (
        <Portal>
          <TutorialDescription
            position="bottom"
            top={position.top - 150}
            left={position.left}
            width={"400px"}
          />
          <Overlay position={position} />
        </Portal>
      )}
    </Styled.Box>
  );
};

export default GraphEvalution;
