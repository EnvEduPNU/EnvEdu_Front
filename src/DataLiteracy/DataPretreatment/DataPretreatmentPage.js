import { useNavigate } from "react-router-dom";
import Stepper from "../common/Stepper/Stepper";
import SideBar from "../common/SideBar/SideBar";
import { Button } from "react-bootstrap";
import { useState } from "react";
import "./DataPretreatment.scss";
import MissingValue from "./MissingValue";
import OutlierRemoval from "./OutlierRemoval";

function DataPretreatmentPage() {
  const navigate = useNavigate();
  const localStorageData = JSON.parse(
    localStorage.getItem("dataPretreatmentPage")
  );
  const [activeStep, setActiveStep] = useState(
    localStorageData?.step ? localStorageData?.step : 1
  );
  const steps = ["결측치", "이상치", "스케일링"];

  const onClickPrevButton = () => {
    if (activeStep === 1) {
      navigate(-1);
      return;
    }
    setActiveStep(state => state - 1);
  };

  const onClickNextBtn = () => {
    if (activeStep === steps.length) return;
    setActiveStep(state => state + 1);
  };

  const Step = () => {
    switch (activeStep) {
      case 1:
        return <MissingValue />;
      case 2:
        return <OutlierRemoval />;
    }
  };
  return (
    <div className="dataPretreatmentPage">
      <SideBar activeIdx={1} />
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

export default DataPretreatmentPage;
