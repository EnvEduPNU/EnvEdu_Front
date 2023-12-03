import { useState } from "react";
import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import * as Styled from "./Styled";
import Textarea from "../../../common/Textarea/Textarea";
import GraphEvalution from "../../GraphEvalution/GraphEvalution";
import { usetutorialStroe } from "../../../store/tutorialStore";
import useComponentPosition from "../../../hooks/useComponentPosition";
import Portal from "../../../../Portal";
import TutorialDescription from "../../../common/TutorialDescription/TutorialDescription";

function EditorWrapper({ children }) {
  const [selectValue, setSelectValue] = useState("Editor");
  const { isTutorial, step, addStep } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  const onChange = v => {
    setSelectValue(v);
    if (isTutorial) addStep();
  };

  return (
    <Styled.Wrapper>
      <Styled.Box ref={ref}>
        <ButtonSelector
          // value={"에디터 선택"}
          defaultValue={"Editor"}
          selectList={["Editor", "평가하기"]}
          onChange={onChange}
        />
        {isTutorial && step === 9 && (
          <Portal>
            <TutorialDescription
              position="top"
              top={position.top + 40}
              left={position.left + 90}
            />
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
