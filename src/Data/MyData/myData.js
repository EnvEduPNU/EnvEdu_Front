import React, { useState, useEffect } from "react";
import { customAxios } from "../../Common/CustomAxios";
import "./myData.scss";
import { CreateLectureSourcePage } from "../../EClass/liveClass/page/CreateLectureSourcePage";
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

const MyData = () => {
  const [summary, setSummary] = useState([]);
  const [lectureSummary, setLectureSummary] = useState([]);
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

    customAxios
      .get("/api/steps/getLectureContent")
      .then((res) => {
        console.log("호출 완료 : " + JSON.stringify(res, null, 2));

        const formattedData = res.data.map((data) => ({
          ...data,
          stepName: data.stepName, // data[0].stepName이 아니라 data.stepName
          stepCount: data.stepCount,
          contents: data.contents.map((content) => ({
            stepNum: content.stepNum,
            contentName: content.contentName,
            contents: content.contents
              ? content.contents.map((c) => ({
                  type: c.type,
                  content: c.content,
                }))
              : [], // contents가 null일 경우 빈 배열로 대체
          })),
        }));
        setLectureSummary(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  const getTable = (type, id) => {
    setShowWordProcessor(false);
    setMyDataTable(true);

    setDataType(type);
    setDataId(id);
  };

  const getLectureDataTable = (stepName, stepCount, contents) => {
    setShowWordProcessor(false);
    setMyDataTable(false);

    setStepName(stepName);
    setStepCountLoad(stepCount);
    setStepContents(contents);
  };

  const handleCreateLecture = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalConfirm = () => {
    setOpenModal(false);
    setShowWordProcessor(true);
  };

  const handleDeleteLecture = async (index, stepName) => {
    try {
      await customAxios.delete(`/api/steps/deleteLectureContent/${stepName}`);
      const updatedLectures = [...lectureSummary];
      updatedLectures.splice(index, 1);
      setLectureSummary(updatedLectures);
      alert("수업 자료가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting lecture:", error);
      alert("수업 자료 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="myData-container">
      <div className="myData-left">
        <div className="myData-folder">
          <button
            style={{
              border: "none",
              fontWeight: "600",
              borderRadius: "0.625rem",
              margin: "10px",
              backgroundColor: "white",
            }}
            onClick={() =>
              console.log("여기에 My Data 메인으로 가는 부분 넣기")
            }
          >
            My Data
          </button>
        </div>

        <div className="myData-summary">
          <div style={{ overflow: "auto", height: "20rem" }}>
            <div className="yellow-btn" style={{ width: "100%" }}>
              My Data
            </div>
            <>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th key="saveDate">저장 일시</th>
                    <th key="dataLabel">데이터 종류</th>
                    <th key="memo">메모</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => getTable(item.dataLabel, item.dataUUID)}
                    >
                      <td>{item.saveDate}</td>
                      <td>{item.dataLabel}</td>
                      <td>{item.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          </div>

          <div style={{ overflow: "auto", height: "20rem" }}>
            <div className="yellow-btn" style={{ width: "100%" }}>
              수업 자료
            </div>
            <>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th key="index">순번</th>
                    <th key="stepName">수업 이름</th>
                    <th key="delete">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {lectureSummary.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        getLectureDataTable(
                          item.stepName,
                          item.stepCount,
                          item.contents
                        )
                      }
                      s
                    >
                      <td>{index}</td>
                      <td>{item.stepName}</td>
                      <td>
                        <IconButton
                          onClick={() =>
                            handleDeleteLecture(index, item.stepName)
                          }
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
            </>
          </div>
        </div>
      </div>

      <div className="myData-right">
        {showWordProcessor ? (
          <CreateLectureSourcePage
            summary={summary}
            lectureName={lectureName}
            stepCount={stepCount}
            eClassType={eClassType}
          />
        ) : (
          <>
            {myDataTable && dataType && dataId && (
              <DataTable type={dataType} id={dataId} />
            )}
            {!myDataTable && stepName && (
              <>
                {console.log(
                  "컨텐츠 내용 " + JSON.stringify(stepContents, null, 2)
                )}
                <CreateLectureSourcePage
                  summary={summary}
                  lectureName={stepName}
                  stepCount={stepCountLoad}
                  stepContents={stepContents}
                  eClassType={eClassType}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* 수업 자료 만들기 모달 */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            label="수업 자료 이름"
            value={lectureName}
            onChange={(e) => setLectureName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Step 개수"
            type="number"
            value={stepCount}
            onChange={(e) => setStepCount(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="eclass-select-label">E-Class 종류</InputLabel>
            <Select
              labelId="eclass-select-label"
              value={eClassType}
              onChange={(e) => setEClassType(e.target.value)}
            >
              <MenuItem value="type1">E-Class 타입 1</MenuItem>
              <MenuItem value="type2">E-Class 타입 2</MenuItem>
              <MenuItem value="type3">E-Class 타입 3</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalConfirm}
            >
              확인
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalClose}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default MyData;
