import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { customAxios } from "../../../../Common/CustomAxios";
import { v4 as uuidv4 } from "uuid";

function StudentReportModal({
  open,
  onClose,
  tableData,
  latestTableData,
  assginmentCheck,
  eclassUuid,
}) {
  const [textBoxValues, setTextBoxValues] = useState({});
  const [data, setData] = useState([]);
  const [studentId, setStudentId] = useState();

  useEffect(() => {
    const fetchStudentId = async () => {
      const username = localStorage.getItem("username");
      try {
        const response = await customAxios.get(
          `/api/student/getStudentId?username=${username}&uuid=${eclassUuid}`
        );
        setStudentId(response.data);
        console.log("과제 포함되어 있는 테이블의 학생Id : " + response.data);
      } catch (error) {
        console.error("Error fetching student ID:", error);
      }
    };
    fetchStudentId();
  }, [eclassUuid]);

  useEffect(() => {
    const allContents = latestTableData
      ? latestTableData.flatMap((data) => data.contents)
      : tableData.flatMap((data) => data.contents);

    setData(allContents);
  }, [latestTableData, tableData]);

  const handleTextBoxSubmit = (stepNum, index, text) => {
    setTextBoxValues((prev) => ({
      ...prev,
      [stepNum]: {
        ...(prev[stepNum] || []),
        [index]: text,
      },
    }));
  };

  const handleSubmit = async () => {
    console.log(
      "textBoxValues 확인 : " + JSON.stringify(textBoxValues, null, 2)
    );

    const studentName = localStorage.getItem("username");
    const dataToUse = latestTableData || tableData;
    const reportUuid = uuidv4();

    const updatedData = dataToUse.map((data) => ({
      uuid: reportUuid,
      timestamp: new Date().toISOString(),
      username: studentName,
      stepName: data.stepName,
      stepCount: data.stepCount,
      contents: data.contents.map((item, index) => ({
        contentName: item.contentName,
        stepNum: item.stepNum,
        contents: item.contents.map((contentItem, contentIndex) => {
          if (contentItem.type === "textBox") {
            return {
              ...contentItem,
              content:
                textBoxValues[item.stepNum]?.[contentIndex] ||
                contentItem.content,
            };
          }
          return contentItem;
        }),
      })),
    }));

    console.log("Final Submit:", JSON.stringify(updatedData, null, 2));
    console.log("과제테이블 : " + assginmentCheck);
    console.log("과제 uuid : " + dataToUse[0].uuid);

    if (window.confirm("제출하시겠습니까?")) {
      try {
        const requestData = {
          reportUuid: reportUuid,
          studentId: studentId,
        };

        // 보고서 제출 테이블에 저장
        await customAxios.post(
          "/api/eclass/student/assignment/report/save",
          requestData
        );
        alert("제출 완료했습니다!");

        // 원본 테이블에도 저장
        if (assginmentCheck) {
          await customAxios.put("/api/report/update", updatedData);
          console.log("수정 완료");
        } else {
          await customAxios.post("/api/report/save", updatedData);
          console.log("새로 저장 완료");
        }

        window.location.reload();
      } catch (error) {
        console.error("오류가 발생했습니다: ", error);
        alert("제출에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>보고서</DialogTitle>
      <DialogContent
        dividers
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Paper
          style={{
            width: "100%",
            padding: "20px",
            backgroundColor: "white",
          }}
        >
          <Typography variant="h3" sx={{ marginBottom: "20px" }}>
            {tableData[0]?.stepName}
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginBottom: "40px", textAlign: "right" }}
          >
            {tableData[0]?.username}
          </Typography>
          <Grid container spacing={3}>
            {data.map((stepData, idx) => (
              <Grid item xs={6} key={stepData.stepNum}>
                <Paper
                  style={{
                    padding: "20px",
                    boxShadow: "none",
                    marginBottom: "30px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div>
                    {stepData.contents.map((content, idx) => (
                      <RenderContent
                        key={`${stepData.stepNum}-${idx}`} // 고유한 키 추가
                        content={content}
                        textBoxValue={
                          textBoxValues[stepData.stepNum]?.[idx] || ""
                        }
                        setTextBoxValue={(id, text) =>
                          handleTextBoxSubmit(stepData.stepNum, id, text)
                        }
                        index={idx}
                      />
                    ))}
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          sx={{
            marginRight: 1,
            fontFamily: "'Asap', sans-serif",
            fontWeight: "600",
            fontSize: "0.9rem",
            color: "grey",
            backgroundColor: "#feecfe",
            borderRadius: "2.469rem",
            border: "none",
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{
            marginRight: 1,
            fontFamily: "'Asap', sans-serif",
            fontWeight: "600",
            fontSize: "0.9rem",
            color: "grey",
            backgroundColor: "#feecfe",
            borderRadius: "2.469rem",
            border: "none",
          }}
        >
          제출
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function RenderContent({ content, textBoxValue, setTextBoxValue, index }) {
  const handleTextChange = (event) => {
    setTextBoxValue(index, event.target.value);
  };

  switch (content.type) {
    case "title":
      return (
        <Typography variant="h6" gutterBottom>
          {content.content}
        </Typography>
      );
    case "html":
      return (
        <div
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      );
    case "textBox":
      return (
        <TextField
          value={textBoxValue || content.content}
          onChange={handleTextChange}
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          maxRows={5}
          sx={{ marginBottom: "20px" }}
          InputProps={{
            readOnly: true,
          }}
        />
      );
    case "img":
      return (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={content.content}
            alt="Assignment Content"
            style={{ width: content.x / 2, height: content.y / 2 }}
          />
        </div>
      );
    case "data":
      return <div>{renderElement(content.content)}</div>;
    case "emptyBox":
      return (
        <div
          style={{
            border: "1px dashed #ddd",
            padding: "10px",
            textAlign: "center",
            margin: "10px 0",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Empty Box
          </Typography>
        </div>
      );
    default:
      return null;
  }
}

function renderElement(node) {
  if (typeof node !== "object" || node === null) {
    return node;
  }

  const { type, props, key } = node;
  const children = props?.children || null;

  return React.createElement(
    type,
    { ...props, key },
    Array.isArray(children)
      ? children.map(renderElement)
      : renderElement(children)
  );
}

export default StudentReportModal;
