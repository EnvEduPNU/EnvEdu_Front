import React, { useEffect, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

export const TeacherScreenShareJitsi = ({
  sharedScreenState,
  setSharedScreenState,
  setIsLoading,
}) => {
  const jitsiApiRef = useRef(null); // Jitsi API 인스턴스 참조

  const handleApiReady = (externalApi) => {
    if (!jitsiApiRef.current) {
      console.log('Jitsi Meet API is ready', externalApi);
      jitsiApiRef.current = externalApi; // Jitsi API 인스턴스를 저장
      setIsLoading(false); // 로딩 완료되면 false로 설정

      // 회의 종료 이벤트 핸들러 등록
      // externalApi.addListener('videoConferenceLeft', handleConferenceLeft);
    }
  };

  // 회의 종료 시 수행할 작업
  const handleConferenceLeft = () => {
    console.log('회의가 종료되었습니다.');
    setSharedScreenState(false); // 화면 공유 상태 false로 설정
  };

  useEffect(() => {
    // 화면 공유 시작 시 로딩 상태로 설정
    setIsLoading(true);

    // 컴포넌트가 언마운트되거나 sharedScreenState가 false일 때 연결 닫기
    return () => {
      if (!sharedScreenState && jitsiApiRef.current) {
        console.log('Cleaning up Jitsi API connection');
        jitsiApiRef.current.removeListener(
          'videoConferenceLeft',
          handleConferenceLeft,
        );
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
    </div>
  );
};
