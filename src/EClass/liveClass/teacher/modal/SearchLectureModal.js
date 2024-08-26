import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { customAxios } from "../../../../Common/CustomAxios";
import moment from "moment";

const createData = (index, item) => ({
  Num: index + 1,
  eClassUuid: item.eClassUuid,
  Status: item.eclassAssginSubmitNum,
  LectureData: item.lectureDataUuid,
  LectureDataName: item.lectureDataName,
  Name: item.lectureName,
  CreateEclassDate: item.startDate,
  Teacher: item.username,
});

const SearchLectureModal = ({ open, onClose }) => {
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userData, setUserData] = useState();

  useEffect(() => {
    const username = localStorage.getItem("username");

    customAxios
      .get(`/api/student/get/${username}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("조회 에러:", error);
      });
  }, []);

  useEffect(() => {
    if (open) {
      customAxios
        .get("/api/eclass/list")
        .then((response) => {
          const list = response.data;
          console.log("Eclass list :", JSON.stringify(response.data, null, 2));

          const rows = list.map((item, index) => createData(index, item));

          setRowData(rows);
        })
        .catch((error) => {
          console.error("Eclass 리스트 조회 에러:", error);
        });
    }
  }, [open]);

  const handleRowClick = (event, row) => {
    event.stopPropagation(); // 이벤트 전파를 막아 TableContainer의 클릭 이벤트를 방지
    setSelectedRow(row);
  };

  const handleJoinClick = () => {
    if (selectedRow) {
      console.log("클래스 데이터:", JSON.stringify(selectedRow, null, 2));
      console.log("유저 데이터:", JSON.stringify(userData, null, 2));

      const enrollStudent = {
        eclassUuid: [selectedRow.eClassUuid],
        studentId: userData.id,
        studentName: userData.username,
        studentGroup: userData.studentGroup,
        joinDate: moment().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ssZ"), // 현재 서울 시각을 ISO 8601 포맷으로 추가
      };

      console.log(
        "요청보내기전 확인 : " + JSON.stringify(enrollStudent, null, 2)
      );

      // customAxios로 POST 요청 보내기
      customAxios
        .post("/api/eclass/student/enroll", enrollStudent)
        .then((response) => {
          console.log("Student added successfully:", response.data);

          window.location.reload();
        })
        .catch((error) => {
          console.error("Error adding student:", error);
        });
    }
  };

  const handleModalClick = () => {
    setSelectedRow(null); // 빈 곳 클릭 시 선택 해제
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
        onClick={handleModalClick} // Box 클릭 시 선택 해제
      >
        <Typography
          variant="h6"
          sx={{
            margin: "10px 0 10px 0",
            fontWeight: 600,
            fontSize: "3rem",
            letterSpacing: "0.013rem",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          E-Class 찾기
        </Typography>
        <TableContainer
          component={Paper}
          onClick={(e) => e.stopPropagation()} // TableContainer 클릭 시 이벤트 전파를 막아 선택 해제 방지
        >
          <Table sx={{ minWidth: 500 }} aria-label="lecture table">
            <TableHead sx={{ backgroundColor: "lightgray" }}>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>수업 이름</TableCell>
                <TableCell>교사</TableCell>
                <TableCell>수업 자료</TableCell>
                <TableCell>생성일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowData.map((row) => (
                <TableRow
                  key={row.eClassUuid}
                  onClick={(event) => handleRowClick(event, row)}
                  sx={{
                    cursor: "pointer",
                    bgcolor:
                      selectedRow?.eClassUuid === row.eClassUuid
                        ? "#f0f0f0"
                        : "inherit",
                  }}
                >
                  <TableCell>{row.Num}</TableCell>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.Teacher}</TableCell>
                  <TableCell>{row.LectureDataName}</TableCell>
                  <TableCell>{row.CreateEclassDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleJoinClick}
          disabled={!selectedRow}
          sx={{
            mt: 2,
            fontFamily: "'Asap', sans-serif", // 버튼에 Asap 폰트 적용
            fontWeight: "600",
            fontSize: "0.9rem",
            color: "grey",
            backgroundColor: "#feecfe",
            borderRadius: "2.469rem",
            border: "none",
          }}
        >
          참여하기
        </Button>
      </Box>
    </Modal>
  );
};

export default SearchLectureModal;
