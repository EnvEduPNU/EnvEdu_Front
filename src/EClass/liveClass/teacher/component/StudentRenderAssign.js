import React, { useState } from "react";
import { Paper, Typography, Button, TextField } from "@mui/material";

function StudentRenderAssign({ data }) {
  const [textBoxValues, setTextBoxValues] = useState({});

  const handleTextBoxSubmit = (id, text) => {
    setTextBoxValues((prev) => ({ ...prev, [id]: text }));
  };

  const handleSubmit = () => {
    console.log("Final Submit:", textBoxValues);
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
            width: "100%",
            minHeight: "61vh",
          }}
        >
          {item.contents.map((contentItem, index) => (
            <div key={index}>
              {contentItem.contents.map((content, idx) => (
                <RenderContent
                  key={idx}
                  content={content}
                  textBoxValue={textBoxValues[content.id] || ""}
                  setTextBoxValue={(id, text) => handleTextBoxSubmit(id, text)}
                />
              ))}
            </div>
          ))}
        </Paper>
      ))}
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
}

function RenderContent({ content, textBoxValue, setTextBoxValue }) {
  const [localTextBoxValue, setLocalTextBoxValue] = useState(textBoxValue);

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setLocalTextBoxValue(newText);
    setTextBoxValue(content.id, newText);
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
          value={localTextBoxValue}
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
