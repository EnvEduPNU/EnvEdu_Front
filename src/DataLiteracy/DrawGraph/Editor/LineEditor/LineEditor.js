import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import LabelInput from "../../../common/Labellnput/LabelInput";
import { useGraphDataStore } from "../../../store/graphStore";
import { useLineStore } from "../../../store/lineStore";
import MetadataEditor from "../MetadataEditor/MetadataEditor";

import * as Styled from "./Styled";

function LineEditor() {
  const { variables, changeAxis } = useGraphDataStore();
  const { min, max, stepSize, changeMinValue, changeMaxValue, changeStepSize } =
    useLineStore();

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
      </Styled.Box>
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
      <MetadataEditor />
    </Styled.Wrapper>
  );
}

export default LineEditor;
