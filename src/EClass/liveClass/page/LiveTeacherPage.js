import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import { customAxios } from '../../../Common/CustomAxios';
import TeacherAssignmentTable from '../teacher/component/table/myDataPageTable/TeacherAssignmentTable';
import TeacherCourseStatusTable from '../teacher/component/table/myDataPageTable/TeacherCourseStatusTable';
import { TeacherStepShareButton } from '../teacher/component/button/TeacherStepShareButton';
import TeacherRenderAssign from '../teacher/component/TeacherRenderAssign';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { TeacherScreenShareJitsi } from '../teacher/component/screenShare/TeacherScreenShareJitsi';

export const LiveTeacherPage = () => {
  const [sharedScreenState, setSharedScreenState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [courseStep, setCourseStep] = useState();
  const [stepCount, setStepCount] = useState();
  const [sessionIds, setSessionIds] = useState([]);
  const [assginmentShareCheck, setAssginmentShareCheck] = useState([]);

  const { eClassUuid } = useParams();
  const location = useLocation();
  const { lectureDataUuid, eClassName } = location.state || {};

  const stompClients = useRef();
  const ScreanSharestompClients = useRef();

  const navigate = useNavigate();

  // 소켓 클라이언트 초기화 함수
  const initializeSocketClient = (url, onConnectCallback) => {
    const token = localStorage.getItem('access_token')?.replace('Bearer ', '');
    const sock = new SockJS(
      `${process.env.REACT_APP_API_URL}${url}?token=${token}`,
    );
    const client = new Client({ webSocketFactory: () => sock });

    client.onConnect = onConnectCallback;
    client.activate();

    return client;
  };

  useEffect(() => {
    const fetchSessionIds = async () => {
      const response = await customAxios.get('/api/sessions/get-session-ids');
      setSessionIds(response.data);
      console.log('참여한 학생 : ', JSON.stringify(response.data, null, 2));
    };

    fetchSessionIds();

    // 학생 소켓 연결
    stompClients.current = initializeSocketClient('/screen-share', (frame) => {
      console.log('학생 입장 소켓 연결 성공 : ', frame);
      stompClients.current.subscribe('/topic/student-entered', (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log('학생 상태 : ' + JSON.stringify(parsedMessage, null, 2));
        setTimeout(() => fetchSessionIds(), 1000);
      });
    });

    // 화면 공유 소켓 연결
    ScreanSharestompClients.current = initializeSocketClient('/ws', (frame) => {
      console.log('화면 공유 소켓 연결 성공 : ', frame);
    });

    return () => {
      if (stompClients.current) stompClients.current.deactivate();
      if (ScreanSharestompClients.current)
        ScreanSharestompClients.current.deactivate();
    };
  }, []);

  // 화면 공유 상태 전송 함수
  const sendMessage = async (state) => {
    if (sessionIds.length === 0) {
      console.error('세션 ID가 설정되지 않았습니다.');
      return;
    }

    for (const sessionId of sessionIds) {
      const message = { screenShared: state, sessionId };

      if (ScreanSharestompClients.current?.connected) {
        try {
          console.log('소켓 보내기', state, sessionId);
          await ScreanSharestompClients.current.publish({
            destination: '/app/screen-share-flag',
            body: JSON.stringify(message),
          });
          setSharedScreenState(state);
        } catch (error) {
          console.error('메시지 전송 오류:', error);
        }
      } else {
        console.error('STOMP 클라이언트가 연결되지 않았습니다.');
      }
    }
  };

  const closeEclass = async () => {
    await customAxios
      .patch(`/api/eclass/eclass-close?uuid=${eClassUuid}`)
      .then((response) => {
        console.log('Eclass closed :', response.data);
        alert('수업을 종료하였습니다!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Eclass 종료 에러:', error);
      });
  };

  const handleScreenShare = useCallback(
    (state) => {
      sendMessage(state);
    },
    [sessionIds],
  );

  const spinnerBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
    margin: '20px 10px 0 0',
    border: '1px solid grey',
    zIndex: 1000,
  };

  const buttonStyle = {
    margin: '10px 0',
    width: '18%',
    fontFamily: "'Asap', sans-serif",
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'grey',
    backgroundColor: '#feecfe',
    borderRadius: '2.469rem',
    border: 'none',
  };

  function DefaultPageComponent() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          margin: '20px 10px 0 0',
          border: '1px solid grey',
        }}
      >
        <Typography variant="h6">수업을 시작해주세요.</Typography>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', margin: '0 10vh', height: '800px' }}>
      {/* [왼쪽 블럭] 화면 공유 블럭 */}
      <div style={{ display: 'inline-block', width: '60%', height: '100%' }}>
        <Typography variant="h4" sx={{ margin: '0 0 10px 0' }}>
          {eClassName}
        </Typography>

        <div>
          {stepCount && !sharedScreenState ? (
            <TeacherRenderAssign data={tableData} />
          ) : (
            !sharedScreenState && <DefaultPageComponent />
          )}
        </div>

        {/* 스피너 표시 */}
        {isLoading && (
          <Box sx={spinnerBoxStyle}>
            <CircularProgress />
          </Box>
        )}

        {/* 화면 공유 메서드 */}
        {sharedScreenState && (
          <TeacherScreenShareJitsi
            sharedScreenState={sharedScreenState}
            setSharedScreenState={setSharedScreenState}
            setIsLoading={setIsLoading}
          />
        )}

        <button onClick={() => handleScreenShare(true)} style={buttonStyle}>
          화면 공유
        </button>
        <button
          onClick={() => handleScreenShare(false)}
          style={{ ...buttonStyle, marginLeft: '10px' }}
        >
          공유 중지
        </button>

        <TeacherStepShareButton
          stepCount={stepCount}
          lectureDataUuid={lectureDataUuid}
          sharedScreenState={sharedScreenState}
          assginmentShareCheck={assginmentShareCheck}
          setAssginmentShareCheck={setAssginmentShareCheck}
        />
        <button
          onClick={closeEclass}
          style={{ ...buttonStyle, marginLeft: '10px' }}
        >
          수업 종료
        </button>
      </div>

      {/* [오른쪽 블럭] 수업 Step 테이블, 수업 상태 테이블 */}
      <div style={{ width: '30%', marginRight: '30px', height: '100%' }}>
        <TeacherAssignmentTable
          setCourseStep={setCourseStep}
          setTableData={setTableData}
          lectureDataUuid={lectureDataUuid}
          setStepCount={setStepCount}
          setAssginmentShareCheck={setAssginmentShareCheck}
        />
        <TeacherCourseStatusTable
          stepCount={stepCount}
          eclassUuid={eClassUuid}
          sessionIds={sessionIds}
          assginmentShareCheck={assginmentShareCheck}
        />
      </div>
    </div>
  );
};
