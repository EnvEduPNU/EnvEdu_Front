import React, { useEffect, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

export const TeacherScreenShareJitsi = ({
  sharedScreenState,
  setIsLoading,
}) => {
  const jitsiApiRef = useRef(null); // Jitsi API 인스턴스 참조

  const handleApiReady = (externalApi) => {
    console.log('Jitsi Meet API is ready', externalApi);
    jitsiApiRef.current = externalApi; // Jitsi API 인스턴스를 저장
    setIsLoading(false); // 로딩 완료되면 false로 설정
  };

  useEffect(() => {
    // 화면 공유 시작 시 로딩 상태로 설정
    setIsLoading(true);

    // 컴포넌트가 언마운트되거나 공유 상태가 바뀔 때 연결 닫기
    return () => {
      if (jitsiApiRef.current) {
        console.log('Closing Jitsi connection');
        jitsiApiRef.current.dispose(); // JitsiMeeting 인스턴스 정리
        jitsiApiRef.current = null;
      }
    };
  }, [sharedScreenState]);

  return (
    <>
      {sharedScreenState && (
        <JitsiMeeting
          domain="meet.jit.si"
          roomName="myCustomRoom"
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          }}
          userInfo={{
            displayName: '사용자 이름',
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '585px'; // 원하는 높이로 설정
            iframeRef.style.width = '100%'; // 가로 크기를 100%로 설정 (화면에 맞춤)
          }}
          onApiReady={handleApiReady} // API가 준비되면 로딩 상태 업데이트
        />
      )}
    </>
  );
};
