import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useLiveClassPartStore } from '../../../store/LiveClassPartStore';
import { Button } from '@mui/material';

export function TeacherStepShareButton({
  stepCount,
  lectureDataUuid,
  sharedScreenState,
  setAssginmentShareStop,
  setStepCount,
  sessionIds,
  setAssginShareFlag,
}) {
  const stompClientRef = useRef(null); // 소켓 연결을 참조하는 상태
  const [assignShared, setAssignShared] = useState(false);
  const [studentList, setStudentList] = useState([]);

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
        // console.log('커넥션 생성 완료 : ' + frame);
      };

      stompClientRef.current.activate();
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
    // console.log('과제 공유 메서드');

    if (!stepCount) {
      alert('공유할 스텝을 선택해주세요');
      return;
    }

    // console.log('스텝카운트 ' + stepCount);

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

        setAssignShared(true);
        setAssginmentShareStop(false);
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
