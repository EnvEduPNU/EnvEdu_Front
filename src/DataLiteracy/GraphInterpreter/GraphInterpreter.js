import { Button } from "react-bootstrap";
import SideBar from "../common/SideBar/SideBar";
import Stepper from "../common/Stepper/Stepper";
import "./GraphInterpreter.scss";
import { useState } from "react";
import GraphSummary from "./GraphSummary";

function GraphInterpreter() {
  const localStorageData = JSON.parse(localStorage.getItem("graphInterpreter"));
  const [activeStep, setActiveStep] = useState(
    localStorageData?.step ? localStorageData?.step : 1
  );
  const steps = ["그래프 요약", "그래프 해석", "그래프 평가"];

  const onClickPrevButton = () => {
    if (activeStep === 1) return;
    setActiveStep(state => state - 1);
  };

  const onClickNextBtn = () => {
    if (activeStep === steps.length) return;
    setActiveStep(state => state + 1);
  };

  const Step = () => {
    switch (activeStep) {
      case 1:
        return <GraphSummary />;
      default:
        return;
    }
  };

  return (
    <div className="graphInterpreter">
      <SideBar activeIdx={3} />
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

export default GraphInterpreter;
