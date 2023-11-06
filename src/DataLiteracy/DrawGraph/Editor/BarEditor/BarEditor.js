import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import { useGraphDataStore } from "../../../store/graphStore";
import { useBarStore } from "../../../store/barStore";
import * as Styled from "./Styled";
import LabelInput from "../../../common/Labellnput/LabelInput";
import MetadataEditor from "../MetadataEditor/MetadataEditor";

function BarEditor() {
  const variableNames = useGraphDataStore(state => state.data)[0];
  const {
    x,
    y,
    min,
    max,
    stepSize,
    changeXAxis,
    changeYAxis,
    changeMinValue,
    changeMaxValue,
    changeStepSize,
  } = useBarStore();

  const onChangeAxis = (axisName, axis) => {
    if (axis === "X") changeXAxis(axisName);
    if (axis === "Y") changeYAxis(axisName);
  };

  const onChangeMinMax = (type, value) => {
    if (type === "MIN") {
      changeMinValue(value);
    }
    if (type === "MAX") {
      changeMaxValue(value);
    }
  };

  const onChangeStepSize = value => {
    changeStepSize(value);
  };

  return (
    <Styled.Wrapper>
      <Styled.Box>
        <Styled.Title>축 선택</Styled.Title>
        <Styled.ButtonSelectorWrapper>
          {variableNames.map(axisName => (
            <ButtonSelector
              key={axisName}
              value={axisName}
              selectList={["X", "Y"]}
              onChange={axis => onChangeAxis(axisName, axis)}
            />
          ))}
        </Styled.ButtonSelectorWrapper>
      </Styled.Box>
      <Styled.Box>
        <Styled.Title>범위 설정</Styled.Title>
        <Styled.LabelInputWrapper>
          <LabelInput
            labelName={"최솟값"}
            defaultValue={0}
            onChange={value => onChangeMinMax("MIN", value)}
          />
          <LabelInput
            labelName={"최댓값"}
            defaultValue={0}
            onChange={value => onChangeMinMax("MAX", value)}
          />
        </Styled.LabelInputWrapper>
      </Styled.Box>
      <Styled.Box>
        <Styled.Title>축 간격 설정</Styled.Title>
        <Styled.LabelInputWrapper>
          <LabelInput
            labelName={"간격"}
            defaultValue={0}
            onChange={onChangeStepSize}
          />
        </Styled.LabelInputWrapper>
      </Styled.Box>
      <MetadataEditor />
    </Styled.Wrapper>
  );
}

export default BarEditor;
