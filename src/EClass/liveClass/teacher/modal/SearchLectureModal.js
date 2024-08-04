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
} from "@mui/material";
import { customAxios } from "../../../../Common/CustomAxios";

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

  useEffect(() => {
    if (open) {
      //eclass의 모든 리스트 가져오기
      customAxios
        .get("/api/eclass/list")
        .then((response) => {
          const list = response.data;
          console.log("Eclass list :", response.data);

          // 필터링된 항목들로 row 데이터 생성
          const rows = list.map((item, index) => createData(index, item));

          setRowData(rows);
        })
        .catch((error) => {
          console.error("Eclass 리스트 조회 에러:", error);
        });
    }
  }, [open]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  // 참여하기 누르면 해당 E-Class uuid 배열에 추가해주는 요청보내기
  const handleJoinClick = () => {
    if (selectedRow) {
      console.log("Selected Row:", selectedRow);

      const username = localStorage.getItem("username");

      customAxios
        .get(`/api/eclass/student/addEclassUuid`, {
          params: {
            studentName: username,
            eclassUuid: selectedRow.eClassUuid,
          },
        })
        .then((response) => {
          console.log("결과는 : " + JSON.stringify(response.data, null, 2));
          window.location.reload();
        })
        .catch((error) => {
          console.error("Eclass 참여하기 에러:", error);
        });
    }
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
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="lecture table">
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>수업 자료</TableCell>
                <TableCell>수업 이름</TableCell>
                <TableCell>교사</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>생성일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowData.map((row) => (
                <TableRow
                  key={row.eClassUuid}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: "pointer",
                    bgcolor:
                      selectedRow?.eClassUuid === row.eClassUuid
                        ? "lightgrey"
                        : "inherit",
                  }}
                >
                  <TableCell>{row.Num}</TableCell>
                  <TableCell>{row.LectureDataName}</TableCell>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.Teacher}</TableCell>
                  <TableCell>{row.Status}</TableCell>
                  <TableCell>{row.CreateEclassDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleJoinClick}
          disabled={!selectedRow}
          sx={{ mt: 2 }}
        >
          참여하기
        </Button>
      </Box>
    </Modal>
  );
};

export default SearchLectureModal;
