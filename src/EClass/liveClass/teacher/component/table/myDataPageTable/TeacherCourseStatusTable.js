import React, { useState, useEffect } from "react";
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
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLiveClassPartStore } from "../../../../store/LiveClassPartStore";
import { customAxios } from "../../../../../../Common/CustomAxios";

function createData(name, sessionId, shared, assginmentShared) {
  return {
    name,
    sessionId,
    shared,
    assginmentShared,
  };
}

function Row({ row }) {
  return (
    <TableRow sx={{ height: 50 }}>
      <TableCell component="th" scope="row">
        {row.name}
      </TableCell>
      <TableCell align="center">
        {row.shared ? (
          <CheckCircleIcon sx={{ color: "blue" }} />
        ) : (
          <CancelIcon sx={{ color: "red" }} />
        )}
      </TableCell>
      <TableCell align="center">
        {row.assginmentShared ? (
          <CheckCircleIcon sx={{ color: "blue" }} />
        ) : (
          <CancelIcon sx={{ color: "red" }} />
        )}
      </TableCell>
      <TableCell align="center">
        <CheckCircleIcon sx={{ color: "blue" }} />
      </TableCell>
      {/* <TableCell align="center">
        <CancelIcon sx={{ color: "red" }} />
      </TableCell> */}
      <TableCell align="center">
        <Button sx={{ width: "3%" }}>확인</Button>
      </TableCell>
    </TableRow>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    sessionId: PropTypes.string.isRequired,
    shared: PropTypes.bool.isRequired,
    assginmentShared: PropTypes.bool.isRequired,
  }).isRequired,
};

const getStudent = async (sessionId) => {
  try {
    const response = await customAxios.get(
      `${process.env.REACT_APP_API_URL}/student?sessionId=${sessionId}`
    );
    console.log(
      "어떻게 받아오는지 확인 : " + JSON.stringify(response.data, null, 2)
    );
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

      console.log(
        "[수업상태] 학생 확인 : " + JSON.stringify(studentData, null, 2)
      );
      console.log(
        "[수업상태] 세션데이터 확인 : " + JSON.stringify(sessionData, null, 2)
      );
      setStudents(studentData);
    };
    fetchStudents();
  }, [sessionData]);

  const rows = sessionData.map((session, index) =>
    createData(
      students[index],
      session.id,
      session.shared,
      session.assginmentShared
    )
  );

  const EmptyRows = ({ count }) => {
    return Array.from({ length: count }, (_, index) => (
      <TableRow key={`empty-${index}`} sx={{ height: 50 }}>
        <TableCell colSpan={5} />
      </TableRow>
    ));
  };

  return (
    <div style={{ margin: "2rem 0 0 0" }}>
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        {"[ 수업 상태 ]"}
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: "300px" }}>
        <Table aria-label="collapsible table" size="small">
          <TableHead sx={{ backgroundColor: "#dcdcdc" }}>
            <TableRow sx={{ height: 50 }}>
              <TableCell align="center">이름</TableCell>
              <TableCell align="center">화면공유</TableCell>
              <TableCell align="center">과제공유</TableCell>
              <TableCell align="center">과제제출</TableCell>
              <TableCell align="center">보고서제출</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.sessionId} row={row} />
            ))}
            <EmptyRows count={Math.max(0, 5 - rows.length)} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
