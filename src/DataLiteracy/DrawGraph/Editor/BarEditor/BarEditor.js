import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import { useGraphDataStore } from "../../../store/graphStore";
import { useBarStore } from "../../../store/barStore";
import * as Styled from "./Styled";

function BarEditor() {
  const axisNames = useGraphDataStore(state => state.data)[0];
  const { x, y, changeXAxis, changeYAxis } = useBarStore();
  const onChange = (axisName, axis) => {
    if (axis === "X") changeXAxis(axisName);
    if (axis === "Y") changeYAxis(axisName);
  };
  console.log(x, y);
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
    </Styled.Wrapper>
  );
}

export default BarEditor;
