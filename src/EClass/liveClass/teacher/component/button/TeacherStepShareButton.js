import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useLiveClassPartStore } from '../../../store/LiveClassPartStore';

export function TeacherStepShareButton({
  stepCount,
  lectureDataUuid,
  sharedScreenState,
  assginmentShareCheck,
  setAssginmentShareCheck,
}) {
  const stompClientRef = useRef(null); // 소켓 연결을 참조하는 상태
  const [sessionId, setSessionId] = useState();
  const [shared, setShared] = useState();
  const [assignShared, setAssignShared] = useState(false);
  const [assginmentSubmit, setAssginmentSubmit] = useState();
  const [reportSubmit, setReportSubmit] = useState();

  const updateShareStatus = useLiveClassPartStore(
    (state) => state.updateShareStatus,
  );

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

        // 과제 공유 성공 메시지 구독
        stompClientRef.current.subscribe(
          '/topic/assginment-status',
          (message) => {
            const parsedMessage = JSON.parse(message.body);
            console.log(
              '과제 공유 : ' + JSON.stringify(parsedMessage, null, 2),
            );

            setSessionId(parsedMessage.sessionId);
            setShared(parsedMessage.shared);
            setAssignShared(parsedMessage.assginmentStatus);
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

            // 상태 업데이트
            const addAssginmentShareCheck = (shareState) => {
              setAssginmentShareCheck((prevState) => {
                // prevState가 null 또는 undefined이면 빈 배열로 초기화
                const validPrevState = prevState || [];

                // 기존 상태에서 shareState.sessionId와 동일한 객체가 있는지 확인
                const existingIndex = validPrevState.findIndex(
                  (item) => item.sessionId === shareState.sessionId,
                );

                if (existingIndex !== -1) {
                  // 이미 같은 sessionId를 가진 객체가 있으면, 해당 객체를 업데이트
                  const updatedState = [...validPrevState];
                  updatedState[existingIndex] = shareState; // 기존 객체를 새로운 객체로 교체
                  return updatedState;
                } else {
                  // 같은 sessionId를 가진 객체가 없으면, 새로운 객체를 추가
                  return [...validPrevState, shareState];
                }
              });
            };

            addAssginmentShareCheck(shareState);
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

    if (stompClientRef.current && !sharedScreenState) {
      console.log('스텝카운트 ' + stepCount);

      const message = {
        page: 'newPage', // JSON 객체에서 "newPage"를 값으로 하는 'page' 키 생성
        stepCount: stepCount,
        lectureDataUuid: lectureDataUuid,
      };
      stompClientRef.current.publish({
        destination: '/app/switch', // 메시지를 보낼 경로
        body: JSON.stringify(message), // 메시지 본문
        headers: {}, // (선택 사항) 헤더
      });
    }

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
      stompClientRef.current.publish({
        destination: '/app/switch', // 메시지를 보낼 경로
        body: JSON.stringify(message), // 메시지 본문
        headers: {}, // (선택 사항) 헤더
      });
    }

    if (sharedScreenState) {
      alert('화면 공유 중 입니다!');
    }
  };

  return (
    <>
      <button
        onClick={sendMessage}
        style={{
          width: '18%',
          marginLeft: '10px',
          marginRight: 1,
          fontFamily: "'Asap', sans-serif", // 버튼에 Asap 폰트 적용
          fontWeight: '600',
          fontSize: '0.9rem',
          color: 'grey',
          backgroundColor: '#feecfe',
          borderRadius: '2.469rem',
          border: 'none',
        }}
      >
        과제 공유
      </button>
      <button
        onClick={sendStopMessage}
        style={{
          width: '18%',
          margin: '10px 0 0 10px ',
          marginRight: 1,
          fontFamily: "'Asap', sans-serif", // 버튼에 Asap 폰트 적용
          fontWeight: '600',
          fontSize: '0.9rem',
          color: 'grey',
          backgroundColor: '#feecfe',
          borderRadius: '2.469rem',
          border: 'none',
        }}
      >
        과제 중지
      </button>
    </>
  );
}
