import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, TextField } from "@mui/material";
import { customAxios } from "../../../../Common/CustomAxios";

function StudentRenderAssign({
  tableData,
  latestTableData,
  assginmentCheck,
  stepCount,
}) {
  const [textBoxValues, setTextBoxValues] = useState({}); // 객체로 초기화
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("stepCount : " + JSON.stringify(stepCount, null, 2));

    const parseStepCount = parseInt(stepCount);

    let filteredContents = latestTableData
      ? latestTableData
          .flatMap((data) => data.contents)
          .filter((content) => content.stepNum === parseStepCount)
      : tableData
          .flatMap((data) => data.contents)
          .filter((content) => content.stepNum === parseStepCount);

    setData(filteredContents);
  }, [stepCount, latestTableData, tableData]);

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

    console.log("테이블데이터 : " + JSON.stringify(tableData, null, 2));
    console.log(
      "레이티스트데이터 : " + JSON.stringify(latestTableData, null, 2)
    );

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
    window.confirm("제출하시겠습니까?");

    const request = assginmentCheck
      ? customAxios.put("/api/assignment/update", updatedData)
      : customAxios.post("/api/assignment/save", updatedData);

    request.then(console.log(assginmentCheck ? "수정 완료" : "새로 저장 완료"));

    window.location.reload();
  };

  return (
    <div>
      {data.map((stepData) => (
        <React.Fragment key={stepData.stepNum}>
          <Paper
            style={{
              padding: 20,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              width: "100%",
              minHeight: "61vh",
            }}
          >
            <div>
              {stepData.contents.map((content, idx) => (
                <RenderContent
                  key={content.stepNum}
                  content={content}
                  textBoxValue={textBoxValues[stepData.stepNum]?.[idx] || ""}
                  setTextBoxValue={(id, text) =>
                    handleTextBoxSubmit(stepData.stepNum, id, text)
                  }
                  index={idx}
                />
              ))}
            </div>
          </Paper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: "10px" }}
          >
            제출
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
}

function RenderContent({ content, textBoxValue, setTextBoxValue, index }) {
  const handleTextChange = (event) => {
    setTextBoxValue(index, event.target.value);
  };

  switch (content.type) {
    case "title":
      return (
        <Typography variant="h4" gutterBottom>
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
          defaultValue={content.content}
          onChange={handleTextChange}
          variant="outlined"
          fullWidth
          multiline
          minRows={5}
          maxRows={10}
        />
      );
    case "img":
      return (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={content.content}
            alt="Assignment Content"
            style={{ width: content.x, height: content.y }}
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
            padding: "20px",
            textAlign: "center",
            margin: "20px 0",
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

export default StudentRenderAssign;
