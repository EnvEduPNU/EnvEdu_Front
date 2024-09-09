import React, { useState, useEffect } from "react";
import { customAxios } from "../../Common/CustomAxios";
import "./myData.scss";
import { CreateLectureSourcePage } from "../liveClass/page/CreateLectureSourcePage";
import LectureCardCarousel from "./LectureCardCarousel";
import { Typography } from "@mui/material";
import LectureList from "./LectureList";

function ClassData() {
  const [summary, setSummary] = useState([]);
  const [lectureSummary, setLectureSummary] = useState([]);
  const [lectureUuid, setLectureUuid] = useState();
  const [timeStamp, setTimeStamp] = useState();
  const [showWordProcessor, setShowWordProcessor] = useState(false);
  const [showLectureList, setShowLectureList] = useState(false);
  const [stepName, setStepName] = useState(null);
  const [stepContents, setStepContents] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [lectureName, setLectureName] = useState("");
  const [stepCount, setStepCount] = useState(1);
  const [stepCountLoad, setStepCountLoad] = useState();
  const [eClassType, setEClassType] = useState("");

  useEffect(() => {
    const TeacherName = localStorage.getItem("username");

    customAxios
      .get("/api/steps/getLectureContent")
      .then((res) => {
        const filteredData = res.data.filter(
          (data) => data.username === TeacherName
        );

        const formattedData = filteredData.map((data) => ({
          ...data,
          uuid: data.uuid,
          username: data.username,
          timestamp: data.timestamp,
          stepName: data.stepName,
          stepCount: data.stepCount,
          contents: data.contents.map((content) => ({
            stepNum: content.stepNum,
            contentName: content.contentName,
            contents: content.contents
              ? content.contents.map((c) => ({
                  type: c.type,
                  content: c.content,
                  x: c.x,
                  y: c.y,
                }))
              : [],
          })),
        }));

        console.log("수업 자료 들 : " + JSON.stringify(formattedData, null, 2));

        setLectureSummary(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    customAxios
      .get("/mydata/list")
      .then((res) => {
        const formattedData = res.data.map((data) => ({
          ...data,
          saveDate: data.saveDate.split("T")[0],
          dataLabel:
            data.dataLabel === "AIRQUALITY"
              ? "대기질 데이터"
              : data.dataLabel === "OCEANQUALITY"
              ? "수질 데이터"
              : data.dataLabel,
        }));
        setSummary(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  const getLectureDataTable = (
    stepName,
    stepCount,
    contents,
    uuid,
    timestamp
  ) => {
    setShowWordProcessor(false);
    setShowLectureList(true);
    setStepName(stepName);
    setStepCountLoad(stepCount);
    setStepContents(contents);
    setLectureUuid(uuid);
    setTimeStamp(timestamp);
  };

  const handleCreateLecture = () => {
    setOpenModal(true);
    setShowWordProcessor(true);
    setShowLectureList(true);
  };

  const handleDeleteLecture = async (index, uuid, timestamp) => {
    try {
      await customAxios.delete(
        `/api/steps/deleteLectureContent/${uuid}/${timestamp}`
      );
      const updatedLectures = [...lectureSummary];
      updatedLectures.splice(index, 1);
      setLectureSummary(updatedLectures);
      setLectureUuid(uuid);
      alert("수업 자료가 성공적으로 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting lecture:", error);
      alert("수업 자료 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleMainPageClick = () => {
    window.location.reload();
  };

  return (
    <div
      className="myData-container"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* {showLectureList && (
        <div className="myData-left">
          <LectureList
            lectureSummary={lectureSummary}
            getLectureDataTable={getLectureDataTable}
            handleDeleteLecture={handleDeleteLecture}
            handleCreateLecture={handleCreateLecture}
            handleMainPageClick={handleMainPageClick}
          />
        </div>
      )} */}

      <div className="myData-right">
        {!showLectureList && !stepName && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              margin: "20px 0",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              수업자료 메인 페이지
            </Typography>
            <LectureCardCarousel
              lectureSummary={lectureSummary}
              getLectureDataTable={getLectureDataTable}
              handleDeleteLecture={handleDeleteLecture}
            />
            <button
              style={{
                border: "none",
                fontWeight: "600",
                borderRadius: "0.625rem",
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#f3b634",
                cursor: "pointer",
              }}
              onClick={handleCreateLecture}
            >
              수업 자료 만들기
            </button>
          </div>
        )}

        {showWordProcessor ? (
          <CreateLectureSourcePage
            summary={summary}
            lectureName={lectureName}
            stepCount={stepCount}
            eClassType={eClassType}
          />
        ) : (
          <>
            {stepName && (
              <CreateLectureSourcePage
                summary={summary}
                lectureSummary={lectureSummary}
                lectureName={stepName}
                stepCount={stepCountLoad}
                stepContents={stepContents}
                eClassType={eClassType}
                lectureUuid={lectureUuid}
                timeStamp={timeStamp}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ClassData;
