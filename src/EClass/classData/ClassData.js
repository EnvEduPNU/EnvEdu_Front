import React, { useState, useEffect } from "react";
import { customAxios } from "../../Common/CustomAxios";
import "./myData.scss";
import { CreateLectureSourcePage } from "../liveClass/page/CreateLectureSourcePage";
import DataTable from "./DataTable";
import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MultiTablePage from "./MultiTablePage";

function ClassData() {
  const [summary, setSummary] = useState([]);
  const [lectureSummary, setLectureSummary] = useState([]);
  const [lectureUuid, setLectureUuid] = useState();
  const [timeStamp, setTimeStamp] = useState();
  const [showWordProcessor, setShowWordProcessor] = useState(false);

  const [myDataTable, setMyDataTable] = useState(false);
  const [dataType, setDataType] = useState(null);
  const [dataId, setDataId] = useState(null);

  const [stepName, setStepName] = useState(null);
  const [stepContents, setStepContents] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [lectureName, setLectureName] = useState("");
  const [stepCount, setStepCount] = useState(1);
  const [stepCountLoad, setStepCountLoad] = useState();
  const [eClassType, setEClassType] = useState("");

  // 수업 자료 가져오는 useEffect
  useEffect(() => {
    const TeacherName = localStorage.getItem("username");

    // 수업 자료 리스트 가져오는 요청
    customAxios
      .get("/api/steps/getLectureContent")
      .then((res) => {
        // TeacherName과 username이 같은 항목들만 필터링
        const filteredData = res.data.filter(
          (data) => data.username === TeacherName
        );

        const formattedData = filteredData.map((data) => ({
          ...data,
          uuid: data.uuid,
          username: data.username,
          timestamp: data.timestamp,
          stepName: data.stepName, // data[0].stepName이 아니라 data.stepName
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
              : [], // contents가 null일 경우 빈 배열로 대체
          })),
        }));
        setLectureSummary(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  // 데이터 테이블 가져오는 useEffect
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
    setMyDataTable(false);

    console.log("스텝 네임 : " + stepName);
    console.log("스텝 카운트 : " + stepCount);
    console.log("스텝 uuid : " + uuid);
    console.log("스텝 timestamp : " + timestamp);
    console.log("스텝 stepCount : " + stepCount);

    setStepName(stepName);
    setStepCountLoad(stepCount);
    setStepContents(contents);
    setLectureUuid(uuid);
    setTimeStamp(timestamp);
  };

  const handleCreateLecture = () => {
    setOpenModal(true);
    setShowWordProcessor(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalConfirm = () => {
    setOpenModal(false);
    setShowWordProcessor(true);
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

  return (
    <div className="myData-container">
      <div className="myData-left">
        {/* 왼쪽 상단 메인페이지 돌아가는 블럭 */}
        <div className="myData-folder">
          <button
            style={{
              border: "none",
              fontWeight: "600",
              borderRadius: "0.625rem",
              margin: "10px",
              backgroundColor: "white",
            }}
            onClick={() => window.location.reload()}
          >
            수업 자료
          </button>
        </div>

        <div className="myData-summary">
          <div style={{ overflow: "auto", height: "20rem" }}>
            <div className="yellow-btn" style={{ width: "100%" }}>
              수업 자료
            </div>
            <>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th key="index">날짜</th>
                    <th key="stepName">수업 이름</th>
                    <th key="delete">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {lectureSummary
                    .sort(
                      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                    )
                    .map((item, index) => (
                      <tr
                        key={index}
                        onClick={() =>
                          getLectureDataTable(
                            item.stepName,
                            item.stepCount,
                            item.contents,
                            item.uuid,
                            item.timestamp
                          )
                        }
                      >
                        <td>{item.timestamp.split("T")[0]}</td>
                        <td>{item.stepName}</td>
                        <td>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the row's onClick
                              handleDeleteLecture(
                                index,
                                item.uuid,
                                item.timestamp
                              );
                            }}
                            aria-label="delete"
                            color="secondary"
                            sx={{ width: "30px" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          </div>
          <button
            style={{
              border: "none",
              fontWeight: "600",
              borderRadius: "0.625rem",
              margin: "10px",
            }}
            onClick={handleCreateLecture}
          >
            수업 자료 만들기
          </button>
        </div>
      </div>

      {/* 왼쪽 메뉴 리스트 제외 한 오른쪽 페이지 */}
      <div className="myData-right">
        {/* 수업 자료 만들기 버튼을 눌렀을 경우 */}
        {showWordProcessor ? (
          <CreateLectureSourcePage
            summary={summary}
            lectureName={lectureName}
            stepCount={stepCount}
            eClassType={eClassType}
          />
        ) : (
          <>
            {/* 왼쪽 메뉴 리스트에서 수업자료를 클릭했을 경우  */}
            {stepName && (
              <>
                {console.log(
                  "컨텐츠 내용 " + JSON.stringify(stepContents, null, 2)
                )}
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
              </>
            )}

            {/* 기본 수업자료 메인페이지 */}
            {!stepName && (
              <div>
                <MultiTablePage />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ClassData;
