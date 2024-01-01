import { useEffect, useRef } from "react";
import Portal from "../../../../Portal";
import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import LabelInput from "../../../common/Labellnput/LabelInput";
import Overlay from "../../../common/Overlay/Overlay";
import TutorialDescription from "../../../common/TutorialDescription/TutorialDescription";
import useComponentPosition from "../../../hooks/useComponentPosition";
import { useGraphDataStore } from "../../../store/graphStore";
import { useMixStore } from "../../../store/mixStore";
import { usetutorialStroe } from "../../../store/tutorialStore";
import EditorWrapper from "../EditorWrapper/EditorWrapper";
import MetadataEditor from "../MetadataEditor/MetadataEditor";

import * as Styled from "./Styled";

function MixEditor() {
  const ref = useRef(null);
  const { isTutorial, step } = usetutorialStroe();

  useEffect(() => {
    if (ref.current && isTutorial && step === 8) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
    if (ref.current && isTutorial && step === 10) {
      ref.current.scrollTop = 0;
    }
  }, [ref.current, isTutorial, step]);

  return (
    <div style={{ overflow: "auto" }} ref={ref}>
      <EditorWrapper>
        <AxisSelector />
        <GraphSelector />
        <Y1Selector />
        <Y2Selector />
        <MetadataEditor />
      </EditorWrapper>
    </div>
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
              selectList={["X", "Y1", "Y2"]}
              onChange={axis => changeAxis(index, axis)}
            />
          );
        })}
      </Styled.ButtonSelectorWrapper>
      {isTutorial && step === 3 && (
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

const GraphSelector = () => {
  const { variables, changeGraph } = useGraphDataStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  return (
    <Styled.Box ref={ref}>
      <Styled.Title>그래프 선택</Styled.Title>
      <Styled.ButtonSelectorWrapper>
        {variables.map((variable, index) => {
          if (!variable.getIsSelected || variable.getType === "Categorical")
            return;
          return (
            <ButtonSelector
              key={index}
              value={variable.getName}
              defaultValue={variable.getGraph}
              selectList={["Bar", "Line"]}
              onChange={axis => changeGraph(index, axis)}
            />
          );
        })}
      </Styled.ButtonSelectorWrapper>
      {isTutorial && step === 4 && (
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

const Y1Selector = () => {
  const { y1Axis, changeY1MinValue, changeY1MaxValue, changeY1StepSizeValue } =
    useMixStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  const onChangeY1MinMax = (type, value) => {
    if (type === "MIN") {
      changeY1MinValue(value);
    }
    if (type === "MAX") {
      changeY1MaxValue(value);
    }
  };

  const onChangeY1StepSize = value => {
    changeY1StepSizeValue(value);
  };

  return (
    <Styled.Box ref={ref}>
      <Styled.Title>Y1축 범위 설정</Styled.Title>
      <Styled.LabelInputWrapper>
        <LabelInput
          labelName={"최솟값"}
          defaultValue={y1Axis.min}
          onChange={value => onChangeY1MinMax("MIN", value)}
        />
        <LabelInput
          labelName={"최댓값"}
          defaultValue={y1Axis.max}
          onChange={value => onChangeY1MinMax("MAX", value)}
        />
        <LabelInput
          labelName={"간격"}
          defaultValue={y1Axis.stepSize}
          onChange={onChangeY1StepSize}
        />
      </Styled.LabelInputWrapper>
      {isTutorial && step === 7 && (
        <Portal>
          <TutorialDescription
            position="bottom"
            top={position.top - 200}
            left={position.left}
          />
          <Overlay position={position} />
        </Portal>
      )}
    </Styled.Box>
  );
};

const Y2Selector = () => {
  const { y2Axis, changeY2MinValue, changeY2MaxValue, changeY2StepSizeValue } =
    useMixStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  const onChangeY2MinMax = (type, value) => {
    if (type === "MIN") {
      changeY2MinValue(value);
    }
    if (type === "MAX") {
      changeY2MaxValue(value);
    }
  };

  const onChangeY2StepSize = value => {
    changeY2StepSizeValue(value);
  };

  return (
    <Styled.Box ref={ref}>
      <Styled.Title>Y2축 범위 설정</Styled.Title>
      <Styled.LabelInputWrapper>
        <LabelInput
          labelName={"최솟값"}
          defaultValue={y2Axis.min}
          onChange={value => onChangeY2MinMax("MIN", value)}
        />
        <LabelInput
          labelName={"최댓값"}
          defaultValue={y2Axis.max}
          onChange={value => onChangeY2MinMax("MAX", value)}
        />
        <LabelInput
          labelName={"간격"}
          defaultValue={y2Axis.stepSize}
          onChange={onChangeY2StepSize}
        />
      </Styled.LabelInputWrapper>
      {isTutorial && step === 8 && (
        <Portal>
          <TutorialDescription
            position="bottom"
            top={position.top - 200}
            left={position.left}
          />
          <Overlay position={position} />
        </Portal>
      )}
    </Styled.Box>
  );
};

export default MixEditor;
