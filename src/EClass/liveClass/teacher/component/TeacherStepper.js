import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TextField from "@mui/material/TextField";

export default function TeacherStepper({
  stepCount,
  setStepCount,
  setActiveStep,
  activeStep,
  stepperStepName,
  setStepperStepName,
  lectureName,
}) {
  const [steps, setSteps] = useState([]);
  const [editingStep, setEditingStep] = useState(null);
  const [stepName, setStepName] = useState("");

  // 처음에 stepperStepName이 없을 경우 기본 값 설정
  useEffect(() => {
    // steps가 비어 있으면 steps 설정
    if (steps.length === 0) {
      setSteps(
        stepperStepName.map(
          (step) => step.contentName || `Step ${step.stepNum}`
        )
      );
    }

    setStepperStepName((prevStepperStepName) => [
      ...prevStepperStepName.map((step) => ({
        ...step,
        lectureName: lectureName, // 모든 스텝에 최신 lectureName을 반영
      })),
    ]);
  }, [lectureName, stepCount]);

  // 처음 마운트될 때 addStep 한 번 실행
  useEffect(() => {
    if (steps.length === 0) {
      addStep();
    }
  }, []);

  useEffect(() => {
    if (lectureName) {
      setStepperStepName((prevStepperStepName) => [
        ...prevStepperStepName.map((step) => ({
          ...step,
          lectureName: lectureName, // 모든 스텝에 최신 lectureName을 반영
        })),
      ]);
    }
  }, [lectureName]);

  const handleStep = (step) => () => {
    console.log("액티브 스텝 설정 : " + step);
    setActiveStep(step);
  };

  const addStep = () => {
    const newStepCount = steps.length + 1;

    // 새로운 step을 추가
    setSteps((prevSteps) => [...prevSteps, `Step ${newStepCount}`]);
    setStepCount((prevStepCount) => prevStepCount + 1);

    // stepperStepName에도 새로운 step 추가
    setStepperStepName((prevStepperStepName) => [
      ...prevStepperStepName.map((step) => ({
        ...step,
        lectureName: lectureName, // 모든 스텝에 최신 lectureName을 반영
      })),
      {
        lectureName: lectureName, // 새로운 스텝에도 최신 lectureName 반영
        stepNum: newStepCount,
        contentName: `Step ${newStepCount}`,
        contents: [{ type: "title", content: `Step ${newStepCount}` }],
      },
    ]);
  };

  const removeStep = () => {
    if (steps.length > 1) {
      const newStepCount = steps.length - 1;

      // 마지막 스텝을 제거
      setSteps((prevSteps) => prevSteps.slice(0, -1));
      setStepCount(newStepCount);

      // stepperStepName에서 마지막 스텝 제거
      setStepperStepName((prevStepperStepName) =>
        prevStepperStepName.slice(0, -1)
      );

      if (activeStep > newStepCount) {
        setActiveStep(newStepCount);
      }
    }
  };

  const handleDoubleClick = (index) => {
    setEditingStep(index);
    setStepName(steps[index]);
  };

  const handleBlurOrEnter = (index) => {
    if (stepName.trim() !== "") {
      const updatedStepperStepName = [...stepperStepName];

      console.log(
        "Updated stepperStepName: " +
          JSON.stringify(updatedStepperStepName, null, 2)
      );

      // 배열이 유효한지, 그리고 인덱스가 배열의 범위 내에 있는지 확인
      if (updatedStepperStepName && updatedStepperStepName[index]) {
        updatedStepperStepName[index].contentName = stepName;

        if (updatedStepperStepName[index].contents) {
          updatedStepperStepName[index].contents = updatedStepperStepName[
            index
          ].contents.map((contentItem) => {
            if (contentItem.type === "title") {
              return {
                ...contentItem,
                content: stepName,
              };
            }
            return contentItem;
          });
        }

        setStepperStepName(updatedStepperStepName);
        const updatedSteps = updatedStepperStepName.map(
          (step) => step.contentName || `Step ${step.stepNum}`
        );
        setSteps(updatedSteps);
      } else {
        console.error(
          `Index ${index} is out of bounds for stepperStepName array`
        );
      }
    }

    setEditingStep(null);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      handleBlurOrEnter(index);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep - 1} sx={{ margin: "10px 0 20px 0" }}>
        {steps?.map((label, index) => (
          <Step key={index}>
            <StepLabel
              onClick={handleStep(index + 1)}
              sx={{
                cursor: "pointer",
                "& .MuiStepLabel-label, & .MuiStepIcon-root": {
                  cursor: "pointer",
                },
                "&:hover .MuiStepLabel-label, &:hover .MuiStepIcon-root": {
                  color: "blue",
                  textDecoration: "underline",
                },
              }}
            >
              {editingStep === index ? (
                <TextField
                  className="editing-step"
                  value={stepName}
                  onChange={(e) => setStepName(e.target.value)}
                  onBlur={() => handleBlurOrEnter(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => handleDoubleClick(index)}>
                  {label}
                </span>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={addStep}
          sx={{ mr: 1, width: "5%" }}
        >
          <AddIcon />
        </Button>
        <Button
          variant="contained"
          onClick={removeStep}
          sx={{ width: "5%" }}
          color="secondary"
        >
          <RemoveIcon />
        </Button>
      </Box>
    </Box>
  );
}
