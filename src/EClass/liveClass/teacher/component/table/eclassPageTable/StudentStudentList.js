import React, { useState, useEffect } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { customAxios } from "../../../../../../Common/CustomAxios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Modal,
  Box,
} from "@mui/material";
import moment from "moment"; // 날짜 처리 라이브러리

const columns = [
  {
    label: "번호",
    dataKey: "Num",
    width: "15%",
  },
  {
    label: "이름",
    dataKey: "Name",
    width: "20%",
  },
  {
    label: "소속",
    dataKey: "LectureData",
    width: "20%",
  },
  {
    label: "참여일",
    dataKey: "Status",
    width: "20%",
  },
  {
    label: "",
    dataKey: "Action",
    width: "20%",
  },
];

function createData(index, [Num, Name, LectureData, Status]) {
  return { id: index, Num, Name, LectureData, Status };
}

function fixedHeaderContent() {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align="center"
            style={{ width: column.width }}
            sx={{
              backgroundColor: "#dcdcdc",
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function rowContent(index, row, handleClick, selectedRow) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{ width: column.width }}
          sx={{
            padding: "8px", // 패딩을 줄이기 위해 추가
            backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
          }}
        >
          <span
            onClick={() =>
              column.dataKey !== "Action" && handleClick(row.id, row)
            }
          >
            {row[column.dataKey]}
          </span>
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function StudentStudentList({ eclassUuid }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    customAxios
      .get("/api/eclass/student/allList")
      .then((response) => {})
      .catch((error) => {
        console.error("Error fetching student list:", error);
      });
  }, []);

  useEffect(() => {
    if (Array.isArray(eclassUuid)) {
      console.log("유유아이디 확인 : " + eclassUuid);

      eclassUuid.forEach((uuid) => {
        customAxios
          .get(`/api/eclass/student/joinList?eclassUuid=${uuid}`)
          .then((response) => {
            const students = response.data;

            // 학생 리스트를 rowData 형식으로 변환
            const newStudents = students.map((student, index) =>
              createData(index + 1, [
                student.studentId,
                student.studentName,
                student.studentGroup,
                moment(student.joinDate).format("YYYY-MM-DD"),
              ])
            );

            console.log(
              `EClass 참여학생 (UUID: ${uuid}) : ` +
                JSON.stringify(newStudents, null, 2)
            );

            setRowData(newStudents);
          })
          .catch((error) => {
            console.error("Error fetching student list:", error);
          });
      });
    }
  }, [eclassUuid]);

  const handleRowClick = (id, row) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    console.log(row);
  };

  const handleDelete = (id) => {
    setRowData((prevRowData) => prevRowData.filter((row) => row.id !== id));
    console.log(`Row with id ${id} deleted`);
  };

  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".virtuoso-table") &&
      !event.target.closest(".modal-table")
    ) {
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Typography variant="h5" sx={{ margin: "20px 0 10px 0" }}>
        {"[ 참여학생리스트 ]"}
      </Typography>
      <Paper
        style={{ height: "100%", width: "100%" }}
        className="virtuoso-table"
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={rowData}
          itemContent={(index, row) =>
            rowContent(index, row, handleRowClick, handleDelete, selectedRow)
          }
          style={{ height: 200 }}
        />
      </Paper>
    </div>
  );
}
