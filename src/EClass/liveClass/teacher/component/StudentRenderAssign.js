import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, TextField } from "@mui/material";
import { customAxios } from "../../../../Common/CustomAxios";

function StudentRenderAssign({ tableData, assginmentCheck, stepCount }) {
  const [textBoxValues, setTextBoxValues] = useState([]); // 배열로 초기화
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(
      "StudentRenderAssign 넘어온 tableData  : " +
        JSON.stringify(tableData, null, 2)
    );

    // 주의. stepCount는 String
    const parseStepCount = parseInt(stepCount);

    // 해당 데이터 내에서 stepNum이 stepCount와 일치하는 contents 필터링
    const filteredContents = tableData
      .flatMap((data) => data.contents)
      .filter((content) => content.stepNum === parseStepCount);

    console.log(
      "필터링 된 데이터 구조 : " + JSON.stringify(filteredContents, null, 2)
    );

    setData(filteredContents);
  }, [stepCount]);

  const handleTextBoxSubmit = (index, text) => {
    setTextBoxValues((prev) => {
      // prev가 배열인지 확인하고 아니면 빈 배열로 초기화
      const newValues = Array.isArray(prev) ? [...prev] : [];
      newValues[index] = text; // 해당 인덱스에 값 설정
      return newValues;
    });
  };

  const handleSubmit = () => {
    console.log(
      "textBoxValues 확인 : " + JSON.stringify(textBoxValues, null, 2)
    );

    const studentName = localStorage.getItem("username");

    const updatedData = tableData.map((data) => ({
      uuid: data.uuid,
      timestamp: new Date().toISOString(), // assignmentCheck에 따른 timestamp 설정
      username: studentName,
      stepName: data.stepName,
      stepCount: data.stepCount,
      contents: data.contents.map((item) => {
        return {
          contentName: item.contentName,
          stepNum: item.stepNum,
          contents: item.contents.map((contentItem, index) => {
            if (contentItem.type === "textBox") {
              const updatedContent = {
                ...contentItem,
                content: textBoxValues[index] || contentItem.content,
              };
              return updatedContent;
            }
            return contentItem;
          }),
        };
      }),
    }));

    setTextBoxValues({});

    console.log("Final Submit:", JSON.stringify(updatedData, null, 2));
    console.log("과제테이블 : " + assginmentCheck);

    // 만약 이미 생성 되어있는 과제 테이블이 있다면 수정 요청으로 보냄
    if (assginmentCheck === true) {
      customAxios
        .put("/api/assignment/update", updatedData)
        .then(console.log("수정 완료"));
    } else {
      customAxios
        .post("/api/assignment/save", updatedData)
        .then(console.log("새로 저장 완료"));
    }

    // window.location.reload();
  };

  return (
    <div>
      {data.map((stepData) => (
        <>
          <Paper
            style={{
              padding: 20,
              margin: "20px 0",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              width: "100%",
              minHeight: "61vh",
            }}
          >
            <div>
              {stepData.contents.map((content, idx) => (
                <RenderContent
                  key={idx}
                  content={content}
                  textBoxValue={textBoxValues[`${idx}`] || ""}
                  setTextBoxValue={(id, text) => handleTextBoxSubmit(id, text)}
                  index={`${idx}`}
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
        </>
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
          value={textBoxValue || content.content}
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
