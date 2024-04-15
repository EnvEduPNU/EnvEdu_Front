import ButtonSelector from "../../../../../DataLiteracy/common/ButtonSelector/ButtonSelector";
import LabelInput from "../../../../../DataLiteracy/common/Labellnput/LabelInput";
import { useBarStore } from "../../../store/barStore";
import { useGraphDataStore } from "../../../store/graphStore";
import EditorWrapper from "../EditorWrapper/EditorWrapper";
import MetadataEditor from "../MetadataEditor/MetadataEditor";
import * as Styled from "./Styled";

function BarEditor() {
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
              selectList={["X", "Y"]}
              onChange={axis => changeAxis(index, axis)}
            />
          );
        })}
      </Styled.ButtonSelectorWrapper>
    </Styled.Box>
  );
};

const SacleSelector = () => {
  const { min, max, changeMinValue, changeMaxValue } = useBarStore();

  const onChangeMinMax = (type, value) => {
    if (type === "MIN") {
      changeMinValue(value);
    }
    if (type === "MAX") {
      changeMaxValue(value);
    }
  };

  return (
    <Styled.Box>
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
    </Styled.Box>
  );
};

const StepSizeSelector = () => {
  const { stepSize, changeStepSize } = useBarStore();

  const onChangeStepSize = value => {
    changeStepSize(value);
  };

  return (
    <Styled.Box>
      <Styled.Title>축 간격 설정</Styled.Title>
      <Styled.LabelInputWrapper>
        <LabelInput
          labelName={"간격"}
          defaultValue={stepSize}
          onChange={onChangeStepSize}
        />
      </Styled.LabelInputWrapper>
    </Styled.Box>
  );
};

export default BarEditor;
