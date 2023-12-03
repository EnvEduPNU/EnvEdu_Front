import { useState } from "react";
import * as Styled from "./Styled";
import GraphSelectionModal from "../../DrawGraph/GraphSelectionModal";
import { useGraphDataStore } from "../../store/graphStore";
import { usetutorialStroe } from "../../store/tutorialStore";
import TutorialDescription from "../TutorialDescription/TutorialDescription";
import Portal from "../../../Portal";
import useComponentPosition from "../../hooks/useComponentPosition";
import Overlay from "../Overlay/Overlay";

function GraphSelector() {
  const { step, isTutorial, addStep } = usetutorialStroe();
  const { position, ref } = useComponentPosition();
  const { graphIdx, changeGraphIndex } = useGraphDataStore();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const onClickGraphSelectionBtn = () => {
    setIsVisibleModal(state => !state);
    if (isTutorial) {
      addStep();
    }
  };

  return (
    <>
      <Styled.Wrapper onClick={onClickGraphSelectionBtn} ref={ref}>
        그래프 선택하기
        {isTutorial && step == 0 && (
          <Portal>
            <TutorialDescription
              position="top"
              nextButtonClick={() => setIsVisibleModal(state => !state)}
              top={position.top + 60}
              left={position.left - 140}
            />
            <Overlay position={position} />
          </Portal>
        )}
      </Styled.Wrapper>
      {isVisibleModal && (
        <GraphSelectionModal
          selectedGraph={graphIdx}
          setSelectedGraph={changeGraphIndex}
          setIsVisibleModal={setIsVisibleModal}
        />
      )}
    </>
  );
}

export default GraphSelector;
