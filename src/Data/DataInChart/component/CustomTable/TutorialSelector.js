import { useEffect, useState } from "react";
import * as Styled from "./Styled";
import { useGraphDataStore } from "../../store/graphStore";
import GraphSelectionModal from "../GraphSelector/GraphSelectionModal";
import TutorialSelectionModal from "./TutorialSelectionModal";

function TutorialSelector(props) {
  const { graphIdx, changeGraphIndex } = useGraphDataStore();
  const [isVisibleModal, setIsVisibleModal] = useState(props.buttonClick);

  // 컴포넌트 해제될때는 무조건 Bar차트로 돌아가기
  useEffect(() => {
    return changeGraphIndex(0);
  }, []);

  useEffect(() => {
    if (!isVisibleModal) {
      props.setButtonClick(false);
    }
  }, [isVisibleModal]);

  return (
    <>
      {isVisibleModal && (
        <TutorialSelectionModal
          selectedGraph={graphIdx}
          setSelectedGraph={changeGraphIndex}
          setIsVisibleModal={setIsVisibleModal}
        />
      )}
    </>
  );
}

export default TutorialSelector;
