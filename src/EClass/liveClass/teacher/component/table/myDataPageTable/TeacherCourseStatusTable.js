import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Collapse,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useLiveClassPartStore } from "../../../../store/LiveClassPartStore";

import { customAxios } from "../../../../../../Common/CustomAxios";

function createData(name, sessionId, shared) {
  return {
    name,
    sessionId,
    shared,
    history: [
      {
        date: "2020-01-05",
        customerId: "Step 1 과제",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Step 2 과제",
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ width: "10px" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.shared ? "공유 중" : "미공유"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {/* <TableCell>제출일</TableCell> */}
                    <TableCell>과제이름</TableCell>
                    <TableCell>상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      {/* <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell> */}
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell>{"완료"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    sessionId: PropTypes.string.isRequired,
    shared: PropTypes.bool.isRequired,
  }).isRequired,
};

const getStudent = async (sessionId) => {
  try {
    const response = await customAxios.get(
      `${process.env.REACT_APP_API_URL}/student?sessionId=${sessionId}`
    );
    console.log("학생 확인 : ", JSON.stringify(response.data, null, 2));
    return response.data.username;
  } catch (error) {
    console.error("Error fetching student data: ", error);
    return null;
  }
};

export default function TeacherCourseStatusTable() {
  const sessionData = useLiveClassPartStore((state) => state.sessionIds);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentData = await Promise.all(
        sessionData.map((session) => getStudent(session.id))
      );
      setStudents(studentData);
      console.log("Student 확인 : ", studentData);
    };
    fetchStudents();
  }, [sessionData]);

  const rows = sessionData.map((session, index) =>
    createData(
      students[index] || `학생 ${index + 1}`,
      session.id,
      session.shared
    )
  );

  const EmptyRows = ({ count }) => {
    const emptyRows = Array.from({ length: count }, (_, index) => (
      <TableRow key={`empty-${index}`} sx={{ height: 50 }}>
        <TableCell>&nbsp;</TableCell>
        <TableCell>&nbsp;</TableCell>
        <TableCell>&nbsp;</TableCell>
        <TableCell>&nbsp;</TableCell>
      </TableRow>
    ));
    return emptyRows;
  };

  return (
    <div style={{ margin: "2rem 0 0 0" }}>
      <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
        {"[ 수업 상태 ]"}
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: "300px" }}>
        <Table aria-label="collapsible table" size="small">
          <TableHead sx={{ backgroundColor: "#dcdcdc" }}>
            <TableRow sx={{ height: 50 }}>
              <TableCell>과제</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>화면공유</TableCell>
              <TableCell>과제공유</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
            <EmptyRows count={5 - rows.length} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
