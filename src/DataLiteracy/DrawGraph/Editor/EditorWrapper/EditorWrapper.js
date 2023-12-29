import { useState } from "react";
import * as Styled from "./Styled";
import GraphEvalution from "../../GraphEvalution/GraphEvalution";
import { usetutorialStroe } from "../../../store/tutorialStore";
import useComponentPosition from "../../../hooks/useComponentPosition";
import Portal from "../../../../Portal";
import TutorialDescription from "../../../common/TutorialDescription/TutorialDescription";
import Overlay from "../../../common/Overlay/Overlay";

function EditorWrapper({ children }) {
  const [selectValue, setSelectValue] = useState("Editor");
  const { isTutorial, step, addStep, type } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  const onClickButton = v => {
    setSelectValue(v);
    if (isTutorial && step === 9) {
      addStep();
    }
  };

  return (
    <Styled.Wrapper>
      <Styled.Box>
        <Styled.ButtonWrapper>
          {["Editor", "평가하기"].map(v => (
            <Styled.Button
              key={v}
              onClick={() => onClickButton(v)}
              $isSelected={selectValue === v}
              ref={v === "평가하기" ? ref : null}
            >
              {v}
            </Styled.Button>
          ))}
        </Styled.ButtonWrapper>
        {isTutorial && step === 9 && type !== "mix" && (
          <Portal>
            <TutorialDescription
              position="top"
              top={position.top + 40}
              left={position.left - 120}
              prevButtonClick={() => {
                setSelectValue("Editor");
              }}
              nextButtonClick={() => {
                setSelectValue("평가하기");
              }}
            />
            <Overlay position={position} />
          </Portal>
        )}
        {isTutorial && step === 10 && type === "mix" && (
          <Portal>
            <TutorialDescription
              position="top"
              top={position.top + 40}
              left={position.left - 120}
              prevButtonClick={() => {
                setSelectValue("Editor");
              }}
              nextButtonClick={() => {
                setSelectValue("평가하기");
              }}
            />
            <Overlay position={position} />
          </Portal>
        )}
      </Styled.Box>
      <Styled.Box>
        {selectValue === "Editor" ? children : <GraphEvalution />}
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default EditorWrapper;
