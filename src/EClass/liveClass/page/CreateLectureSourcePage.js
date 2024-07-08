import TeacherWordProcessor from "../teacher/component/TeacherWordProcessor";
import TeacherStepper from "../teacher/component/TeacherStepper";
import { useState, useEffect } from "react";
import { useCreateLectureSourceStore } from "../store/CreateLectureSourceStore";
import { customAxios } from "../../../Common/CustomAxios";

export const CreateLectureSourcePage = (props) => {
  const { stepCount, summary, lectureName } = props;
  const [activeStep, setActiveStep] = useState(0); // 기본값을 0으로 설정
  const { contents, clearContents, setContents } =
    useCreateLectureSourceStore();

  const handleNextStep = async () => {
    if (activeStep < stepCount) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      // 마지막 단계 완료 시 저장 요청 보내기

      try {
        if (contents) {
          const payload = {
            stepName: contents[0].stepName, // 최상위 데이터로 사용할 stepName
            stepCount: stepCount,
            contents: contents.map((content) => ({
              stepNum: content.stepNum,
              contentName: content.contentName,
              contents: content.contents.map((c) => ({
                type: c.type,
                content: c.content,
              })),
            })),
          };

          console.log("저장된 전부 데이터:", JSON.stringify(payload, null, 2));

          await customAxios.post("/api/steps/saveLectureContent", payload);
          alert("저장 요청이 완료되었습니다.");
        } else {
          console.log("데이터 로드중");
        }
      } catch (error) {
        console.error("저장 요청 실패:", error);
        alert("저장 요청에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    if (props.stepContents) {
      console.log(
        "넘어와서 컨텐츠 확인 : " + JSON.stringify(props.stepContents, null, 2)
      );

      setContents(props.stepContents);
    }

    return () => {
      clearContents();
    };
  }, [clearContents]);

  return (
    <>
      <TeacherStepper
        stepCount={stepCount}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
      />
      <TeacherWordProcessor
        summary={summary}
        lectureName={lectureName}
        activeStep={activeStep}
        stepCount={stepCount}
        handleNextStep={handleNextStep}
      />
    </>
  );
};

export default CreateLectureSourcePage;
