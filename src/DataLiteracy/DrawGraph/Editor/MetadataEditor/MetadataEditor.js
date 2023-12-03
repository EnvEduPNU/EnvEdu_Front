import Portal from "../../../../Portal";
import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import TutorialDescription from "../../../common/TutorialDescription/TutorialDescription";
import useComponentPosition from "../../../hooks/useComponentPosition";
import { useChartMetaDataStore } from "../../../store/drawGraphStore";
import { usetutorialStroe } from "../../../store/tutorialStore";
import * as Styled from "./Styled";

function MetadataEditor() {
  const {
    metaData: { legendPostion, datalabelAnchor },
    changeLegendPosition,
    changeDatalabelAnchor,
  } = useChartMetaDataStore();
  const { isTutorial, step } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  const onChangeLegendPostition = postion => {
    changeLegendPosition(postion);
  };

  const onChangeLabelAnchor = labelAnchor => {
    changeDatalabelAnchor(labelAnchor);
  };

  return (
    <Styled.Box ref={ref}>
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
      {isTutorial && step === 8 && (
        <Portal>
          <TutorialDescription
            position="right"
            top={position.top - 50}
            left={position.left - 330}
          />
        </Portal>
      )}
    </Styled.Box>
  );
}

export default MetadataEditor;
