import React, { useState } from "react";
import { Paper, Typography, Button, TextField } from "@mui/material";
import { customAxios } from "../../../../Common/CustomAxios";

function StudentRenderAssign({ data }) {
  const [textBoxValues, setTextBoxValues] = useState([]); // 배열로 초기화

  const handleTextBoxSubmit = (index, text) => {
    setTextBoxValues((prev) => {
      // prev가 배열인지 확인하고 아니면 빈 배열로 초기화
      const newValues = Array.isArray(prev) ? [...prev] : [];
      newValues[index] = text; // 해당 인덱스에 값 설정
      return newValues;
    });
  };

  const handleSubmit = () => {
    console.log("데이터 구조 일단 확인 : " + JSON.stringify(data, null, 2));
    console.log(
      "textBoxValues 확인 : " + JSON.stringify(textBoxValues, null, 2)
    );

    const studentName = localStorage.getItem("username");

    const updatedDataArray = data.map((stepData) => {
      return {
        uuid: stepData.uuid,
        timestamp: new Date().toISOString(), // 현재 시간으로 업데이트
        username: studentName,
        stepName: stepData.stepName,
        stepCount: stepData.stepCount,
        contents: stepData.contents.map((item) => {
          return {
            contentName: item.contentName,
            stepNum: item.stepNum,
            contents: item.contents.map((contentItem, index) => {
              if (contentItem.type === "textBox") {
                const updatedContent = {
                  ...contentItem,
                  content: textBoxValues[index] || "",
                };
                return updatedContent;
              }
              return contentItem;
            }),
          };
        }),
      };
    });

    const FormattedUpdateData = updatedDataArray[0];

    setTextBoxValues({});

    console.log("Final Submit:", JSON.stringify(FormattedUpdateData, null, 2));
    customAxios.post("/api/assignment/save", FormattedUpdateData);
  };

  return (
    <div>
      {data.map((stepData, stepIndex) => (
        <>
          <Paper
            key={stepData.uuid}
            style={{
              padding: 20,
              margin: "20px 0",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              width: "100%",
              minHeight: "61vh",
            }}
          >
            {stepData.contents.map((contentItem, contentIndex) => (
              <div key={`${stepIndex}-${contentIndex}`}>
                {contentItem.contents.map((content, idx) => (
                  <RenderContent
                    key={idx}
                    content={content}
                    textBoxValue={textBoxValues[`${idx}`] || ""}
                    setTextBoxValue={(id, text) =>
                      handleTextBoxSubmit(id, text)
                    }
                    index={`${idx}`}
                  />
                ))}
              </div>
            ))}
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
