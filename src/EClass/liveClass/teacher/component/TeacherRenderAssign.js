import React, { useEffect, useState } from 'react';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import usePhotoStore from '../../../../Data/DataInChart/store/photoStore'; // Zustand store import

// TeacherRenderAssign 컴포넌트는 데이터 배열을 받아 각 항목을 Paper에 렌더링합니다.
function TeacherRenderAssign({ data }) {
  const [storedPhotoList, setStoredPhotoList] = useState([]);

  // Zustand store에서 getStorePhotoList 가져오기
  const { getStorePhotoList } = usePhotoStore();

  useEffect(() => {
    console.log('사진 저장소 확인 : ', getStorePhotoList());
    // 현재 저장된 photoList 가져와서 상태 업데이트
    const photoList = getStorePhotoList();
    setStoredPhotoList(photoList);
  }, []);

  const handleTextBoxSubmit = (text) => {
    console.log('TextBox Submitted:', text);
  };

  const navigate = useNavigate();

  // 이 함수는 페이지를 이동시킵니다.
  const handleNavigate = (uuid, username, contentName, stepNum) => {
    // 쿼리 파라미터에 전달할 값 생성
    const id = 'drawGraph';

    // 페이지 이동
    navigate(
      `/data-in-chart?id=${id}&uuid=${uuid}&username=${username}&contentName=${contentName}&stepNum=${stepNum}`,
    );
  };

  useEffect(() => {
    console.log('data 확인 : ' + JSON.stringify(data, null, 2));
  }, [data]);

  return (
    <div style={{ width: '100%' }}>
      {data.map((item) => (
        <Paper
          key={item.uuid}
          style={{
            padding: 30,
            margin: '20px 20px 10px 0',
            minHeight: '70vh',
            maxHeight: '70vh', // 최대 높이를 설정하여 높이를 제한합니다.
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'auto', // 넘칠 경우 스크롤을 생성합니다.
          }}
        >
          {item.contents.map((contentItem, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              {contentItem.contents.map((content, idx) => (
                <RenderContent
                  key={idx}
                  content={content}
                  onSubmitTextBox={handleTextBoxSubmit}
                  onNavigate={handleNavigate} // handleNavigate를 자식 컴포넌트에 전달
                  item={item}
                  contentItem={contentItem}
                  storedPhotoList={storedPhotoList} // 전달된 storedPhotoList
                />
              ))}
            </div>
          ))}
        </Paper>
      ))}
    </div>
  );
}

// RenderContent 컴포넌트는 다양한 콘텐츠 타입을 처리합니다.
function RenderContent({
  content,
  onSubmitTextBox,
  onNavigate,
  item,
  contentItem,
  storedPhotoList,
}) {
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
            style={{ width: '300px', height: '300px', objectFit: 'cover' }} // 크기를 300px로 증가
          />
        </div>
      );
    case 'data':
      return <div>{renderElement(content.content)}</div>;
    case 'dataInChartButton':
      return (
        <>
          <Button
            onClick={() =>
              onNavigate(
                item.uuid,
                item.username,
                contentItem.contentName,
                contentItem.stepNum,
              )
            }
<<<<<<< HEAD
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: '#6200ea', // 버튼 배경색 (보라색)
              color: 'white', // 텍스트 색상
              padding: '10px 20px', // 패딩
              borderRadius: '20px', // 버튼의 모서리를 둥글게
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // 그림자 효과
              fontWeight: 'bold', // 글씨 굵기
              fontSize: '1rem', // 글씨 크기
              transition: 'background-color 0.3s ease', // 배경색 전환 효과
              '&:hover': {
                backgroundColor: '#3700b3', // hover 시 배경색 (어두운 보라색)
              },
            }}
=======
>>>>>>> c44a297 ([update] DataInChart E-Class 통합 초기 개발 완료)
          >
            그래프 그리기
          </Button>

          {/* 버튼 아래에 storedPhotoList 출력 */}
          <div style={{ marginTop: '10px' }}>
            {storedPhotoList.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {storedPhotoList.map((photo, index) => (
                  <li key={index} style={{ marginBottom: '20px' }}>
                    <Typography variant="subtitle1">{photo.title}</Typography>
                    <img
                      src={photo.image}
                      alt={photo.title}
                      style={{
                        width: '300px', // 크기를 300px로 증가
                        height: '300px', // 크기를 300px로 증가
                        objectFit: 'cover',
                      }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
<<<<<<< HEAD
              <Typography></Typography>
=======
              <Typography>No photo list available.</Typography>
>>>>>>> c44a297 ([update] DataInChart E-Class 통합 초기 개발 완료)
            )}
          </div>
        </>
      ); // 버튼 클릭 시 onNavigate 실행 후 storedPhotoList 출력
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
