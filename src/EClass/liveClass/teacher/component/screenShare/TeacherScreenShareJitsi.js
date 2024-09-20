import React, { useState, useEffect, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { CircularProgress, Box } from '@mui/material';

export const TeacherScreenShareJitsi = ({ sharedScreenState }) => {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const jitsiApiRef = useRef(null); // Jitsi API 인스턴스 참조

  const handleApiReady = (externalApi) => {
    console.log('Jitsi Meet API is ready', externalApi);
    jitsiApiRef.current = externalApi; // Jitsi API 인스턴스를 저장
    setIsLoading(false); // API 준비가 완료되면 로딩 상태를 false로 설정
  };

  useEffect(() => {
    // 공유 상태가 바뀔 때 연결 관리
    if (!sharedScreenState && jitsiApiRef.current) {
      console.log('Closing Jitsi connection');
      jitsiApiRef.current.dispose(); // JitsiMeeting 인스턴스 정리
      jitsiApiRef.current = null; // 인스턴스를 null로 초기화
    }
  }, [sharedScreenState]);

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh',
            margin: '20px 10px 0 0',
            border: '1px solid grey',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!jitsiApiRef.current && (
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
