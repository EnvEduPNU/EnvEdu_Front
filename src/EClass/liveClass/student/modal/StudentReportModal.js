import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { customAxios } from '../../../../Common/CustomAxios';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
      const username = localStorage.getItem('username');
      try {
        const response = await customAxios.get(
          `/api/student/getStudentId?username=${username}&uuid=${eclassUuid}`,
        );
        setStudentId(response.data);
      } catch (error) {
        console.error('Error fetching student ID:', error);
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
    const studentName = localStorage.getItem('username');
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
          if (contentItem.type === 'textBox') {
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

    if (window.confirm('제출하시겠습니까?')) {
      try {
        const requestData = {
          reportUuid: reportUuid,
          studentId: studentId,
        };

        await customAxios.post(
          '/api/eclass/student/assignment/report/save',
          requestData,
        );
        alert('제출 완료했습니다!');

        if (assginmentCheck) {
          await customAxios.put('/api/report/update', updatedData);
        } else {
          await customAxios.post('/api/report/save', updatedData);
        }

        window.location.reload();
      } catch (error) {
        console.error('오류가 발생했습니다: ', error);
        alert('제출에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleSavePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yOffset = 10;

    // 타이틀과 이름을 먼저 캡처 및 추가
    const titleElement = document.getElementById('title-section');
    const titleCanvas = await html2canvas(titleElement, { scale: 2 });
    const titleImgData = titleCanvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (titleCanvas.height * imgWidth) / titleCanvas.width;

    pdf.addImage(titleImgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
    yOffset += imgHeight + 10;

    for (let stepIndex = 0; stepIndex < data.length; stepIndex++) {
      const stepElement = document.getElementById(`step-content-${stepIndex}`);
      const canvas = await html2canvas(stepElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const stepImgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yOffset + stepImgHeight > pdf.internal.pageSize.height) {
        pdf.addPage();
        yOffset = 10;
      }
      pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, stepImgHeight);
      yOffset += stepImgHeight + 10;
    }
    pdf.save('report.pdf');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>보고서</DialogTitle>
      <DialogContent
        dividers
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Paper
          id="report-content"
          style={{
            width: '100%',
            padding: '20px',
            backgroundColor: 'white',
          }}
        >
          <div id="title-section">
            <Typography variant="h3" sx={{ marginBottom: '20px' }}>
              {tableData[0]?.stepName}
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginBottom: '40px', textAlign: 'right' }}
            >
              {tableData[0]?.username}
            </Typography>
          </div>
          <Grid container spacing={3}>
            {data.map((stepData, idx) => (
              <Grid item xs={12} key={stepData.stepNum}>
                <Paper
                  id={`step-content-${idx}`}
                  style={{
                    padding: '20px',
                    boxShadow: 'none',
                    marginBottom: '10px', // 간격을 10px로 설정
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div>
                    {stepData.contents.map((content, contentIdx) => (
                      <RenderContent
                        key={`${stepData.stepNum}-${contentIdx}`}
                        content={content}
                        textBoxValue={
                          textBoxValues[stepData.stepNum]?.[contentIdx] || ''
                        }
                        setTextBoxValue={(id, text) =>
                          handleTextBoxSubmit(stepData.stepNum, id, text)
                        }
                        index={contentIdx}
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
        <Button onClick={handleSavePDF} color="primary">
          PDF 저장
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
    case 'title':
      return (
        <Typography variant="h6" gutterBottom>
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
        <TextField
          value={textBoxValue || content.content}
          onChange={handleTextChange}
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          maxRows={5}
          sx={{ marginBottom: '20px' }}
          InputProps={{
            readOnly: true,
          }}
        />
      );
    case 'img':
      return (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={content.content}
            alt="Assignment Content"
            style={{ width: '100%' }}
          />
        </div>
      );
    case 'video':
      return (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <iframe
            width="100%"
            height="300"
            src={content.content}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    case 'data':
      return <div>{renderElement(content.content)}</div>;
    case 'emptyBox':
      return (
        <div
          style={{
            border: '1px dashed #ddd',
            padding: '10px',
            textAlign: 'center',
            margin: '10px 0',
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
  if (typeof node !== 'object' || node === null) {
    return node;
  }

  const { type, props, key } = node;
  const children = props?.children || null;

  return React.createElement(
    type,
    { ...props, key },
    Array.isArray(children)
      ? children.map(renderElement)
      : renderElement(children),
  );
}

export default StudentReportModal;
