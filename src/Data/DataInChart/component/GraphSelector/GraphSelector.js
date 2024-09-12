import { useEffect, useState } from "react";
import * as Styled from "./Styled";
import { useGraphDataStore } from "../../store/graphStore";
import GraphSelectionModal from "./GraphSelectionModal";

function GraphSelector() {
  const { graphIdx, changeGraphIndex } = useGraphDataStore();
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const onClickGraphSelectionBtn = () => {
    setIsVisibleModal((state) => !state);
  };

  // 컴포넌트 해제될때는 무조건 Bar차트로 돌아가기
  useEffect(() => {
    return changeGraphIndex(0);
  }, []);

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
