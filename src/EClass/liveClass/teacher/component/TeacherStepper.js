import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add"; // 추가: Add 아이콘
import RemoveIcon from "@mui/icons-material/Remove"; // 추가: Remove 아이콘

export default function TeacherStepper({
  stepCount,
  setStepCount, // 추가: 상위 컴포넌트에서 stepCount를 업데이트할 수 있도록 함
  setActiveStep,
  activeStep,
}) {
  React.useEffect(() => {
    setSteps(Array.from({ length: stepCount }, (_, i) => `Step ${i + 1}`));
  }, [stepCount]);

  const [steps, setSteps] = React.useState(
    Array.from({ length: stepCount }, (_, i) => `Step ${i + 1}`)
  );

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const addStep = () => {
    const newStepCount = steps.length + 1;
    setSteps([...steps, `Step ${newStepCount}`]);
    setStepCount(newStepCount); // 상위 컴포넌트의 stepCount를 업데이트
  };

  const removeStep = () => {
    if (steps.length > 1) {
      const newStepCount = steps.length - 1;
      setSteps(steps.slice(0, -1));
      setStepCount(newStepCount); // 상위 컴포넌트의 stepCount를 업데이트
      if (activeStep > newStepCount) {
        setActiveStep(newStepCount);
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* 스테퍼 */}
      <Stepper activeStep={activeStep - 1} sx={{ margin: "10px 0 20px 0" }}>
        {steps.map((label, index) => (
          <Step key={label}>
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
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* 스텝 추가/삭제 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
