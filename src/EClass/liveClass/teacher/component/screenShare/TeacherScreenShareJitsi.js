import React, { useEffect, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const TeacherScreenShareJitsi = ({
  sharedScreenState,
  setSharedScreenState,
  setIsLoading,
  eClassName,
}) => {
  const jitsiApiRef = useRef(null); // Jitsi API 인스턴스 참조
  const username = localStorage.getItem('username');

  const handleApiReady = (api) => {
    jitsiApiRef.current = api;
    setIsLoading(false); // 화면 공유 시작 시 로딩 상태 설정

    // API 이벤트 리스너 추가: 회의가 종료될 준비가 되었을 때
    api.on('readyToClose', () => {
      alert('회의가 종료되었습니다.');
      setSharedScreenState(false); // 화면 공유 상태를 false로 설정
    });
  };

  useEffect(() => {
    setIsLoading(true); // 화면 공유 시작 시 로딩 상태 설정

    // 컴포넌트가 언마운트되거나 sharedScreenState가 false일 때 연결 닫기
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose(); // JitsiMeeting 인스턴스 정리
        jitsiApiRef.current = null;
      }
    };
  }, [sharedScreenState]);

  return (
    <div style={{ margin: '20px 20px 0 0' }}>
      {sharedScreenState && (
        <JitsiMeeting
          domain="meet.jit.si"
          // 나중에 eClassName으로 바꾸고 학생도 바꿔주기
          roomName="myCustomRoom"
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          }}
          userInfo={{
            displayName: username,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '600px';
            iframeRef.style.width = '100%';
          }}
          onApiReady={handleApiReady}
        />
      )}
    </div>
  );
};

export default TeacherScreenShareJitsi;
