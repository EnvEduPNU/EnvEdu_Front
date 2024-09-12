import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const LectureList = ({
  lectureSummary,
  getLectureDataTable,
  handleDeleteLecture,
  handleCreateLecture,
  handleMainPageClick, // 메인 페이지로 돌아가기 위한 함수
}) => {
  const maxRows = 9; // 기준 9개

  // 빈 row를 채우기 위해 9개보다 적으면 빈 배열을 추가
  const emptyRows = maxRows - lectureSummary.length;

  return (
    <div className="myData-container">
      <div className="myData-left">
        <div className="myData-summary">
          <div className="yellow-btn" onClick={handleMainPageClick}>
            수업 자료
          </div>
          <table className="summary-table">
            <thead>
              <tr>
                <th key="index">날짜</th>
                <th key="stepName">수업 이름</th>
                <th key="delete">삭제</th>
              </tr>
            </thead>
            <tbody>
              {/* 실제 데이터 row */}
              {lectureSummary
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, maxRows) // 최대 9개만 표시
                .map((item, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      getLectureDataTable(
                        item.stepName,
                        item.stepCount,
                        item.contents,
                        item.uuid,
                        item.timestamp
                      )
                    }
                  >
                    <td>{item.timestamp.split("T")[0]}</td>
                    <td>{item.stepName}</td>
                    <td>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the row's onClick
                          handleDeleteLecture(index, item.uuid, item.timestamp);
                        }}
                        aria-label="delete"
                        color="secondary"
                        sx={{ width: "30px" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}

              {/* 빈 row 추가 */}
              {emptyRows > 0 &&
                Array(emptyRows)
                  .fill(null)
                  .map((_, index) => (
                    <tr key={`empty-${index}`}>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <button
            style={{
              border: "none",
              fontWeight: "600",
              borderRadius: "0.625rem",
              width: "100%",
              margin: "20px 0 0 0",
              padding: "10px",
            }}
            onClick={handleCreateLecture}
          >
            수업 자료 만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureList;
