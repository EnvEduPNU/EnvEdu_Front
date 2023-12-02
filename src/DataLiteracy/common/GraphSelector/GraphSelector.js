import { useState } from "react";
import * as Styled from "./Styled";
import GraphSelectionModal from "../../DrawGraph/GraphSelectionModal";
import { useGraphDataStore } from "../../store/graphStore";
import { usetutorialStroe } from "../../store/tutorialStore";
import TutorialDescription from "../TutorialDescription/TutorialDescription";

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
            title={"그래프 선택"}
            description={
              "이 데이터는 농업지대의 월별 강수량 데이터입니다. 이 데이터를 나타낼 그래프를 선택해보세요"
            }
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
