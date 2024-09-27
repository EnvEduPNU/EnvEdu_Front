import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import StudentRenderAssign from '../../teacher/component/StudentRenderAssign';
import { Typography } from '@mui/material';
import { customAxios } from '../../../../Common/CustomAxios';

export function StudentStepCompnent(props) {
  const [page, setPage] = useState();
  const [stepCount, setStepCount] = useState();
  const [tableData, setTableData] = useState(props.data);
  const [socketEclassUuid, setSocketEclassUuid] = useState(null);
  const [assginmentCheck, setAssignmentCheck] = useState(false);
  const [eclassUuid, setEclassUuid] = useState(props.eclassUuid);
  const [studentId, setStudentId] = useState(null);
  const [assignmentCheckTime, setAssignmentCheckTime] = useState(false);

  const [sessionId, setSessionId] = useState();

  const stompClient = useRef();
  const assginmentStompClient = useRef();

  // props 넘어오면 데이터 갱신
  useEffect(() => {
    setEclassUuid(props.eclassUuid);
    setTableData(props.data);
    setStepCount(props.stepCount);
    setSessionId(props.sessionIdState);
  }, [props]);

  // WebSocket 연결 및 페이지 변경에 따른 처리
  useEffect(() => {
    const token = localStorage.getItem('access_token').replace('Bearer ', '');

    if (props.sessionIdState) {
      console.log('학생 세션 아이디1 : ' + props.sessionIdState);

      if (!stompClient.current) {
        const sock = new SockJS(
          `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
        );
        stompClient.current = new Client({ webSocketFactory: () => sock });

        stompClient.current.onConnect = (frame) => {
          console.log('과제 공유 소켓 연결 성공00 : ', frame);
          stompClient.current.subscribe(
            '/topic/switchPage',
            function (message) {
              const parsedMessage = JSON.parse(message.body);

              setPage(parsedMessage.page);
              props.setPage(parsedMessage.page);
              setStepCount(parsedMessage.stepCount);
              props.setStepCount(parsedMessage.stepCount);
              setSocketEclassUuid(parsedMessage.lectureDataUuid);
              assginmentCheckStompClient('success');
            },
          );
        };

        stompClient.current.activate();
      }
    }

    if (!assginmentStompClient.current) {
      const socket = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      assginmentStompClient.current = new Client({
        webSocketFactory: () => socket,
      });

      assginmentStompClient.current.onConnect = (frame) => ({}, () => {});
    }

    // return () => {
    //   stompClient.current.disconnect();
    //   assginmentStompClient.current.disconnect();

    //   console.log("Disconnected");
    // };
  }, [props.sessionIdState]);

  // useEffect(() => {
  //   const success = "success";
  //   const failed = "failed";
  //   if (page === "newPage") {
  //     assginmentCheckStompClient(success);
  //   }
  //   if (props.stepCount !== stepCount) {
  //     assginmentCheckStompClient(failed);
  //   }
  // }, [props, page, assignmentCheckTime]);

  // 과제 공유 성공시 응답 소켓 메서드
  const assginmentCheckStompClient = async (state) => {
    const message = {
      assginmentStatus: state,
      sessionId: props.sessionIdState,
      assginmentShared: true,
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    };

    if (assginmentStompClient.current) {
      console.log('공유 성공 보내기');
      await assginmentStompClient.current.publish({
        destination: '/app/assginment-status', // 메시지를 보낼 경로
        body: JSON.stringify(message), // 메시지 본문
        headers: {}, // 선택적 헤더
      });
    } else {
      console.error('STOMP 클라이언트가 연결되지 않았습니다.');
    }
  };

  // 학생 ID 및 테이블 데이터 가져오기
  useEffect(() => {
    const username = localStorage.getItem('username');
    console.log(
      '이클래스 유유아이디 : ' + JSON.stringify(props.eclassUuid, null, 2),
    );

    const fetchStudentId = async () => {
      try {
        const response = await customAxios.get(
          `/api/student/getStudentId?username=${username}&uuid=${props.eclassUuid}`,
        );
        setStudentId(response.data);
      } catch (error) {
        console.error('Error fetching student ID:', error);
      }
    };

    if (!studentId) {
      fetchStudentId();
    }
  }, [eclassUuid, studentId]);

  // // Page와 eClassUuid가 맞는지 여부를 메모이제이션
  // const shouldRenderAssign = useMemo(() => {
  //   return ;
  // }, [page, props.uuid, socketEclassUuid, stepCount]);

  return (
    <div>
      {page === 'newPage' || props.uuid === socketEclassUuid || stepCount ? (
        <StudentRenderAssign
          tableData={tableData}
          assginmentCheck={assginmentCheck}
          stepCount={stepCount}
          studentId={studentId}
          sessionIdState={props.sessionIdState}
          eclassUuid={props.eclassUuid}
        />
      ) : (
        <DefaultPageComponent />
      )}
    </div>
  );
}

function DefaultPageComponent() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '66vh',
        margin: '0 10px 10vh 0',
        border: '1px solid grey',
      }}
    >
      <Typography variant="h6">수업을 기다려주세요.</Typography>
    </div>
  );
}
