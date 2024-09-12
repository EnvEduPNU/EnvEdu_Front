import { Button } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useState } from "react";
import { useTabStore } from "../../store/tabStore";
import ExampleGraph from "../../DataSet/ExampleGraph";

function TutorialSelectionModal({
  setSelectedGraph,
  setIsVisibleModal,
  selectedGraph,
}) {
  const { changeTab } = useTabStore();
  const [graphIdx, setGraphIdx] = useState(selectedGraph);
  const graphs = [
    "막대 그래프 형",
    "꺾은선 그래프 형",
    "버블 그래프 형",
    "원 그래프 형",
    "산점도 형",
    "막대와 꺽은선의 혼합 그래프 형",
  ];
  const onClickCreateGraphBtn = () => {
    setSelectedGraph(graphIdx);
    setIsVisibleModal((state) => !state);
    changeTab("graph");
  };

  const onClickOverlay = () => {
    setIsVisibleModal((state) => !state);
  };
  return (
    <>
      <div onClick={onClickOverlay} className="overlay"></div>
      <div className="graph-selection-modal">
        <div className="block">
          <div className="header">유형별 튜토리얼</div>
          <div className="graphs">
            {graphs.map((graph, idx) => (
              <div className="graph" key={idx + graph}>
                <ExampleGraph type={idx} />
                <label className="checkboxGraph">
                  <FormCheckInput
                    checked={graphIdx === idx}
                    id={graph}
                    onChange={() => setGraphIdx(idx)}
                  />
                  <span>{graph}</span>
                </label>
              </div>
            ))}
          </div>
          <Button onClick={onClickCreateGraphBtn}>튜토리얼 선택</Button>
        </div>
      </div>
    </>
  );
}

export default TutorialSelectionModal;
