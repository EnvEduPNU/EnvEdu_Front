import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

export const StudentScreenShareJitsi = () => {
  return (
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
        displayName: "사용자 이름",
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = "500px";
      }}
      onApiReady={(externalApi) => {
        console.log("Jitsi Meet API is ready", externalApi);
      }}
    />
  );
};
