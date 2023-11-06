import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import { useGraphDataStore } from "../../../store/graphStore";
import { useBarStore } from "../../../store/barStore";
import * as Styled from "./Styled";
import LabelInput from "../../../common/Labellnput/LabelInput";

function BarEditor() {
  const axisNames = useGraphDataStore(state => state.data)[0];
  const { x, y, changeXAxis, changeYAxis } = useBarStore();
  const onChange = (axisName, axis) => {
    if (axis === "X") changeXAxis(axisName);
    if (axis === "Y") changeYAxis(axisName);
  };
  const onChangeMin = value => {
    console.log(value);
  };

  return (
    <Styled.Wrapper>
      <Styled.Box>
        <Styled.Title>축 선택</Styled.Title>
        <Styled.ButtonSelectorWrapper>
          {axisNames.map(axisName => (
            <ButtonSelector
              key={axisName}
              value={axisName}
              axisLength={2}
              onChange={axis => onChange(axisName, axis)}
            />
          ))}
        </Styled.ButtonSelectorWrapper>
      </Styled.Box>
      <Styled.Box>
        <Styled.Title>범위 선택</Styled.Title>
        <Styled.LabelInputWrapper>
          <LabelInput
            labelName={"최솟값"}
            defaultValue={0}
            onChange={onChangeMin}
          />
          <LabelInput
            labelName={"최댓값"}
            defaultValue={0}
            onChange={onChangeMin}
          />
        </Styled.LabelInputWrapper>
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default BarEditor;
