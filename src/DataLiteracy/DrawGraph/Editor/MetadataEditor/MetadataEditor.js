import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import { useChartMetaDataStore } from "../../../store/drawGraphStore";
import * as Styled from "./Styled";

function MetadataEditor() {
  const {
    metaData: { legendPostion, datalabelAnchor },
    changeLegendPosition,
    changeDatalabelAnchor,
  } = useChartMetaDataStore();

  const changeEnglishPostion = position => {
    switch (position) {
      case "위":
        return "top";
      case "아래":
        return "bottom";
      case "왼쪽":
        return "left";
      case "오른쪽":
        return "right";
      default:
        return "no";
    }
  };

  const changeEnglishAnchor = anchor => {
    switch (anchor) {
      case "위":
        return "end";
      case "아래":
        return "start";
      case "중간":
        return "center";
      default:
        return "no";
    }
  };

  const onChangeLegendPostition = postion => {
    changeLegendPosition(changeEnglishPostion(postion));
  };

  const onChangeLabelAnchor = labelAnchor => {
    changeDatalabelAnchor(changeEnglishAnchor(labelAnchor));
  };

  console.log(legendPostion, datalabelAnchor);
  return (
    <Styled.Wrapper>
      <Styled.Box>
        <Styled.Title>범례, 레이블 위치 선택</Styled.Title>
        <Styled.ButtonSelectorWrapper>
          <ButtonSelector
            value={"범례 위치"}
            selectList={["표시안함", "위", "아래", "왼쪽", "오른쪽"]}
            onChange={onChangeLegendPostition}
            // defaultValue={"표시안함"}
          />
          <ButtonSelector
            value={"레이블 위치"}
            selectList={["표시안함", "위", "중간", "아래"]}
            onChange={onChangeLabelAnchor}
            // defaultValue={"중간"}
          />
        </Styled.ButtonSelectorWrapper>
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default MetadataEditor;
