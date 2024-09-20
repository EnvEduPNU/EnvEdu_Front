import React, { useEffect, useState } from 'react';
import { Paper, TextField, Typography } from '@mui/material';

// TeacherRenderAssign 컴포넌트는 데이터 배열을 받아 각 항목을 Paper에 렌더링합니다.
function TeacherRenderAssign({ data }) {
  const handleTextBoxSubmit = (text) => {
    console.log('TextBox Submitted:', text);
  };

  return (
    <div style={{ width: '100%' }}>
      {data.map((item) => (
        <Paper
          key={item.uuid}
          style={{
            padding: 30,
            margin: '20px 20px 10px 0',
            minHeight: '70vh',
            maxHeight: '70vh',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          {item.contents.map((contentItem, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
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

//-----------------------------------------------------------------------------------------------------------------

// RenderContent 컴포넌트는 다양한 콘텐츠 타입을 처리합니다.
function RenderContent({ content, onSubmitTextBox }) {
  switch (content.type) {
    case 'title':
      return (
        <Typography variant="h4" gutterBottom>
          {content.content}
        </Typography>
      );
    case 'html':
      return (
        <div
          style={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      );
    case 'textBox':
      return (
        <div>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            minRows={5}
            maxRows={10}
          />
        </div>
      );
    case 'img':
      return (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={content.content}
            alt="Assignment Content"
            style={{ width: content.x, height: content.y }}
          />
        </div>
      );
    case 'data':
      // 여기서 content.content는 React 엘리먼트 트리로 구성된 객체이므로
      // renderElement를 사용하여 동적으로 렌더링.
      return <div>{renderElement(content.content)}</div>;

    case 'emptyBox':
      return (
        <div
          style={{
            border: '1px dashed #ddd',
            padding: '20px',
            textAlign: 'center',
            margin: '20px 0',
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

// React 엘리먼트를 동적으로 생성하는 함수
function renderElement(node) {
  if (typeof node !== 'object' || node === null) {
    return node;
  }

  const { type, props, key } = node;
  const children = props?.children || null;

  // 고유한 key를 생성하는 방식
  const elementKey =
    key != null ? key : `${type}-${Math.random().toString(36).substr(2, 9)}`;

  return React.createElement(
    type,
    { ...props, key: elementKey },
    Array.isArray(children)
      ? children.map(renderElement)
      : renderElement(children),
  );
}

export default TeacherRenderAssign;
