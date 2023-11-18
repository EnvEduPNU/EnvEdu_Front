import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import LabelInput from "../../../common/Labellnput/LabelInput";
import { useGraphDataStore } from "../../../store/graphStore";
import { useScatterStore } from "../../../store/scatterStore";
import EditorWrapper from "../EditorWrapper/EditorWrapper";
import MetadataEditor from "../MetadataEditor/MetadataEditor";

import * as Styled from "./Styled";

function ScatterEditor() {
  const { variables, changeAxis } = useGraphDataStore();
  const {
    xAxis,
    yAxis,
    changeXMinValue,
    changeXMaxValue,
    changeXStepSizeValue,
    changeYMinValue,
    changeYMaxValue,
    changeYStepSizeValue,
  } = useScatterStore();

  const onChangeXMinMax = (type, value) => {
    if (type === "MIN") {
      changeXMinValue(value);
    }
    if (type === "MAX") {
      changeXMaxValue(value);
    }
  };

  const onChangeXStepSize = value => {
    changeXStepSizeValue(value);
  };

  const onChangeYMinMax = (type, value) => {
    if (type === "MIN") {
      changeYMinValue(value);
    }
    if (type === "MAX") {
      changeYMaxValue(value);
    }
  };

  const onChangeYStepSize = value => {
    changeYStepSizeValue(value);
  };

  return (
    <EditorWrapper>
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
        <Styled.Title>X축 범위 설정</Styled.Title>
        <Styled.LabelInputWrapper>
          <LabelInput
            labelName={"최솟값"}
            defaultValue={xAxis.min}
            onChange={value => onChangeXMinMax("MIN", value)}
          />
          <LabelInput
            labelName={"최댓값"}
            defaultValue={xAxis.max}
            onChange={value => onChangeXMinMax("MAX", value)}
          />
          <LabelInput
            labelName={"간격"}
            defaultValue={xAxis.stepSize}
            onChange={onChangeXStepSize}
          />
        </Styled.LabelInputWrapper>
      </Styled.Box>
      <Styled.Box>
        <Styled.Title>Y축 범위 설정</Styled.Title>
        <Styled.LabelInputWrapper>
          <LabelInput
            labelName={"최솟값"}
            defaultValue={yAxis.min}
            onChange={value => onChangeYMinMax("MIN", value)}
          />
          <LabelInput
            labelName={"최댓값"}
            defaultValue={yAxis.max}
            onChange={value => onChangeYMinMax("MAX", value)}
          />
          <LabelInput
            labelName={"간격"}
            defaultValue={yAxis.stepSize}
            onChange={onChangeYStepSize}
          />
        </Styled.LabelInputWrapper>
      </Styled.Box>
      <MetadataEditor />
    </EditorWrapper>
  );
}

export default ScatterEditor;
