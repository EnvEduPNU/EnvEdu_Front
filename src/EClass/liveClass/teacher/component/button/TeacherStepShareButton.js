import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useLiveClassPartStore } from '../../../store/LiveClassPartStore';
import { Button } from '@mui/material';

export function TeacherStepShareButton({
  stepCount,
  lectureDataUuid,
  sharedScreenState,
  setAssginmentShareCheck,
  setAssginmentShareStop,
  setStepCount,
  sessionIds,
  setAssginShareFlag,
}) {
  const stompClientRef = useRef(null); // 소켓 연결을 참조하는 상태
  const [sessionId, setSessionId] = useState();
  const [shared, setShared] = useState();
  const [assignShared, setAssignShared] = useState(false);
  const [assginmentSubmit, setAssginmentSubmit] = useState();
  const [reportSubmit, setReportSubmit] = useState();
  const [studentList, setStudentList] = useState([]);

  const updateShareStatus = useLiveClassPartStore(
    (state) => state.updateShareStatus,
  );

  useEffect(() => {
    setStudentList(sessionIds);
  }, [sessionIds]);

  useEffect(() => {
    if (!stompClientRef.current) {
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

            setSessionId(parsedMessage.sessionId);
            setShared(parsedMessage.shared);
            setAssignShared(parsedMessage.assginmentShared);
            setAssginmentSubmit(parsedMessage.assginmentSubmit);
            setReportSubmit(parsedMessage.reportSubmit);

            // 새로운 상태 객체
            const shareState = {
              sessionId: parsedMessage.sessionId,
              shared: parsedMessage.shared,
              assginmentStatus: parsedMessage.assginmentStatus,
              assginmentShared: parsedMessage.assginmentShared,
              assginmentSubmit: parsedMessage.assginmentSubmit,
              reportSubmit: parsedMessage.reportSubmit,
            };

            console.log(
              '확인해보자1!@#!@#!@# : ' + JSON.stringify(shareState, null, 2),
            );

            // 상태 업데이트 로직
            setAssginmentShareCheck((prevState) => {
              const validPrevState = prevState || []; // null/undefined 방지
              const existingIndex = validPrevState.findIndex(
                (item) => item.sessionId === shareState.sessionId,
              );

              if (existingIndex !== -1) {
                // 기존 상태가 있다면 업데이트
                const updatedState = [...validPrevState];
                updatedState[existingIndex] = shareState; // 기존 객체를 덮어씌움
                return updatedState;
              }

              // 새로운 상태 추가
              return [...validPrevState, shareState];
            });
          },
        );
      };

      stompClientRef.current.activate();
    }

    function onError(error) {
      console.error('STOMP 연결 에러:', error);
      alert(
        '웹소켓 연결에 실패했습니다. 네트워크 설정을 확인하거나 관리자에게 문의하세요.',
      );
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate(() => {
          console.log('Disconnected');
        });
        stompClientRef.current = null; // 참조 제거
      }
    };
  }, []);

  // 과제 공유 소켓 전달
  const sendMessage = () => {
    if (!stepCount) {
      alert('공유할 스텝을 선택해주세요');
      return;
    }

    console.log('스텝카운트 ' + stepCount);

    if (studentList.length < 1) {
      alert('공유할 학생이 없습니다!');
      return;
    }

    if (stompClientRef.current && !sharedScreenState) {
      const message = {
        page: 'newPage', // JSON 객체에서 "newPage"를 값으로 하는 'page' 키 생성
        stepCount: stepCount,
        lectureDataUuid: lectureDataUuid,
      };

      try {
        stompClientRef.current.publish({
          destination: '/app/switch', // 메시지를 보낼 경로
          body: JSON.stringify(message), // 메시지 본문
          headers: {}, // (선택 사항) 헤더
        });

        // publish가 성공하면 학생 수만큼 성공 메시지를 표시
        alert(
          `공유 성공: ${studentList.length}명의 학생에게 과제를 공유하였습니다.`,
        );
        setAssginShareFlag(true);
      } catch (error) {
        console.error('메시지 전송 에러:', error);
        alert('공유 실패: 메시지를 전송하지 못했습니다.');
      }
    } else {
      alert('공유 실패!');
    }

    // 화면 공유 중 때는 과제 공유 못함
    if (sharedScreenState) {
      alert('화면 공유 중 입니다!');
    }
  };

  // 과제 중지 소켓 전달
  const sendStopMessage = () => {
    if (stompClientRef.current && !sharedScreenState) {
      // 과제 공유 상태 업데이트
      updateShareStatus(sessionId, shared, false);

      const message = {
        page: 'stop', // JSON 객체에서 "stop"를 값으로 하는 'page' 키 생성
      };

      try {
        stompClientRef.current.publish({
          destination: '/app/switch', // 메시지를 보낼 경로
          body: JSON.stringify(message), // 메시지 본문
          headers: {}, // (선택 사항) 헤더
        });

        // publish가 성공하면 학생 수만큼 성공 메시지를 표시
        alert(`공유 중지되었습니다.`);
        setAssignShared(false);

        setAssginmentShareStop(true);
        setStepCount(0);
        setAssginShareFlag(false);
      } catch (error) {
        console.error('메시지 전송 에러:', error);
        alert('공유 중지 실패!');
      }
    }

    if (sharedScreenState) {
      alert('화면 공유 중 입니다!');
    }
  };

  return (
    <>
      {!assignShared ? (
        <Button
          variant="contained"
          onClick={sendMessage}
          style={{
            marginTop: '10px',
            width: '200px',
            height: '30px',
            fontFamily: "'Asap', sans-serif",
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'grey',
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
          }}
        >
          과제 공유
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={sendStopMessage}
          style={{
            marginTop: '10px',
            width: '200px',
            height: '30px',
            fontFamily: "'Asap', sans-serif",
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'grey',
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
          }}
        >
          과제 중지
        </Button>
      )}
    </>
  );
}
