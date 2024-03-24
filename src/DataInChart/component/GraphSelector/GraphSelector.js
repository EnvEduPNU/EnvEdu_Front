import { useState } from "react";
import * as Styled from "./Styled";
import { useGraphDataStore } from "../../store/graphStore";
import GraphSelectionModal from "./GraphSelectionModal";

function GraphSelector() {
  const { graphIdx, changeGraphIndex } = useGraphDataStore();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const onClickGraphSelectionBtn = () => {
    setIsVisibleModal(state => !state);
  };

  return (
    <>
      <Styled.Wrapper onClick={onClickGraphSelectionBtn}>
        그래프 선택하기
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
