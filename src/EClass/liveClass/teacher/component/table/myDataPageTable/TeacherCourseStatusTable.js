import React, { useState, useEffect, useRef } from "react";
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
import ReportViewModal from "../../../modal/ReportViewModal";

function createData(
  name = "noName",
  sessionId = "noId",
  shared = false,
  assginmentShared = false,
  assginmentSubmit = false,
  reportSubmit = false
) {
  return {
    name,
    sessionId,
    shared,
    assginmentShared,
    assginmentSubmit,
    reportSubmit,
  };
}

const getStudent = async (sessionId) => {
  try {
    const response = await customAxios.get(
      `${process.env.REACT_APP_API_URL}/student?sessionId=${sessionId}`
    );
    // console.log(
    //   "Fetched student data: " + JSON.stringify(response.data, null, 2)
    // );
    return response.data.username;
  } catch (error) {
    console.error("Error fetching student data: ", error);
    return null;
  }
};

export default function TeacherCourseStatusTable({
  stepCount,
  eclassUuid,
  sessionIds,
  assginmentShareCheck,
}) {
  const sessionData = sessionIds.map((sessionId) => ({
    id: sessionId,
  }));
  const [students, setStudents] = useState([]);
  const [studentStepFlag, setStudentStepFlag] = useState();
  const [reportData, setReportData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAssginShared, setIsAssginShared] = useState(false);

  const selectedReport = useRef();

  const updateShareStatus = useLiveClassPartStore(
    (state) => state.updateShareStatus
  );

  const handleOpenModal = (name) => {
    selectedReport.current = name;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const studentData = await Promise.all(
        sessionData.map((session) => getStudent(session.id))
      );

      setStudents(studentData);
    };

    if (sessionData.length) {
      fetchStudents();
    }
  }, [sessionIds]);

  useEffect(() => {
    if (sessionData.length && stepCount !== undefined) {
      sessionData.forEach((session) => {
        updateShareStatus(session.id, null, false);
      });
    }
  }, [stepCount, sessionData]);

  useEffect(() => {
    // 학생 정보가 모두 설정된 후에 sendStudentData 실행
    if (students.length > 0) {
      sendStudentData();
    }
  }, [students, assginmentShareCheck]);

  const sendStudentData = async () => {
    try {
      if (students.length && eclassUuid) {
        const requestData = {
          studentData: students,
          eclassUuid: eclassUuid,
        };
        // console.log("확인 : " + JSON.stringify(requestData, null, 2));

        const respCheckList = await customAxios.post(
          "/api/eclass/student/assignment/getCheckList",
          requestData
        );

        const respReportUuid = await customAxios.post(
          "/api/eclass/student/assignment/reportUuid/get",
          requestData
        );

        // console.log(
        //   "respReportUuid.data : " +
        //     JSON.stringify(respReportUuid.data, null, 2)
        // );
        if (Array.isArray(respReportUuid.data)) {
          // null 또는 빈 값을 필터링하여 제거
          const filteredReportUuid = respReportUuid.data.filter(
            (uuid) => uuid !== null && uuid !== ""
          );

          if (filteredReportUuid.length > 0) {
            const respReport = await customAxios.post(
              "/api/report/getstep",
              filteredReportUuid // 필터링된 배열을 전달
            );
            // console.log(
            //   "보고서 데이터 : " + JSON.stringify(respReport.data, null, 2)
            // );

            if (respReport.data && respReport.data.length > 0) {
              setReportData(respReport.data);
            }
          } else {
            console.warn("필터링 후 유효한 UUID가 없습니다.");
          }
        }

        setIsAssginShared(false);

        setStudentStepFlag(respCheckList.data);
        // console.log("Assignment status:", respCheckList.data);
      }
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  const Row = ({ row, isMatch, reportData }) => {
    // console.log(" 학생 상태 리스트 : " + JSON.stringify(row, null, 2));

    const report = reportData.filter((data) => {
      return data.username === row.name;
    });

    // console.log("정제된건? : " + JSON.stringify(report, null, 2));

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
          {assginmentShareCheck?.some(
            (assign) =>
              assign.sessionId === row.sessionId &&
              assign.assginmentShared === true
          ) ? (
            <CheckCircleIcon sx={{ color: "blue" }} />
          ) : (
            <CancelIcon sx={{ color: "red" }} />
          )}
        </TableCell>
        <TableCell align="center">
          {isMatch || row.assginmentSubmit ? (
            <CheckCircleIcon sx={{ color: "blue" }} />
          ) : (
            <CancelIcon sx={{ color: "red" }} />
          )}
        </TableCell>
        <TableCell align="center">
          {report[0]?.username === row.name ? (
            <Button
              onClick={() => handleOpenModal(row.name)}
              sx={{
                width: "3%",
                marginRight: 1,
                fontFamily: "'Asap', sans-serif",
                fontWeight: "600",
                fontSize: "0.9rem",
                color: "grey",
                backgroundColor: "#feecfe",
                borderRadius: "2.469rem",
                border: "none",
              }}
            >
              확인
            </Button>
          ) : (
            <CancelIcon sx={{ color: "red" }} />
          )}
        </TableCell>
      </TableRow>
    );
  };
  Row.propTypes = {
    row: PropTypes.shape({
      name: PropTypes.string.isRequired,
      sessionId: PropTypes.string.isRequired,
      shared: PropTypes.bool.isRequired,
      assginmentShared: PropTypes.bool.isRequired,
      assginmentSubmit: PropTypes.bool.isRequired,
      reportSubmit: PropTypes.bool.isRequired,
    }).isRequired,
  };

  const rows = sessionData.map((session, index) =>
    createData(
      students[index],
      session.id,
      session.shared,
      session.assginmentShared,
      session.assginmentSubmit,
      session.reportSubmit
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
        {" 수업 상태 "}
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
            {rows.map((row, index) => {
              const studentFlagArray = studentStepFlag?.[row.name] || [];
              let stepValue = false;
              if (studentFlagArray) {
                stepValue = studentFlagArray[stepCount - 1];
              }

              return (
                reportData && (
                  <Row
                    key={row.sessionId || index} // 고유한 key로 설정
                    row={row}
                    index={index}
                    isMatch={stepValue}
                    reportData={reportData}
                  />
                )
              );
            })}

            <EmptyRows count={Math.max(0, 5 - rows.length)} />
          </TableBody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <ReportViewModal
          open={isModalOpen}
          onClose={handleCloseModal}
          tableData={reportData.filter(
            (data) => data.username === selectedReport.current
          )}
        />
      )}
    </div>
  );
}
