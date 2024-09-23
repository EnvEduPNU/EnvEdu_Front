import React, { useEffect, useRef, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false); // 스피너 상태 관리
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

  useEffect(() => {
    const fetchSessionIds = async () => {
      const response = await customAxios.get('/api/sessions/get-session-ids');
      const sessionIds = response.data;
      setSessionIds(sessionIds);
      console.log('참여한 학생 : ', JSON.stringify(sessionIds, null, 2));
    };
    fetchSessionIds();

    if (!stompClients.current) {
      const token = localStorage.getItem('access_token').replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      stompClients.current = new Client({ webSocketFactory: () => sock });

      stompClients.current.onConnect = (frame) => {
        console.log('학생 입장 소켓 연결 성공 : ', frame);

        stompClients.current.subscribe(
          '/topic/student-entered',
          function (message) {
            const parsedMessage = JSON.parse(message.body);
            console.log(
              '학생 상태 : ' + JSON.stringify(parsedMessage, null, 2),
            );

            setTimeout(() => {
              fetchSessionIds();
            }, 1000);
          },
        );
      };

      stompClients.current.activate();
    }

    return () => {
      if (stompClients.current) {
        stompClients.current.deactivate(() => {
          console.log('학생 상태 소켓 연결 해제');
        });
      }
    };
  }, []);

  useEffect(() => {
    // 소켓이 한 번만 연결되도록
    if (!ScreanSharestompClients.current) {
      const token = localStorage.getItem('access_token').replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      ScreanSharestompClients.current = new Client({
        webSocketFactory: () => sock,
      });

      ScreanSharestompClients.current.onConnect = (frame) => {
        console.log('화면 공유 소켓 연결 성공 : ', frame);
      };

      ScreanSharestompClients.current.activate(); // 소켓 활성화
    }

    return () => {
      if (ScreanSharestompClients.current) {
        ScreanSharestompClients.current.deactivate(() => {
          console.log('화면 공유 소켓 연결 해제');
        });
      }
    };
  }, []);

  // 소켓 연결 및 메시지 보내는 함수
  // 차후 프론트엔드에서 여러번 요청 보내는 것이 아닌 배열로 요청해서 백엔드에서 처리하는 방식으로 리팩토링 필요
  const sendMessage = async (state) => {
    // sessionIds 배열을 순회하며 각 sessionId에 대해 개별 요청을 보냄
    for (const sessionId of sessionIds) {
      const message = {
        screenShared: state,
        sessionId: sessionId, // 각 sessionId를 개별적으로 처리
      };

      if (
        ScreanSharestompClients.current &&
        ScreanSharestompClients.current.connected
      ) {
        try {
          console.log('소켓 보내기', state, sessionId);
          await ScreanSharestompClients.current.publish({
            destination: '/app/screen-share-flag', // 메시지를 보낼 경로
            body: JSON.stringify(message), // 메시지 본문
            headers: {}, // 선택적 헤더
          });

          setSharedScreenState(state); // 상태를 업데이트
        } catch (error) {
          console.error('메시지 전송 오류:', error);
        }
      } else {
        console.error('STOMP 클라이언트가 연결되지 않았습니다.');
        // 재연결 로직을 추가할 수 있음
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
            <>
              <TeacherRenderAssign data={tableData} />
            </>
          ) : (
            <>{!sharedScreenState && <DefaultPageComponent />}</>
          )}
        </div>

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
        {sharedScreenState && (
          <TeacherScreenShareJitsi
            sharedScreenState={sharedScreenState}
            setSharedScreenState={setSharedScreenState}
            setIsLoading={setIsLoading} // setIsLoading을 props로 전달
          />
        )}

        <button
          onClick={() => sendMessage(true)}
          style={{
            margin: '10px 0 ',
            width: '18%',
            marginRight: 1,
            fontFamily: "'Asap', sans-serif",
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'grey',
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
          }}
        >
          화면 공유
        </button>
        <button
          onClick={() => sendMessage(false)}
          style={{
            margin: '10px 0 0 10px ',
            width: '18%',
            marginRight: 1,
            fontFamily: "'Asap', sans-serif",
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'grey',
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
          }}
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
          style={{
            margin: '10px 0 0 10px ',
            width: '18%',
            marginRight: 1,
            fontFamily: "'Asap', sans-serif",
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'grey',
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
          }}
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
