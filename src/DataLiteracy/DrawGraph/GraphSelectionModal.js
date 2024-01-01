import { Button } from "react-bootstrap";
import "./DrawGraph.scss";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useState } from "react";
import ExampleGraph from "./ExampleGraph";
import { usetutorialStroe } from "../store/tutorialStore";
import TutorialDescription from "../common/TutorialDescription/TutorialDescription";
import { ustTabStore } from "../store/tabStore";

function GraphSelectionModal({
  setSelectedGraph,
  setIsVisibleModal,
  selectedGraph,
  next,
}) {
  const { step, isTutorial, addStep } = usetutorialStroe();
  const { changeTab } = ustTabStore();
  const [graphIdx, setGraphIdx] = useState(selectedGraph);
  const graphs = [
    "막대 그래프",
    "꺾은선 그래프",
    "버블 그래프",
    "원 그래프",
    "산점도",
    "막대와 꺽은선의 혼합 그래프",
  ];
  const onClickCreateGraphBtn = () => {
    setSelectedGraph(graphIdx);
    setIsVisibleModal(state => !state);
    changeTab("graph");
    if (isTutorial) addStep();
  };

  const onClickOverlay = () => {
    if (isTutorial) return;

    setIsVisibleModal(state => !state);
  };
  return (
    <>
      <div onClick={onClickOverlay} className="overlay"></div>
      <div className="graph-selection-modal">
        <div className="block">
          <div className="header">그래프 유형</div>
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
          <Button onClick={onClickCreateGraphBtn}>그래프 선택</Button>
        </div>
        {isTutorial && step == 1 && (
          <TutorialDescription
            position="left"
            prevButtonClick={() => setIsVisibleModal(state => !state)}
            nextButtonClick={() => {
              setSelectedGraph(graphIdx);
              setIsVisibleModal(state => !state);
              changeTab("graph");
            }}
          />
        )}
      </div>
      ;
    </>
  );
}

export default GraphSelectionModal;
