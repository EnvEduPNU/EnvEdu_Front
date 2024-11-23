import {
  Divider,
  Paper,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import './customContainer.css';

function CreateClassPage() {
  const [steps, setSteps] = useState([]);
  const [contents, setContents] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [quillData, setQuillData] = useState(null);

  const addStep = () => {
    if (steps.length === 6) {
      alert('최대 스텝 개수는 6개입니다.');
      return;
    }
    setSteps([...steps, '']);
  };
  const deleteCurStep = (filteredIndex) => {
    console.log(filteredIndex);
    setSteps([...steps].filter((value, index) => index !== filteredIndex));
  };

  console.log(quillData);
  console.log(contents);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          padding: '16px',
          margin: '0 0 20px 0',
          border: '1px solid #d1d5db', // Tailwind의 border-gray-300
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 강조를 위한 그림자
          backgroundColor: '#ffffff', // 배경색 (흰색)
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white', // Tailwind의 bg-gray-100
            marginRight: '115px',
          }}
        >
          <h1
            style={{
              width: '110px',
              fontSize: '1.5rem', // Tailwind의 text-2xl
              fontWeight: '600', // Tailwind의 font-semibold
              color: '#1f2937', // Tailwind의 text-gray-800
            }}
          >
            수업 제목
          </h1>
          <input
            type="text"
            placeholder="수업 제목을 입력하세요"
            style={{
              width: '800px',
              lineHeight: '36px',
              padding: '8px 16px',
              fontSize: '1rem',
              color: '#374151', // Tailwind의 text-gray-700
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db', // Tailwind의 border-gray-300
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', // Tailwind의 shadow-sm
              outline: 'none',
              transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 2px #3b82f6'; // Tailwind의 focus:ring-2 focus:ring-blue-500
              e.target.style.borderColor = '#3b82f6'; // Tailwind의 focus:border-blue-500
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.borderColor = '#d1d5db';
            }}
          />
        </div>
        <hr
          style={{
            width: '100%',
            borderTop: '1.8px solid #d1d5db', // Tailwind의 border-gray-300
            margin: '20px 0px 0px 0px', // 간격 추가
          }}
        />

        <div style={{ display: 'flex' }}>
          <Stepper
            activeStep={activeStepIndex}
            style={{ width: '920px', overflow: 'auto' }}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel
                  sx={{
                    transition: 'color 0.3s, transform 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      cursor: 'pointer',
                      color: '#3b82f6', // Tailwind의 focus:ring-blue-500 색상
                      transform: 'scale(1.1)',
                    },
                  }}
                  onClick={() => {
                    setActiveStepIndex(index);
                  }}
                >
                  <input
                    style={{
                      width: '100px',
                      lineHeight: '20px',
                      padding: '2px 6px',
                      fontSize: '12px',
                      color: '#374151', // Tailwind의 text-gray-700
                      backgroundColor: '#ffffff', // Tailwind의 bg-white
                      border: '1px solid #d1d5db', // Tailwind의 border-gray-300
                      borderRadius: '6px', // 둥근 모서리
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', // Tailwind의 shadow-sm
                      outline: 'none',
                      transition: 'box-shadow 0.2s, border-color 0.2s',
                    }}
                    type="text"
                    value={label}
                    placeholder="스텝 이름 입력"
                    onChange={(e) => {
                      setSteps((prev) => {
                        const tempSteps = [...prev];
                        tempSteps[index] = e.target.value;
                        return tempSteps;
                      });
                    }}
                  />
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <div style={{ textAlign: 'center', padding: '16px' }}>
            <button
              style={{
                display: 'inline-block',
                marginRight: '2px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#fff',
                backgroundColor: '#4caf50',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#388e3c')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4caf50')}
              onClick={() => {
                addStep();
              }}
            >
              스텝 추가
            </button>
            <button
              style={{
                display: 'inline-block',
                marginLeft: '2px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#fff',
                backgroundColor: '#f44336',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#d32f2f')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#f44336')}
              onClick={() => {
                deleteCurStep(activeStepIndex);
              }}
            >
              현재 스텝 삭제
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
        }}
      >
        {/* 왼쪽에 과제 만드는 미리보기란에 랜더링 되는 곳 */}
        <div
          style={{
            width: '750px',
            height: '500px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            margin: '0 20px 80px 0px',
          }}
          className="custom-html-container ql-editor"
        >
          {/* {localContents.map((item, index) => (
            <DraggableItem
              key={index}
              index={index}
              item={item}
              moveItem={moveItem}
              handleDeleteContent={handleDeleteContent}
              handleTextBoxChange={handleTextBoxChange}
            />
          ))} */}
          {contents.map((item, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          {/* 오른쪽 WordProcessor 편집창 */}
          <ReactQuill
            //   ref={quillRef}
            style={{ width: '420px', height: '200px', margin: '0 0 60px' }}
            //   modules={modules}
            //   formats={formats}
            value={quillData}
            onChange={setQuillData}
            placeholder="내용을 입력하세요..."
          />
          <div>
            <div
              style={{
                marginBottom: '10px',
              }}
            >
              <button
                style={{
                  width: '170px',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50', // 새로운 색상 (초록)
                  color: '#FFFFFF',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  outline: 'none',
                  marginRight: '10px',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#66BB6A'; // 마우스 오버 시 밝은 초록색
                  e.target.style.transform = 'scale(1.05)'; // 확대 효과
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4CAF50'; // 기본 초록색
                  e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                }}
                onClick={() => {
                  setContents((prev) => [...prev, quillData]);
                  setQuillData(null);
                }}
              >
                글상자 포함
              </button>
              <button
                style={{
                  width: '170px',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50', // 새로운 색상 (초록)
                  color: '#FFFFFF',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  outline: 'none',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#66BB6A'; // 마우스 오버 시 밝은 초록색
                  e.target.style.transform = 'scale(1.05)'; // 확대 효과
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4CAF50'; // 기본 초록색
                  e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                }}
                onClick={() => {
                  setContents((prev) => [
                    ...prev,
                    `<textarea
                      style="width: 100%; height: 150px; padding: 10px; fontSize: 16px; lineHeight: 1.5; color: #374151; border: 1px solid #D1D5DB; borderRadius: 8px;  boxShadow: 0px 4px 10px rgba(0, 0, 0, 0.1); outline: none; resize: vertical; backgroundColor: #F9FAFB";
                      placeholder="학생이 여기에 답변을 입력합니다"
                      disabled/>`,
                  ]);
                }}
              >
                답변 박스 추가
              </button>
            </div>
            <div>
              <button
                style={{
                  width: '170px',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50', // 새로운 색상 (초록)
                  color: '#FFFFFF',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  outline: 'none',
                  marginRight: '10px',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#66BB6A'; // 마우스 오버 시 밝은 초록색
                  e.target.style.transform = 'scale(1.05)'; // 확대 효과
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4CAF50'; // 기본 초록색
                  e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                }}
              >
                테이블 추가
              </button>
              <button
                style={{
                  width: '170px',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50', // 새로운 색상 (초록)
                  color: '#FFFFFF',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  outline: 'none',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#66BB6A'; // 마우스 오버 시 밝은 초록색
                  e.target.style.transform = 'scale(1.05)'; // 확대 효과
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#4CAF50'; // 기본 초록색
                  e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                }}
              >
                그래프 그리기 추가
              </button>
            </div>
          </div>
          <button
            style={{
              width: '170px',
              padding: '0.5rem 1rem',
              backgroundColor: '#6A1B9A', // 기본 색상 (보라색)
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              outline: 'none',
              marginLeft: '250px',
              marginTop: '100px',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#AB47BC'; // 마우스 오버 시 밝은 보라색
              e.target.style.transform = 'scale(1.05)'; // 확대 효과
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#6A1B9A'; // 기본 보라색
              e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
            }}
          >
            수업 생성
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateClassPage;
