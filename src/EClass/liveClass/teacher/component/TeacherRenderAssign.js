import React, { useState } from "react";
import { Paper, TextField, Typography, Button } from "@mui/material";

// RenderContent 컴포넌트는 다양한 콘텐츠 타입을 처리합니다.
function RenderContent({ content, onSubmitTextBox }) {
  const [textBoxValue, setTextBoxValue] = useState(content.content);

  const handleTextChange = (event) => {
    setTextBoxValue(event.target.value);
  };

  const handleSubmit = () => {
    onSubmitTextBox(textBoxValue);
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
        <div>
          <TextField
            value={textBoxValue}
            onChange={handleTextChange}
            variant="outlined"
            fullWidth
            multiline
            minRows={5}
            maxRows={10}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: "10px" }}
          >
            제출
          </Button>
        </div>
      );
    case "img":
      return (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={content.content}
            alt="Assignment Content"
            style={{ maxWidth: "100%" }}
          />
        </div>
      );
    case "data":
      return (
        <div
          style={{
            width: "auto",
            overflowX: "auto",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              transform: "scale(1)",
              transformOrigin: "top left",
            }}
          >
            {content.content}
          </div>
        </div>
      );
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

// TeacherRenderAssign 컴포넌트는 데이터 배열을 받아 각 항목을 Paper에 렌더링합니다.
function TeacherRenderAssign({ data }) {
  const handleTextBoxSubmit = (text) => {
    console.log("TextBox Submitted:", text);
  };

  return (
    <div>
      {data.map((item) => (
        <Paper
          key={item.uuid}
          style={{
            padding: 20,
            margin: "20px 0",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {item.stepName}
          </Typography>
          {item.contents.map((contentItem, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              {contentItem.contents.map((content, idx) => (
                <RenderContent
                  key={idx}
                  content={content}
                  onSubmitTextBox={handleTextBoxSubmit}
                />
              ))}
            </div>
          ))}
        </Paper>
      ))}
    </div>
  );
}

export default TeacherRenderAssign;
