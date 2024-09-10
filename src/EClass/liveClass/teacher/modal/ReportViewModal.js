import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ReportViewModal({ open, onClose, tableData }) {
  const [data, setData] = useState([]);

  console.log("테이블 데이터 : " + JSON.stringify(tableData, null, 2));

  useEffect(() => {
    if (tableData) {
      setData(tableData[0]?.contents);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>보고서</DialogTitle>
      <DialogContent
        dividers
        style={{
          maxHeight: "80vh", // 최대 높이 설정
          overflowY: "auto", // 내용이 넘치는 경우에만 스크롤 활성화
        }}
      >
        <Paper
          id="report-content" // PDF 생성할 영역의 ID 설정
          style={{
            width: "100%",
            padding: "20px", // Paper에 패딩 추가
            backgroundColor: "white", // 더 밝은 배경색으로 변경
          }}
        >
          <Typography variant="h3" sx={{ marginBottom: "20px" }}>
            {tableData[0]?.stepName}
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginBottom: "40px", textAlign: "right" }}
          >
            {tableData[0]?.username} {/* localStorage의 username을 보여줌 */}
          </Typography>
          <Grid container spacing={3}>
            {data
              .filter((stepData) => stepData !== null && stepData !== undefined) // null 또는 undefined가 아닌 경우만 필터링
              .map((stepData, stepIndex) => {
                const stepKey = stepData.stepNum
                  ? `step-${stepData.stepNum}`
                  : `step-${stepIndex}`;

                return (
                  <Grid item xs={6} key={stepKey}>
                    <Paper>
                      <div>
                        {stepData.contents
                          .filter(
                            (content) =>
                              content !== null && content !== undefined
                          ) // null 또는 undefined가 아닌 경우만 필터링
                          .map((content, contentIndex) => {
                            const contentKey =
                              content.id ||
                              `content-${stepIndex}-${contentIndex}`;

                            return (
                              <React.Fragment key={contentKey}>
                                <RenderContent
                                  content={content}
                                  index={contentIndex}
                                />
                              </React.Fragment>
                            );
                          })}
                      </div>
                    </Paper>
                  </Grid>
                );
              })}
          </Grid>
        </Paper>
        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPdf}
          sx={{ marginTop: "20px" }}
        >
          PDF 다운로드
        </Button> */}
      </DialogContent>
    </Dialog>
  );
}

function RenderContent({ content, setTextBoxValue, index }) {
  const handleTextChange = (event) => {
    setTextBoxValue(index, event.target.value);
  };
  switch (content.type) {
    case "title":
      return (
        <Typography variant="h6" gutterBottom>
          {content.content || "No Title"}{" "}
          {/* content.content가 null일 경우 기본값 제공 */}
        </Typography>
      );
    case "html":
      return (
        <div
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{
            __html: content.content || "<p>No Content</p>",
          }} // 기본 HTML 콘텐츠 제공
        />
      );
    case "textBox":
      return (
        <TextField
          value={content.content || ""} // content.content가 null이면 빈 문자열로 처리
          onChange={handleTextChange}
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          maxRows={5}
          sx={{ marginBottom: "20px" }} // 간격 조정
        />
      );
    case "img":
      return content.content ? ( // content.content가 있을 경우에만 이미지 렌더링
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={content.content}
            alt="Assignment Content"
            style={{ width: content.x / 2, height: content.y / 2 }}
          />
        </div>
      ) : (
        <Typography variant="body2" color="textSecondary" align="center">
          No Image Available
        </Typography>
      );
    case "data":
      if (content.contnet) {
        return <div>{renderElement(content.content)}</div>;
      } else {
        return <div></div>;
      }

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

const handleDownloadPdf = async () => {
  const input = document.getElementById("report-content");

  // html2canvas 옵션 설정
  const canvas = await html2canvas(input, {
    scale: 3, // 캔버스 스케일 조정으로 화질 개선
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210; // A4 폭(mm)
  const pageHeight = 297; // A4 높이(mm)
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("report.pdf");
};

export default ReportViewModal;
