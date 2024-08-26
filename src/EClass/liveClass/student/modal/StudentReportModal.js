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

  // 보고서 저장 할때 필요한 해당 클래스 학생 Id 가져오기
  useEffect(() => {
    const username = localStorage.getItem("username");
    const fetchStudentId = async () => {
      try {
        const response = await customAxios.get(
          `/api/student/getStudentId?username=${username}&uuid=${eclassUuid}`
        );
        const studentId = response.data; // studentId를 response에서 추출
        console.log("과제 포함되어 있는 테이블의 학생Id : " + studentId);
        setStudentId(studentId);
      } catch (error) {
        console.error("Error fetching student ID:", error);
      }
    };
    fetchStudentId();
  }, []);

  useEffect(() => {
    let allContents = latestTableData
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

  const handleSubmit = () => {
    console.log(
      "textBoxValues 확인 : " + JSON.stringify(textBoxValues, null, 2)
    );

    const studentName = localStorage.getItem("username");
    const dataToUse = latestTableData || tableData;

    const updatedData = dataToUse.map((data) => ({
      uuid: data.uuid,
      timestamp: new Date().toISOString(),
      username: studentName,
      stepName: data.stepName,
      stepCount: data.stepCount,
      contents: data.contents.map((item) => ({
        contentName: item.contentName,
        stepNum: item.stepNum,
        contents: item.contents.map((contentItem, index) => {
          if (contentItem.type === "textBox") {
            return {
              ...contentItem,
              content:
                textBoxValues[item.stepNum]?.[index] || contentItem.content,
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
      // 보고서 제출 테이블에 저장
      const requestData = {
        reportUuid: dataToUse[0].uuid,
        studentId: studentId,
      };
      customAxios
        .post("/api/eclass/student/assignment/report/save", requestData)
        .then(() => {
          alert("제출 완료했습니다!");
        })
        .catch((error) => {
          console.error("오류가 발생했습니다: ", error);
          alert("제출에 실패했습니다. 다시 시도해 주세요.");
        });

      // 원본 테이블에도 저장해줌
      const request = assginmentCheck
        ? customAxios.put("/api/report/update", updatedData)
        : customAxios.post("/api/report/save", updatedData);

      request.then(
        console.log(assginmentCheck ? "수정 완료" : "새로 저장 완료")
      );

      // window.location.reload();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>보고서</DialogTitle>
      <DialogContent dividers>
        <Paper
          style={{
            width: "100%",
            height: "100vh", // 전체 화면 높이
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h3" sx={{ margin: "20px" }}>
            {tableData[0]?.stepName}
          </Typography>
          <Typography variant="h6" sx={{ margin: "20px", textAlign: "right" }}>
            {tableData[0]?.username}
          </Typography>
          <Grid
            container
            spacing={2}
            style={{
              height: "calc(100vh - 200px)", // 상위 Paper보다 작은 높이 설정
              overflow: "auto", // 스크롤 가능하도록 설정
            }}
          >
            {data.map((stepData, idx) => (
              <Grid item xs={6} key={stepData.stepNum}>
                <Paper
                  style={{
                    padding: 10,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    minHeight: "100px", // 최소 높이 설정
                    marginBottom: "10px",
                    overflow: "hidden", // 내용이 넘치지 않도록 설정
                  }}
                >
                  <div>
                    {stepData.contents.map((content, idx) => (
                      <RenderContent
                        key={content.stepNum}
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
        <Button onClick={onClose} color="secondary">
          취소
        </Button>
        <Button onClick={handleSubmit} color="primary">
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
          value={textBoxValue || content.content} // 기존 내용을 기본값으로 사용
          onChange={handleTextChange}
          variant="outlined"
          fullWidth
          multiline
          minRows={3} // Adjusted to fit within smaller cards
          maxRows={5}
        />
      );
    case "img":
      return (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={content.content}
            alt="Assignment Content"
            style={{ width: content.x / 2, height: content.y / 2 }} // Scale down for smaller cards
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
