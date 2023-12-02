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
    addStep();
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
            title={"그래프 선택"}
            description={
              "시간에 따른 자료의 추세를 나타내기에 적합한 그래프는 꺾은선 그래프로, 데이터를 이용해 농업지대의 월별 강수량의 변화를 나타내려면 꺾은선 그래프를 선택해주세요."
            }
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
