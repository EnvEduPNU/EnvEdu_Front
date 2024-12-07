import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import StudentAssignmentTable from '../student/component/table/StudentAssignmentTable';
import { StudentStepCompnent } from '../student/component/StudentStepCompnent';
import { customAxios } from '../../../Common/CustomAxios';
import SockJS from 'sockjs-client';
import StudentReportTable from '../teacher/component/table/eclassPageTable/StudentReportTable';

import { Client } from '@stomp/stompjs';
import { StudentScreenShareJitsi } from '../student/screenShare/StudentScreenShareJitsi';
import StudentReportModal from '../student/modal/StudentReportModal';

export const LiveStudentPage = () => {
  const sessionId = useRef('');
  const [sessionIdState, setSessionIdState] = useState();
  const [finished, setFinished] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [latestTableData, setLatestTableData] = useState([]);
  const [courseStep, setCourseStep] = useState();
  const [stepCount, setStepCount] = useState();
  const [reportTable, setReportTable] = useState([]);
  const [classProcess, setClassProcess] = useState(true);
  const [page, setPage] = useState('defaultPage');
  const [sharedScreenState, setSharedScreenState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittedListVisible, setIsSubmittedListVisible] = useState(false);

  const [assginmentFetch, setAssginmentFetch] = useState(false);

  const location = useLocation();
  const { lectureDataUuid, row, eClassUuid } = location.state || {};

  const stompClients = useRef(null);
  const ScreanSharestompClients = useRef(null);
  const sendScreenShareStClient = useRef(null);

  const navigate = useNavigate();

  const photoList = location.state?.photoList || [];
  const [openReportModal, setOpenReportModal] = useState(false);

  const handleReportButtonClick = () => {
    setOpenReportModal(true);
  };

  const handleCloseModal = () => {
    setOpenReportModal(false);
  };

  useEffect(() => {
    const fetch = async () => {
      // 기본 요청 데이터 설정
      const requestData = {
        eclassUuid: eClassUuid,
        username: localStorage.getItem('username'),
      };

      const username = localStorage.getItem('username');

      console.log(
        '{!!!!!!!!! 너누구야 !!!!!]  : ' +
          JSON.stringify(localStorage.getItem('username'), null, 2),
      );
      const assignmentUuidResp = await customAxios.post(
        '/api/eclass/student/assginmentUuid/get',
        requestData,
      );
      console.log(
        '{!!!!!!!!! 보고서 uuid !!!!!]  : ' +
          JSON.stringify(assignmentUuidResp.data, null, 2),
      );

      const ReportUuid = assignmentUuidResp.data;

      const lectureResponse = await customAxios.get(
        '/api/assignment/get-step-one',
        {
          params: {
            uuid: lectureDataUuid,
            username,
          },
        },
      );

      console.log(
        '{!!!!!!!!! 있니? !!!!!]  : ' +
          JSON.stringify(lectureResponse.data, null, 2),
      );

      if (!lectureResponse.data) {
        console.log('제출된 데이터 없음');

        const lectureData = await customAxios.get(
          '/api/steps/getLectureContentOne',
          {
            params: {
              uuid: lectureDataUuid,
            },
          },
        );

        console.log(
          '해당 데이터 : ' + JSON.stringify(lectureData.data, null, 2),
        );

        const formattedData = lectureData.data.contents.map((content) => ({
          contentName: content.contentName,
          stepNum: content.stepNum,
          contents: content.contents,
        }));

        console.log('포맷 된 데이터:', JSON.stringify(formattedData, null, 2));

        setTableData(formattedData);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    console.log('테이블/그래프 캡쳐 리스트 :', photoList);
  }, [photoList]);

  useEffect(() => {
    if (!stompClients.current) {
      const token = localStorage.getItem('access_token').replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      stompClients.current = new Client({ webSocketFactory: () => sock });

      stompClients.current.onConnect = (frame) => {
        console.log('학생 입장 소켓 연결 성공', frame);
        sendMessage(true);
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
    if (!sendScreenShareStClient.current) {
      const token = localStorage.getItem('access_token').replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      sendScreenShareStClient.current = new Client({
        webSocketFactory: () => sock,
      });

      sendScreenShareStClient.current.onConnect = (frame) => {
        console.log('화면 상태 소켓 연결 성공', frame);
        sendMessage(true);
      };

      sendScreenShareStClient.current.activate();
    }
    return () => {
      if (sendScreenShareStClient.current) {
        sendScreenShareStClient.current.deactivate(() => {
          console.log('화면 상태 소켓 연결 해제');
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!ScreanSharestompClients.current) {
      const token = localStorage.getItem('access_token').replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`,
      );
      ScreanSharestompClients.current = new Client({
        webSocketFactory: () => sock,
      });

      ScreanSharestompClients.current.onConnect = (frame) => {
        console.log('화면 공유 소켓 연결 성공', frame);

        ScreanSharestompClients.current.subscribe(
          '/topic/screen-share-flag',
          function (message) {
            const parsedMessage = JSON.parse(message.body);
            console.log(
              '화면 공유 상태 : ' + JSON.stringify(parsedMessage, null, 2),
            );
            setTimeout(() => {
              setSharedScreenState(parsedMessage.screenShared);
            }, 1000);

            sendStateMessage(parsedMessage.screenShared);
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

  useEffect(() => {
    if (!classProcess) {
      alert('수업이 종료되었습니다!');
      sendMessage(false);
      navigate('/');
      window.location.reload();
    }
  }, [classProcess]);

  useEffect(() => {
    if (!sharedScreenState) {
      setPage('defaultPage');
    }
  }, [sharedScreenState, setPage]);

  const sendMessage = async (state) => {
    const message = {
      entered: state,
      sessionId: sessionId.current,
      sharedScreenState: sharedScreenState,
    };
    if (
      stompClients &&
      stompClients.current &&
      stompClients.current.connected
    ) {
      await stompClients.current.publish({
        destination: '/app/student-entered',
        body: JSON.stringify(message),
        headers: {},
      });
    } else {
      console.error('STOMP 클라이언트가 연결되지 않았습니다.');
    }
  };

  const sendStateMessage = async (state) => {
    const shareState = {
      sessionId: sessionId.current,
      shared: state,
    };
    console.log(
      '화면 공유 상태 응답하기 : ' + JSON.stringify(shareState, null, 2),
    );
    if (
      sendScreenShareStClient &&
      sendScreenShareStClient.current &&
      sendScreenShareStClient.current.connected
    ) {
      await sendScreenShareStClient.current.publish({
        destination: '/app/assginment-status',
        body: JSON.stringify(shareState),
        headers: {},
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
    <div style={{ display: 'flex', margin: '0 20vh', height: '800px' }}>
      <div style={{ display: 'inline-block', width: '100%', height: '800px' }}>
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
              setAssginmentFetch={setAssginmentFetch}
              latestTableData={latestTableData}
            />
          )}
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
          {sharedScreenState && (
            <StudentScreenShareJitsi
              sharedScreenState={sharedScreenState}
              setIsLoading={setIsLoading}
            />
          )}
        </div>
      </div>

      <div style={{ width: '35%', height: '100%', marginRight: '30px' }}>
        {isSubmittedListVisible ? (
          <>
            <Typography
              variant="h5"
              sx={{
                margin: '0 0 10px 0',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: '600',
                fontSize: '1.5rem',
              }}
            >
              {' 친구들의 보고서 '}
            </Typography>
            <StudentReportTable selectedEClassUuid={eClassUuid} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsSubmittedListVisible(!isSubmittedListVisible)}
              style={{
                width: '100%',
                fontFamily: "'Asap', sans-serif",
                fontWeight: '600',
                fontSize: '0.9rem',
                color: 'grey',
                backgroundColor: '#feecfe',
                borderRadius: '1.469rem',
                border: 'none',
              }}
            >
              {isSubmittedListVisible ? 'E-Class 리스트' : '친구들의 보고서'}
            </Button>
          </>
        ) : (
          <>
            <StudentAssignmentTable
              setCourseStep={setCourseStep}
              tableData={tableData}
              setTableData={setTableData}
              lectureDataUuid={lectureDataUuid}
              setStepCount={setStepCount}
              stepCount={stepCount}
              reportTable={reportTable}
              eclassUuid={eClassUuid}
              assginmentFetch={assginmentFetch}
              onReportButtonClick={handleReportButtonClick}
              setLatestTableData={setLatestTableData}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReportButtonClick}
                style={{
                  width: '100%',
                  fontFamily: "'Asap', sans-serif",
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'grey',
                  backgroundColor: '#feecfe',
                  borderRadius: '2.469rem',
                  border: 'none',
                }}
              >
                보고서
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setIsSubmittedListVisible(!isSubmittedListVisible)
                }
                style={{
                  width: '100%',
                  fontFamily: "'Asap', sans-serif",
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'grey',
                  backgroundColor: '#feecfe',
                  borderRadius: '2.469rem',
                  border: 'none',
                }}
              >
                {isSubmittedListVisible ? 'E-Class 리스트' : '친구들의 보고서'}
              </Button>
            </div>
            <StudentReportModal
              open={openReportModal}
              onClose={handleCloseModal}
              tableData={tableData}
              latestTableData={latestTableData}
              assginmentCheck={assginmentFetch}
              stepCount={stepCount}
              eclassUuid={eClassUuid}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LiveStudentPage;
