import { useEffect, useState } from "react";
import "./DrawGraph.scss";
import Stepper from "../common/Stepper/Stepper";
import VariableSelection from "./VariableSelection";
import GraphSelection from "./GraphSelection";
import { Button } from "react-bootstrap";
import { useSelectedVariable } from "../store/drawGraphStore";

function DrawGraph() {
  const [activeStep, setActiveStep] = useState(1);
  const { selectedVariable } = useSelectedVariable();
  useEffect(() => {
    const currStep = JSON.parse(localStorage.getItem("dataLiteracy")).step;
    setActiveStep(currStep ? currStep : 1);
  }, []);

  const steps = [
    "변인 선택",
    "그래프 유형 선택",
    "축 및 스케일",
    "레이블,제목 범례",
  ];

  const Step = () => {
    switch (activeStep) {
      case 1:
        return <VariableSelection />;
      case 2:
        return <GraphSelection />;
    }
  };

  const onClickPrevButton = () => {
    if (activeStep === 1) {
      return;
    }

    const dataLiteracy = JSON.parse(localStorage.getItem("dataLiteracy"));
    localStorage.setItem(
      "dataLiteracy",
      JSON.stringify({
        ...dataLiteracy,
        step: 2,
      })
    );
    setActiveStep(state => state - 1);
  };
  const onClickNextBtn = () => {
    if (activeStep === 1) {
      localStorage.setItem(
        "dataLiteracy",
        JSON.stringify({
          drawGraph: { selectedIdx: selectedVariable },
          step: 2,
        })
      );
    }

    if (activeStep === steps.length) {
      return;
    }

    setActiveStep(state => state + 1);
  };
  return (
    <div className="draw-graph">
      <Stepper steps={steps} activeStep={activeStep} />
      <Step />
      <div className="buttonWrapper">
        <Button onClick={onClickPrevButton}>이전</Button>
        <Button onClick={onClickNextBtn}>다음</Button>
      </div>
    </div>
  );
}

export default DrawGraph;
