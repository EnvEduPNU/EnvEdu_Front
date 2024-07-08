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
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} sx={{ margin: "10px 0 20px 0" }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              onClick={handleStep(index)}
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
