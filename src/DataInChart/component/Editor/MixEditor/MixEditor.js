import ButtonSelector from "../../../../DataLiteracy/common/ButtonSelector/ButtonSelector";
import LabelInput from "../../../../DataLiteracy/common/Labellnput/LabelInput";
import { useGraphDataStore } from "../../../store/graphStore";
import { useMixStore } from "../../../store/mixStore";
import EditorWrapper from "../EditorWrapper/EditorWrapper";
import MetadataEditor from "../MetadataEditor/MetadataEditor";
import * as Styled from "./Styled";

function MixEditor() {
  return (
    <EditorWrapper>
      <AxisSelector />
      <GraphSelector />
      <Y1Selector />
      <Y2Selector />
      <MetadataEditor />
    </EditorWrapper>
  );
}

const AxisSelector = () => {
  const { variables, changeAxis } = useGraphDataStore();

  return (
    <Styled.Box>
      <Styled.Title>축 선택</Styled.Title>
      <Styled.ButtonSelectorWrapper>
        {variables.map((variable, index) => {
          if (!variable.isSelected) return;
          return (
            <ButtonSelector
              key={index}
              value={variable.name}
              defaultValue={variable.axis}
              selectList={["X", "Y1", "Y2"]}
              onChange={axis => changeAxis(index, axis)}
            />
          );
        })}
      </Styled.ButtonSelectorWrapper>
    </Styled.Box>
  );
};

const GraphSelector = () => {
  const { variables, changeGraph } = useGraphDataStore();

  return (
    <Styled.Box>
      <Styled.Title>그래프 선택</Styled.Title>
      <Styled.ButtonSelectorWrapper>
        {variables.map((variable, index) => {
          if (!variable.isSelected || variable.type === "Categorical") return;
          return (
            <ButtonSelector
              key={index}
              value={variable.name}
              defaultValue={variable.graph}
              selectList={["Bar", "Line"]}
              onChange={axis => changeGraph(index, axis)}
            />
          );
        })}
      </Styled.ButtonSelectorWrapper>
    </Styled.Box>
  );
};

const Y1Selector = () => {
  const { y1Axis, changeY1MinValue, changeY1MaxValue, changeY1StepSizeValue } =
    useMixStore();

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
    <Styled.Box>
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
    </Styled.Box>
  );
};

const Y2Selector = () => {
  const { y2Axis, changeY2MinValue, changeY2MaxValue, changeY2StepSizeValue } =
    useMixStore();

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
    <Styled.Box>
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
    </Styled.Box>
  );
};

export default MixEditor;
