import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import StudentRenderAssign from '../../teacher/component/StudentRenderAssign';
import { Typography } from '@mui/material';
import { customAxios } from '../../../../Common/CustomAxios';

export function StudentStepCompnent(props) {
  const [page, setPage] = useState(null);
  const [stepCount, setStepCount] = useState(null);
  const [tableData, setTableData] = useState(props.data || []);
  const [socketEclassUuid, setSocketEclassUuid] = useState(null);
  const [eclassUuid, setEclassUuid] = useState(props.eclassUuid);
  const [studentId, setStudentId] = useState(null);

  const stompClient = useRef(null);
  const assginmentStompClient = useRef(null);

  // Update state when props change
  useEffect(() => {
    setEclassUuid(props.eclassUuid);
    setTableData(props.data);
    setStepCount(props.stepCount);
  }, [props.eclassUuid, props.data, props.stepCount]);

  // Handle WebSocket connections
  useEffect(() => {
    const token = localStorage.getItem('access_token')?.replace('Bearer ', '');
    if (!token) {
      console.error('Token not found. Cannot connect to WebSocket.');
      return;
    }

    // Setup WebSocket for page updates
    const setupPageSocket = () => {
      if (!props.sessionIdState || stompClient.current) return;

      console.log('Initializing page WebSocket...');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      const client = new Client({ webSocketFactory: () => sock });

      client.onConnect = (frame) => {
        console.log('Connected to page WebSocket:', frame);
        client.subscribe('/topic/switchPage', (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log('Page update received:', parsedMessage);

          setPage(parsedMessage.page);
          props.setPage(parsedMessage.page);
          setStepCount(parsedMessage.stepCount);
          props.setStepCount(parsedMessage.stepCount);
          setSocketEclassUuid(parsedMessage.lectureDataUuid);

          assginmentCheckStompClient('success');
        });
      };

      client.onStompError = (frame) => {
        console.error('WebSocket error:', frame.headers['message']);
        console.error('Details:', frame.body);
      };

      client.activate();
      stompClient.current = client;
    };

    // Setup WebSocket for assignment status
    const setupAssignmentSocket = () => {
      if (assginmentStompClient.current) return;

      console.log('Initializing assignment WebSocket...');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      const client = new Client({ webSocketFactory: () => sock });

      client.onConnect = () =>
        console.log('Connected to assignment WebSocket.');

      client.onStompError = (frame) => {
        console.error('WebSocket error:', frame.headers['message']);
        console.error('Details:', frame.body);
      };

      client.activate();
      assginmentStompClient.current = client;
    };

    setupPageSocket();
    setupAssignmentSocket();

    // Cleanup WebSocket connections on component unmount
    return () => {
      assginmentCheckStompClient('failed');

      stompClient.current?.deactivate();
      assginmentStompClient.current?.deactivate();
      stompClient.current = null;
      assginmentStompClient.current = null;
      console.log('Disconnected from WebSocket.');
    };
  }, [props.sessionIdState]);

  // Assignment status WebSocket message handling
  const assginmentCheckStompClient = async (state) => {
    if (!assginmentStompClient.current?.connected) {
      console.error('Assignment WebSocket is not connected.');
      return;
    }

    const message = {
      assginmentStatus: state,
      sessionId: props.sessionIdState,
      assginmentShared: state === 'success',
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    };

    console.log('Sending assignment status:', message);

    assginmentStompClient.current.publish({
      destination: '/app/assginment-status',
      body: JSON.stringify(message),
    });
  };

  // Fetch student ID
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username || studentId) return;

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

    fetchStudentId();
  }, [props.eclassUuid, studentId]);

  return (
    <div>
      {page === 'newPage' || props.uuid === socketEclassUuid || stepCount ? (
        <StudentRenderAssign
          tableData={tableData}
          assginmentCheck={props.assginmentCheck}
          stepCount={stepCount}
          studentId={studentId}
          sessionIdState={props.sessionIdState}
          eclassUuid={props.eclassUuid}
          latestTableData={props.latestTableData}
          allData={props.allData}
          localStoredPhotoList={props.localStoredPhotoList}
          setLocalStoredPhotoList={props.setLocalStoredPhotoList}
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
        height: '510px',
        margin: '0 10px 10vh 0',
        border: '1px solid grey',
      }}
    >
      <Typography variant="h6">수업을 기다려주세요.</Typography>
    </div>
  );
}
