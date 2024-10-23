import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip'; // Tooltip 컴포넌트 추가

import { useCreateLectureSourceStore } from '../../store/CreateLectureSourceStore';

const MAX_STEPS = 6; // 스텝의 최대 개수 설정

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
  const [stepName, setStepName] = useState('');

  const { contents, addContent, updateContent, clearContents, removeContent } =
    useCreateLectureSourceStore();

  // 처음에 stepperStepName이 없을 경우 기본 값 설정
  useEffect(() => {
    if (steps.length === 0) {
      setSteps(
        stepperStepName.map(
          (step) => step.contentName || `Step ${step.stepNum}`,
        ),
      );
    }

    // 스텝에 lectureName 추가
    setStepperStepName((prevStepperStepName) => [
      ...prevStepperStepName.map((step) => ({
        ...step,
        lectureName: lectureName,
      })),
    ]);
  }, [lectureName, stepCount]);

  // 처음 마운트될 때 stepperStepName이 비어 있을 경우만 addStep 한 번 실행
  useEffect(() => {
    if (stepperStepName.length === 0 && steps.length === 0) {
      addStep(); // 처음 로드 시에만 한 번 실행되도록 조건 추가
    }
  }, [stepperStepName]);

  // lectureName이 변경될 때 실행
  useEffect(() => {
    if (lectureName && steps.length > 0) {
      setStepperStepName((prevStepperStepName) =>
        prevStepperStepName.map((step) => ({
          ...step,
          lectureName: lectureName,
        })),
      );
    }
  }, [lectureName]);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const addStep = () => {
    if (steps.length >= MAX_STEPS) {
      alert(`최대 ${MAX_STEPS}개의 스텝만 추가할 수 있습니다.`);
      return;
    }

    const newStepCount = steps.length + 1;

    // 새로운 step을 추가
    setSteps((prevSteps) => [...prevSteps, `Step ${newStepCount}`]);
    setStepCount((prevStepCount) => prevStepCount + 1);

    // 기존 데이터 유지하면서 새로운 스텝 추가
    const newStep = {
      lectureName: lectureName,
      stepNum: newStepCount,
      contentName: `Step ${newStepCount}`,
      contents: [{ type: 'title', content: `Step ${newStepCount}` }],
    };

    // stepperStepName 업데이트 시 기존 데이터를 유지하며 추가
    setStepperStepName((prevStepperStepName) => [
      ...prevStepperStepName,
      newStep,
    ]);

    // 스토어에도 새로운 step 추가
    addContent(newStep);
  };

  const removeStep = () => {
    if (steps.length > 1) {
      const newStepCount = steps.length - 1;

      // 마지막 스텝을 제거
      setSteps((prevSteps) => prevSteps.slice(0, -1));
      setStepCount(newStepCount);

      // stepperStepName에서 마지막 스텝 제거, 기존 데이터 유지
      const updatedStepperStepName = stepperStepName.slice(0, -1);
      setStepperStepName(updatedStepperStepName);

      // 스토어에서 해당 스텝 제거
      removeContent(newStepCount); // 인덱스로 스토어에서 해당 스텝 제거

      // 활성 스텝 조정
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
    if (stepName.trim() !== '') {
      const updatedStepperStepName = [...stepperStepName];

      if (updatedStepperStepName && updatedStepperStepName[index]) {
        updatedStepperStepName[index].contentName = stepName;

        if (updatedStepperStepName[index].contents) {
          updatedStepperStepName[index].contents = updatedStepperStepName[
            index
          ].contents.map((contentItem) => {
            if (contentItem.type === 'title') {
              return { ...contentItem, content: stepName };
            }
            return contentItem;
          });
        }

        setStepperStepName(updatedStepperStepName);

        // stepName 업데이트
        const updatedSteps = updatedStepperStepName.map(
          (step) => step.contentName || `Step ${step.stepNum}`,
        );
        setSteps(updatedSteps);

        // 스토어 업데이트
        updateContent(index, updatedStepperStepName[index]);
      } else {
        console.error(`Index ${index} is out of bounds`);
      }
    }

    setEditingStep(null);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      handleBlurOrEnter(index);
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Stepper
        activeStep={activeStep - 1}
        sx={{ width: '90%', margin: '10px 0 20px 0' }}
      >
        {steps?.map((label, index) => (
          <Tooltip title="더블 클릭하여 스텝 이름 설정">
            <Step key={index}>
              <StepLabel
                onClick={handleStep(index + 1)}
                sx={{
                  cursor: 'pointer',
                  '& .MuiStepLabel-label, & .MuiStepIcon-root': {
                    cursor: 'pointer',
                  },
                  '&:hover .MuiStepLabel-label, &:hover .MuiStepIcon-root': {
                    color: 'blue',
                    textDecoration: 'underline',
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
          </Tooltip>
        ))}
      </Stepper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* Add 버튼에 Tooltip 추가 */}
        <Tooltip title="새로운 스텝 추가">
          <Button
            variant="contained"
            onClick={addStep}
            sx={{ mr: 1, width: '5%' }}
          >
            <AddIcon />
          </Button>
        </Tooltip>

        {/* Remove 버튼에 Tooltip 추가 */}
        <Tooltip title="마지막 스텝 제거">
          <Button
            variant="contained"
            onClick={removeStep}
            sx={{ width: '5%' }}
            color="secondary"
          >
            <RemoveIcon />
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}
