import Portal from "../../../../Portal";
import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import Overlay from "../../../common/Overlay/Overlay";
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
  const { isTutorial, step, type } = usetutorialStroe();
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
      {isTutorial && step === 8 && type !== "mix" && (
        <Portal>
          <TutorialDescription
            position="bottom"
            top={position.top - 160}
            left={position.left}
          />
          <Overlay position={position} />
        </Portal>
      )}
      {isTutorial && step === 9 && type === "mix" && (
        <Portal>
          <TutorialDescription
            position="bottom"
            top={position.top - 160}
            left={position.left}
          />
          <Overlay position={position} />
        </Portal>
      )}
    </Styled.Box>
  );
}

export default MetadataEditor;
