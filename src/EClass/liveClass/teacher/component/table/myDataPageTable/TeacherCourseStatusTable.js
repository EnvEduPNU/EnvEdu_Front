import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useLiveClassPartStore } from '../../../../store/LiveClassPartStore';
import { customAxios } from '../../../../../../Common/CustomAxios';
import ReportViewModal from '../../../modal/ReportViewModal';

import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';

import Tooltip from '@mui/material/Tooltip';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function createData(
  name = 'noName',
  sessionId = 'noId',
  shared = false,
  assginmentShared = false,
  assginmentSubmit = false,
  reportSubmit = false,
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

export default function TeacherCourseStatusTable({
  stepCount,
  eclassUuid,
  sessionIds,
  assginmentShareCheck,
  assginmentShareStop,
}) {
  const sessionData = sessionIds.map((sessionId) => ({
    id: sessionId,
  }));
  const [students, setStudents] = useState([]);
  const [studentStepFlag, setStudentStepFlag] = useState();
  const [reportData, setReportData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [assginShared, setAssginShared] = useState([]);

  const selectedReport = useRef();

  const updateShareStatus = useLiveClassPartStore(
    (state) => state.updateShareStatus,
  );

  const stompClientRef = useRef(null); // 소켓 연결을 참조하는 상태

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
        sessionData.map((session) => getStudent(session.id, eclassUuid)),
      );

      if (studentData) setStudents(studentData);
    };

    if (sessionData.length > 0) {
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
  }, [students]);

  useEffect(() => {
    const token = localStorage.getItem('access_token').replace('Bearer ', '');
    const sock = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
    );
    const stompClient = new Client({ webSocketFactory: () => sock });

    stompClientRef.current = stompClient;

    stompClientRef.current.onConnect = (frame) => {
      console.log('커넥션 생성 완료 : ' + frame);

      // 학생 상태 성공 메시지 구독
      stompClientRef.current.subscribe(
        '/topic/assginment-status',
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log(
            '학생 상태 공유 응답받기: ' +
              JSON.stringify(parsedMessage, null, 2),
          );
          if (parsedMessage.assginmentStatus === 'failed') {
            setAssginShared((prev) => {
              // 동일한 sessionId를 가진 객체 제거
              const filteredArray = prev.filter(
                (item) => item.sessionId !== parsedMessage.sessionId,
              );

              return [...filteredArray];
            });
          }

          if (parsedMessage.assginmentStatus == 'success') {
            setAssginShared((prev) => {
              // 동일한 sessionId를 가진 객체 제거
              const filteredArray = prev.filter(
                (item) => item.sessionId !== parsedMessage.sessionId,
              );

              return [...filteredArray, parsedMessage];
            });
          }
        },
      );
    };

    stompClientRef.current.activate();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate(() => {
          console.log('Disconnected');
        });
        stompClientRef.current = null; // 참조 제거
      }
    };
  }, []);

  useEffect(() => {
    if (assginmentShareStop) {
      setAssginShared([]);
    }
  }, [assginmentShareStop]);

  useEffect(() => {
    console.log('assginShared 확인 : ' + JSON.stringify(assginShared, null, 2));
  }, [assginShared]);

  // 각 한명의 학생이 있는지를 확인하는 것이고 없는 경우 null 반환
  const getStudent = async (sessionId, eclassUuid) => {
    try {
      const eclassStudentData = {
        sessionId: sessionId,
        eclassUuid: eclassUuid,
      };

      console.log(
        '[TeacherCourseStatusTable] eclassStudentData : ' +
          JSON.stringify(eclassStudentData, null, 2),
      );

      const response = await customAxios.post(
        `${process.env.REACT_APP_API_URL}/api/sessions/student/get`,
        eclassStudentData,
      );

      if (!response.data || !response.data.username) {
        return null;
      }

      return response.data.username;
    } catch (error) {
      console.error('Error fetching student data: ', error);
      return null; // 오류 발생 시에도 null 반환
    }
  };

  const sendStudentData = async () => {
    try {
      // students 배열에 null이 있는지 확인(null이 있으면 true, 없으면 false)
      const hasNull = students.some((student) => student === null);

      if (!hasNull && eclassUuid) {
        const requestData = {
          studentData: students,
          eclassUuid: eclassUuid,
        };

        const respCheckList = await customAxios.post(
          '/api/eclass/student/assignment/getCheckList',
          requestData,
        );

        const respReportUuid = await customAxios.post(
          '/api/eclass/student/assignment/reportUuid/get',
          requestData,
        );

        if (Array.isArray(respReportUuid.data)) {
          // null 또는 빈 값을 필터링하여 제거
          const filteredReportUuid = respReportUuid.data.filter(
            (uuid) => uuid !== null && uuid !== '',
          );

          if (filteredReportUuid.length > 0) {
            const respReport = await customAxios.post(
              '/api/report/getstep',
              filteredReportUuid, // 필터링된 배열을 전달
            );

            if (respReport.data && respReport.data.length > 0) {
              setReportData(respReport.data);
            }
          } else {
            console.warn('보고서가 존재하지 않습니다.');
          }
        }

        setStudentStepFlag(respCheckList.data);
      }
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const Row = ({ row, isMatch, reportData }) => {
    // console.log(' 학생 상태 리스트 : ' + JSON.stringify(row, null, 2));

    // reportData가 없으면 row를 사용
    const report = (reportData || []).filter((data) => {
      return data.username === row.name;
    });

    // report가 비어있는 경우 row에서 필요한 데이터를 대신 사용할 수 있도록 처리
    const finalData = report.length > 0 ? report : [row];

    return (
      <TableRow>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>

        {/* ---------------------------------------- 화면 공유 상태 ---------------------- */}
        <TableCell align="center">
          {row.shared ? (
            <CheckCircleIcon sx={{ color: 'blue' }} />
          ) : (
            <CancelIcon sx={{ color: 'red' }} />
          )}
        </TableCell>

        {/* ---------------------------------- 과제 공유 상태 -------------------- */}
        <TableCell align="center">
          {assginmentShareStop ? (
            <CancelIcon sx={{ color: 'red' }} />
          ) : (
            <>
              {assginShared?.some(
                (item) =>
                  item.sessionId === row.sessionId && item.assginmentShared,
              ) ? (
                <CheckCircleIcon key={row.sessionId} sx={{ color: 'blue' }} />
              ) : (
                <CancelIcon sx={{ color: 'red' }} />
              )}
            </>
          )}
        </TableCell>

        {/* ---------------------------------------- 과제 제출 상태 ---------------------- */}
        <TableCell align="center">
          {isMatch || row.assginmentSubmit ? (
            <CheckCircleIcon sx={{ color: 'blue' }} />
          ) : (
            <CancelIcon sx={{ color: 'red' }} />
          )}
        </TableCell>
        <TableCell align="center">
          {finalData[0]?.username === row.name ? (
            <Button
              onClick={() => handleOpenModal(row.name)}
              sx={{
                width: '3%',
                fontFamily: "'Asap', sans-serif",
                fontWeight: '600',
                fontSize: '0.9rem',
                color: 'grey',
                backgroundColor: '#feecfe',
                borderRadius: '2.469rem',
                border: 'none',
              }}
            >
              확인
            </Button>
          ) : (
            <CancelIcon sx={{ color: 'red' }} />
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

  const rows = sessionData
    .map((session, index) => {
      if (students[index]) {
        // assginmentShareCheck에서 해당 sessionId의 shared 상태를 가져옴
        const sharedStatus =
          assginmentShareCheck?.find(
            (assign) => assign.sessionId === session.id,
          )?.shared || false;

        return createData(
          students[index],
          session.id,
          sharedStatus,
          session.assginmentShared,
          session.assginmentSubmit,
          session.reportSubmit,
        );
      }
      return null; // 학생이 없으면 null 반환
    })
    .filter((row) => row !== null); // null 값을 제외하고 rows 배열을 생성

  const EmptyRows = ({ count }) => {
    return Array.from({ length: count }, (_, index) => (
      <TableRow key={`empty-${index}`} sx={{ height: 50 }}>
        <TableCell colSpan={5} />
      </TableRow>
    ));
  };

  return (
    <div style={{ margin: '1.5rem 0 0 0' }}>
      <Typography variant="h5" sx={{ marginBottom: '10px' }}>
        {' 수업 상태 '}
      </Typography>
      <TableContainer component={Paper} sx={{ height: '510px' }}>
        <Table aria-label="collapsible table" size="small">
          <TableHead sx={{ backgroundColor: '#dcdcdc' }}>
            <TableRow sx={{ height: 50 }}>
              <TableCell align="center">이름</TableCell>
              <TableCell align="center">
                <Tooltip title="화면 공유 여부">
                  <ScreenShareIcon />
                </Tooltip>
              </TableCell>
              {/* <TableCell align="center">
                <Tooltip title="스텝 공유 여부">
                  <AssignmentIcon />
                </Tooltip>
              </TableCell> */}
              <TableCell align="center">
                <Tooltip title="스텝 제출 여부">
                  <AssignmentTurnedInIcon />
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="보고서 확인 여부">
                  <DescriptionIcon />
                </Tooltip>
              </TableCell>
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
                <Row
                  key={row.sessionId || index}
                  row={row}
                  index={index}
                  isMatch={stepValue}
                  reportData={reportData}
                />
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
            (data) => data.username === selectedReport.current,
          )}
        />
      )}
    </div>
  );
}
