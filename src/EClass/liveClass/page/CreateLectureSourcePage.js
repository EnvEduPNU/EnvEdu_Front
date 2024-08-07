import TeacherWordProcessor from "../teacher/component/TeacherWordProcessor";
import TeacherStepper from "../teacher/component/TeacherStepper";
import { useState, useEffect } from "react";
import { useCreateLectureSourceStore } from "../store/CreateLectureSourceStore";
import { customAxios } from "../../../Common/CustomAxios";
import { v4 as uuidv4 } from "uuid"; // UUID 생성 함수
import moment from "moment"; // 날짜 처리 라이브러리
import axios from "axios";

export const CreateLectureSourcePage = (props) => {
  const {
    stepCount,
    summary,
    lectureName,
    lectureSummary,
    lectureUuid,
    timeStamp,
  } = props;
  const [activeStep, setActiveStep] = useState(1);
  const { contents, clearContents, setContents, updateContent } =
    useCreateLectureSourceStore();

  // 이미지 파일 업로드 하는 메서드
  const handleUpload = async (image, contentUuid) => {
    try {
      // Presigned URL 요청
      const response = await customAxios.get("/api/images/presigned-url", {
        params: { fileName: contentUuid },
      });

      console.log("URL 확인 : " + JSON.stringify(response.data, null, 2));
      const { preSignedUrl, imageUrl } = response.data;

      const contentType = "image/jpg";

      console.log("이미지 확인 : " + image.name);

      // S3에 파일 업로드
      await axios.put(preSignedUrl, image, {
        headers: {
          "Content-Type": contentType,
        },
      });

      console.log("이미지 업로드 성공");
      return imageUrl; // 이 URL을 데이터베이스에 저장할 수 있습니다.
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      throw error;
    }
  };

  // 다음 스텝 넘어가는 메서드
  const handleNextStep = async () => {
    // 컨텐츠의 uuid 설정
    const contentUuid = uuidv4();

    // 만약 스텝이 모두 지나지 않았으면 다음 스텝으로 넘김
    if (activeStep <= stepCount) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    // 마지막 단계 완료 시 저장 요청 보내기
    else {
      try {
        if (contents) {
          const imageUrlArray = [];

          for (const content of contents) {
            console.log(
              "컨텐츠 안에 들어 있는것 : " + JSON.stringify(content, null, 2)
            );

            // Reverse로 인덱스 저장
            for (let index = content.contents.length - 1; index >= 0; index--) {
              const item = content.contents[index];
              let imageUrl = null;
              let imageX = null;
              let imageY = null;

              if (item.type === "file") {
                const image = item.content;

                console.log("이미지 name : " + image.name);

                try {
                  // 이미지 업로드 후 이미지 보여줄 url 받음
                  imageUrl = await handleUpload(image, contentUuid);
                  console.log(
                    "이미지 imageUrl : " + JSON.stringify(imageUrl, null, 2)
                  );

                  imageX = item.x;
                  imageY = item.y;

                  console.log("이미지 x,y 체크 : " + imageX + " 과 " + imageY);

                  imageUrlArray.push({ imageUrl, imageX, imageY });

                  // 업로드가 성공하면 파일 컨텐츠를 제거
                  content.contents.splice(index, 1);
                } catch (error) {
                  console.error("Image upload failed for:", image, error);
                }
              }
            }
          }

          // setContents 함수로 업데이트된 내용을 저장
          setContents(contents);

          console.log(
            "Collected Image URLs:",
            JSON.stringify(imageUrlArray, null, 2)
          );
          // imageUrlArray를 이후 로직에 사용하거나 필요한 곳에 전달

          let changedPayload;
          let payload;

          //TODO 1 : localStorage 에서 username payload에 같이 저장요청보내기(수업자료 각 교사별 구분용)
          const teacherName = localStorage.getItem("username");

          // 수정 저장이면 drilling한 uuid 와 timestamp 설정
          if (lectureSummary) {
            console.log(
              "lectureUuid 체크 : " + JSON.stringify(lectureUuid, null, 2)
            );
            console.log(
              "timestamp 체크 : " + JSON.stringify(timeStamp, null, 2)
            );
            console.log(
              "stepContents 체크 : " + JSON.stringify(stepCount, null, 2)
            );

            // deletedImage URL 추출
            const deletedImageUrls = contents.flatMap((content) =>
              content.contents
                .filter((item) => item.type === "deleteImage")
                .map((item) => item.url)
            );

            console.log(
              "삭제 할 url : " + JSON.stringify(deletedImageUrls, null, 2)
            );

            // 여기문제 있음 -- 배열 0으로 하면 무조건 맨 앞에 있는 애들만 고쳐짐
            changedPayload = {
              uuid: lectureUuid,
              username: teacherName,
              timestamp: timeStamp,
              stepName: contents[0].stepName,
              stepCount: stepCount,
              contents: contents.map((content) => ({
                stepNum: content.stepNum,
                contentName: content.contentName,
                contents: content.contents
                  .filter(
                    (c) =>
                      !(
                        (c.type === "img" &&
                          deletedImageUrls.includes(c.content)) ||
                        (c.type === "html" && c.content.includes("<p><img")) ||
                        c.type === "deleteImage"
                      )
                  )
                  .map((c, index) => ({
                    type: c.type,
                    content: c.content,
                    x: c.type === "img" ? c.x : null,
                    y: c.type === "img" ? c.y : null,
                  })),
              })),
            };

            console.log(
              "이미지 어레이 확인 : " + JSON.stringify(imageUrlArray, null, 2)
            );

            if (imageUrlArray && imageUrlArray.length > 0) {
              imageUrlArray.forEach((image, index) => {
                changedPayload.contents.forEach((content) => {
                  content.contents.push({
                    type: "img",
                    content: image.imageUrl,
                    x: image.imageX,
                    y: image.imageY,
                  });
                });
              });
            }
          }
          // 새로운 저장이면 새로운 uuid 와 timestamp 생성
          else {
            console.log("컨텐츠 : ", JSON.stringify(contents, null, 2));

            payload = {
              uuid: contentUuid, // UUID 추가
              username: teacherName,
              timestamp: moment()
                .tz("Asia/Seoul")
                .format("YYYY-MM-DDTHH:mm:ssZ"), // 현재 서울 시각을 ISO 8601 포맷으로 추가
              stepName: contents[0].stepName,
              stepCount: stepCount,
              contents: contents.map((content) => ({
                stepNum: content.stepNum,
                contentName: content.contentName,
                contents: content.contents
                  .filter(
                    (c) => !(c.type === "html" && c.content.includes("<p><img"))
                  )
                  .map((c, index) => ({
                    type: c.type,
                    content:
                      c.type === "img"
                        ? imageUrlArray[index - 1]?.imageUrl
                        : c.content,
                    x:
                      c.type === "img"
                        ? imageUrlArray[index - 1]?.imageX
                        : null,
                    y:
                      c.type === "img"
                        ? imageUrlArray[index - 1]?.imageY
                        : null,
                  })),
              })),
            };
          }

          if (lectureSummary) {
            console.log(
              "수정 저장 : " + JSON.stringify(changedPayload, null, 2)
            );
            await customAxios.patch(
              "/api/steps/updateLectureContent",
              changedPayload
            );

            alert("수정 요청이 완료되었습니다.");
          } else {
            console.log("처음 저장 : " + JSON.stringify(payload, null, 2));
            await customAxios.post("/api/steps/saveLectureContent", payload);

            alert("저장 요청이 완료되었습니다.");
          }

          window.location.reload();
        }
      } catch (error) {
        console.error("저장 요청 실패:", error);
        alert("저장 요청에 실패했습니다.");
        window.location.reload();
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
  }, [clearContents, setContents, props.stepContents]);

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
