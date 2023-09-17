import { useState } from "react";
import "./DrawGraph.scss";
import Stepper from "../common/Stepper/Stepper";
import VariableSelection from "./VariableSelection";
import GraphSelection from "./GraphSelection";
import { Button } from "react-bootstrap";
import { useSelectedVariable } from "../store/drawGraphStore";
import ChartAxisScaleEditor from "./ChartAxisScaleEditor";
import SideBar from "../common/SideBar/SideBar";

function DrawGraph() {
  const localStorageData = JSON.parse(localStorage.getItem("drawGraph"));
  const [activeStep, setActiveStep] = useState(
    localStorageData?.step ? localStorageData?.step : 1
  );
  const { selectedVariable } = useSelectedVariable();

  const steps = [
    "변인 선택",
    "그래프 유형 선택",
    "축 및 스케일",
    "레이블,제목 범례",
  ];

  const onClickPrevButton = () => {
    if (activeStep === 1) return;

    const drawGraph = JSON.parse(localStorage.getItem("drawGraph"));
    localStorage.setItem(
      "drawGraph",
      JSON.stringify({
        ...drawGraph,
        step: activeStep - 1,
      })
    );

    setActiveStep(state => state - 1);
  };

  const onClickNextBtn = () => {
    if (activeStep === steps.length) return;
    const drawGraph = JSON.parse(localStorage.getItem("drawGraph"));
    if (activeStep === 1) {
      if (drawGraph) {
        //이미 있다면 1단계보다 높은 스텝에서 이전 버튼으로 온것임
        localStorage.setItem(
          "drawGraph",
          JSON.stringify({
            ...drawGraph,
            selectedVariable,
            step: 2,
          })
        );
      } else {
        localStorage.setItem(
          "drawGraph",
          JSON.stringify({
            selectedVariable,
            step: 2,
          })
        );
      }
      setActiveStep(state => state + 1);
      return;
    }
    localStorage.setItem(
      "drawGraph",
      JSON.stringify({
        ...drawGraph,
        selectedVariable,
        step: activeStep + 1,
      })
    );
    setActiveStep(state => state + 1);
  };

  const Step = () => {
    switch (activeStep) {
      case 1:
        return <VariableSelection />;
      case 2:
        return <GraphSelection />;
      case 3:
        return <ChartAxisScaleEditor />;
      default:
        return;
    }
  };

  return (
    <div className="draw-graph">
      <SideBar />
      <div>
        <Stepper steps={steps} activeStep={activeStep} />
        <Step />
        <div className="buttonWrapper">
          <Button onClick={onClickPrevButton}>이전</Button>
          <Button onClick={onClickNextBtn}>다음</Button>
        </div>
      </div>
    </div>
  );
}

export default DrawGraph;
