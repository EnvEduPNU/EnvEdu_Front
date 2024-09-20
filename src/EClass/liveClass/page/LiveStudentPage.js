import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import StudentAssignmentTable from '../student/component/table/StudentAssignmentTable';
import { StudentStepCompnent } from '../student/component/StudentStepCompnent';
import { customAxios } from '../../../Common/CustomAxios';
import SockJS from 'sockjs-client';
import StudentReportTable from '../teacher/component/table/eclassPageTable/StudentReportTable';

import { Client } from '@stomp/stompjs';
import { StudentScreenShareJitsi } from '../student/screenShare/StudentScreenShareJitsi';

export const LiveStudentPage = () => {
  const sessionId = useRef('');
  const [sessionIdState, setSessionIdState] = useState();
  const [finished, setFinished] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [courseStep, setCourseStep] = useState();
  const [stepCount, setStepCount] = useState();
  const [reportTable, setReportTable] = useState([]);
  const [classProcess, setClassProcess] = useState(true);
  const [page, setPage] = useState('defaultPage');
  const [sharedScreenState, setSharedScreenState] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 스피너 상태 관리

  const location = useLocation();
  const { lectureDataUuid, row, eClassUuid } = location.state || {};

  const stompClients = useRef(null);
  const ScreanSharestompClients = useRef(null);

  const navigate = useNavigate();

  // stompClients 커넥션 생성 훅
  useEffect(() => {
    if (!stompClients.current) {
      const token = localStorage.getItem('access_token').replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      stompClients.current = new Client({ webSocketFactory: () => sock });

      stompClients.current.onConnect = (frame) => {
        console.log('학생 입장 소켓 연결 성공', frame);
        sendMessage(true); // 연결 성공 후에만 sendMessage(true)를 실행
      };

      stompClients.current.activate();
    }
    return () => {
      if (stompClients.current) {
        stompClients.current.deactivate(() => {
          console.log('학생 입장 소켓 연결 해제');
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!ScreanSharestompClients.current) {
      const token = localStorage.getItem('access_token').replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      ScreanSharestompClients.current = new Client({
        webSocketFactory: () => sock,
      });

      ScreanSharestompClients.current.onConnect = (frame) => {
        console.log('화면 공유 소켓 연결 성공', frame);

        ScreanSharestompClients.current.subscribe(
          '/topic/ScreenShareFlag',
          function (message) {
            const parsedMessage = JSON.parse(message.body);
            console.log(
              '화면 공유 상태 : ' + JSON.stringify(parsedMessage, null, 2),
            );

            setTimeout(() => {
              setSharedScreenState(parsedMessage.screenShared);
            }, 1000);
          },
        );
      };

      ScreanSharestompClients.current.activate();
    }
    return () => {
      if (ScreanSharestompClients.current) {
        ScreanSharestompClients.current.deactivate(() => {
          console.log('화면 공유 상태 소켓 연결 해제');
        });
      }
    };
  }, []);

  // 각 학생의 E-Class에 대한 Session Id 생성 훅
  useEffect(() => {
    console.log(
      '[LiveStudentPage] 이클래스 UUID: ' + JSON.stringify(eClassUuid, null, 2),
    );

    const initializeSession = async () => {
      const newSessionId = uuidv4();
      const registeredSessionId = await registerSessionId(newSessionId);

      sessionId.current = registeredSessionId || newSessionId;
      setSessionIdState(sessionId.current);
      setFinished(true);
    };

    initializeSession();

    const handleBeforeUnload = (event) => {
      sendMessage(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      sendMessage(false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 수업 종료 훅
  useEffect(() => {
    if (!classProcess) {
      alert('수업이 종료되었습니다!');
      sendMessage(false);
      navigate('/');
      window.location.reload();
    }
  }, [classProcess]);

  // 화면 공유 아닐때 Default Page 설정 훅
  useEffect(() => {
    if (!sharedScreenState) {
      setPage('defaultPage');
    }
  }, [sharedScreenState, setPage]);

  const sendMessage = async (state) => {
    const message = {
      entered: state,
      sessionId: sessionId.current,
    };
    if (
      stompClients &&
      stompClients.current &&
      stompClients.current.connected
    ) {
      await stompClients.current.publish({
        destination: '/app/student-entered', // 메시지를 보낼 경로
        body: JSON.stringify(message), // 메시지 본문
        headers: {}, // 선택적 헤더
      });
    } else {
      console.error('STOMP 클라이언트가 연결되지 않았습니다.');
    }
  };

  const registerSessionId = async (sessionId) => {
    try {
      const userName = localStorage.getItem('username');

      const resp = await customAxios.post('/api/sessions/register-session', {
        eclassUuid: eClassUuid,
        sessionId: sessionId,
        userName: userName,
      });

      return resp.data;
    } catch (error) {
      console.error('세션 ID 등록 중 오류 발생:', error);
      return null;
    }
  };

  return (
    <div style={{ display: 'flex', margin: '0 20vh' }}>
      <div style={{ display: 'inline-block', width: '100%', height: '100%' }}>
        <Typography variant="h4" sx={{ margin: '0 20px 0 20px' }}>
          {row.Name}
        </Typography>
        <div style={{ margin: '0 20px 0 20px' }}>
          {!sharedScreenState && (
            <StudentStepCompnent
              setPage={setPage}
              setStepCount={setStepCount}
              page={page}
              data={tableData}
              uuid={lectureDataUuid}
              stepCount={stepCount}
              setReportTable={setReportTable}
              sessionIdState={sessionIdState}
              eclassUuid={eClassUuid}
              lectureDataUuid={lectureDataUuid}
            />
          )}
          {/* 스피너 표시 */}
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh',
                margin: '20px 10px 0 0',
                border: '1px solid grey',
                zIndex: 1000,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {/* 화면 공유 메서드 */}
          {/* {sharedScreenState && (
            <StudentScreenShareJitsi
              sharedScreenState={sharedScreenState}
              setIsLoading={setIsLoading} // setIsLoading을 props로 전달
            />
          )} */}
        </div>
      </div>

      <div style={{ width: '25%', marginRight: '30px' }}>
        <StudentAssignmentTable
          setCourseStep={setCourseStep}
          setTableData={setTableData}
          lectureDataUuid={lectureDataUuid}
          setStepCount={setStepCount}
          stepCount={stepCount}
          reportTable={reportTable}
          eclassUuid={eClassUuid}
        />
        <StudentReportTable selectedEClassUuid={eClassUuid} />
      </div>
    </div>
  );
};

export default LiveStudentPage;
