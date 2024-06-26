import ButtonSelector from "../../../../../DataLiteracy/common/ButtonSelector/ButtonSelector";
import useChartMetaDataStore from "../../../store/chartMetaDataStore";
import * as Styled from "./Styled";

function MetadataEditor() {
  const {
    metaData: { legendPostion, datalabelAnchor },
    changeLegendPosition,
    changeDatalabelAnchor,
  } = useChartMetaDataStore();

  const onChangeLegendPostition = postion => {
    changeLegendPosition(postion);
  };

  const onChangeLabelAnchor = labelAnchor => {
    changeDatalabelAnchor(labelAnchor);
  };

  return (
    <Styled.Box>
      <Styled.Title>범례, 레이블 위치 선택</Styled.Title>
      <Styled.ButtonSelectorWrapper>
        <ButtonSelector
          value={"범례 위치"}
          selectList={["top", "bottom", "left", "right"]}
          onChange={onChangeLegendPostition}
          defaultValue={legendPostion}
        />
        <ButtonSelector
          value={"레이블 위치"}
          selectList={["end", "start", "center"]}
          onChange={onChangeLabelAnchor}
          defaultValue={datalabelAnchor}
        />
      </Styled.ButtonSelectorWrapper>
    </Styled.Box>
  );
}

export default MetadataEditor;
