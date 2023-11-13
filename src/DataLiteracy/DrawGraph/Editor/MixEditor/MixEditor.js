import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import LabelInput from "../../../common/Labellnput/LabelInput";
import { useGraphDataStore } from "../../../store/graphStore";
import { useMixStore } from "../../../store/mixStore";
import MetadataEditor from "../MetadataEditor/MetadataEditor";

import * as Styled from "./Styled";

function MixEditor() {
  const { variables, changeAxis, changeGraph } = useGraphDataStore();
  const {
    y1Axis,
    y2Axis,
    changeY1MinValue,
    changeY1MaxValue,
    changeY1StepSizeValue,
    changeY2MinValue,
    changeY2MaxValue,
    changeY2StepSizeValue,
  } = useMixStore();

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
                selectList={["X", "Y1", "Y2"]}
                onChange={axis => changeAxis(index, axis)}
              />
            );
          })}
        </Styled.ButtonSelectorWrapper>
      </Styled.Box>
      <Styled.Box>
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
      </Styled.Box>
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
      <MetadataEditor />
    </Styled.Wrapper>
  );
}

export default MixEditor;
