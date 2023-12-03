import { useState } from "react";
import * as Styled from "./Styled";
import GraphSelectionModal from "../../DrawGraph/GraphSelectionModal";
import { useGraphDataStore } from "../../store/graphStore";
import { usetutorialStroe } from "../../store/tutorialStore";
import TutorialDescription from "../TutorialDescription/TutorialDescription";
import { tutorials } from "../../utils/tutorials";

function GraphSelector() {
  const { step, isTutorial, addStep } = usetutorialStroe();
  const { graphIdx, changeGraphIndex, variables } = useGraphDataStore();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const onClickGraphSelectionBtn = () => {
    setIsVisibleModal(state => !state);
    if (isTutorial) {
      addStep();
    }
  };

  return (
    <>
      <Styled.Wrapper onClick={onClickGraphSelectionBtn}>
        그래프 선택하기
        {isTutorial && step == 0 && (
          <TutorialDescription
            position="top"
            nextButtonClick={() => setIsVisibleModal(state => !state)}
          />
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
