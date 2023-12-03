import Portal from "../../../../Portal";
import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import LabelInput from "../../../common/Labellnput/LabelInput";
import TutorialDescription from "../../../common/TutorialDescription/TutorialDescription";
import useComponentPosition from "../../../hooks/useComponentPosition";
import { useGraphDataStore } from "../../../store/graphStore";
import { useLineStore } from "../../../store/lineStore";
import { ustTabStore } from "../../../store/tabStore";
import { usetutorialStroe } from "../../../store/tutorialStore";
import EditorWrapper from "../EditorWrapper/EditorWrapper";
import MetadataEditor from "../MetadataEditor/MetadataEditor";

import * as Styled from "./Styled";

function LineEditor() {
  return (
    <EditorWrapper>
      <AxisSelector />
      <SacleSelector />
      <StepSizeSelector />
      <MetadataEditor />
    </EditorWrapper>
  );
}

const AxisSelector = () => {
  const { variables, changeAxis } = useGraphDataStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();
  return (
    <Styled.Box ref={ref}>
      <Styled.Title>축 선택</Styled.Title>
      <Styled.ButtonSelectorWrapper>
        {variables.map((variable, index) => {
          if (!variable.getIsSelected) return;
          return (
            <ButtonSelector
              key={index}
              value={variable.getName}
              defaultValue={variable.getAxis}
              selectList={["X", "Y"]}
              onChange={axis => changeAxis(index, axis)}
            />
          );
        })}
      </Styled.ButtonSelectorWrapper>
      {isTutorial && step === 3 && (
        <Portal>
          <TutorialDescription
            position="right"
            top={position.top - 50}
            left={position.left - 330}
          />
        </Portal>
      )}
    </Styled.Box>
  );
};

const SacleSelector = () => {
  const { min, max, changeMinValue, changeMaxValue } = useLineStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();
  const { changeTab } = ustTabStore();

  const onChangeMinMax = (type, value) => {
    if (type === "MIN") {
      changeMinValue(value);
    }
    if (type === "MAX") {
      changeMaxValue(value);
    }
  };
  return (
    <Styled.Box ref={ref}>
      <Styled.Title>범위 설정</Styled.Title>
      <Styled.LabelInputWrapper>
        <LabelInput
          labelName={"최솟값"}
          defaultValue={min}
          onChange={value => onChangeMinMax("MIN", value)}
        />
        <LabelInput
          labelName={"최댓값"}
          defaultValue={max}
          onChange={value => onChangeMinMax("MAX", value)}
        />
      </Styled.LabelInputWrapper>
      {isTutorial && step === 6 && (
        <Portal>
          <TutorialDescription
            position="right"
            top={position.top - 50}
            left={position.left - 330}
            prevButtonClick={() => {
              changeTab();
            }}
          />
        </Portal>
      )}
    </Styled.Box>
  );
};

const StepSizeSelector = () => {
  const { stepSize, changeStepSize } = useLineStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  const onChangeStepSize = value => {
    changeStepSize(value);
  };

  return (
    <Styled.Box ref={ref}>
      <Styled.Title>축 간격 설정</Styled.Title>
      <Styled.LabelInputWrapper>
        <LabelInput
          labelName={"간격"}
          defaultValue={stepSize}
          onChange={onChangeStepSize}
        />
      </Styled.LabelInputWrapper>
      {isTutorial && step === 7 && (
        <Portal>
          <TutorialDescription
            position="right"
            top={position.top - 50}
            left={position.left - 330}
          />
        </Portal>
      )}
    </Styled.Box>
  );
};

export default LineEditor;
