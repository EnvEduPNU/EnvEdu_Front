import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function TeacherStepper({
  stepCount,
  setActiveStep,
  activeStep,
}) {
  const steps = Array.from({ length: stepCount }, (_, i) => `Step ${i + 1}`);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* active step은 기본적으로 배열 0 부터 시작되니 step을 1부터 시작하게 해놓았기 때문에 -1 해줌 */}
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
    </Box>
  );
}
