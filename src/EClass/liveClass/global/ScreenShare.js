import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const ScreenShare = ({
  sessionId,
  setSessionIdState,
  onScreenShareStatusChange,
  onClassProcessEnd,
}) => {
  const remoteVideoRef = useRef(null);
  const stompClient = useRef(null);
  const peerConnection = useRef(null);
  const iceConnectionCheckInterval = useRef(null);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [screenShareStatus, setScreenShareStatus] = useState(true);

  useEffect(() => {
    stompClientConnectionInit();
    peerConnectionInit();

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log("STOMP 연결 해제됨");
        });
      }
      if (iceConnectionCheckInterval.current) {
        clearInterval(iceConnectionCheckInterval.current);
      }
    };
  }, []);

  const stompClientConnectionInit = () => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    stompClient.current = client;

    stompClient.current.connect({}, () => {
      console.log("STOMP 클라이언트가 세션 ID로 연결됨: " + sessionId);

      stompClient.current.subscribe(`/topic/offer/${sessionId}`, (message) => {
        console.log("오퍼 수신:", message.body);
        handleOffer(JSON.parse(message.body));
      });
      stompClient.current.subscribe(
        `/topic/candidate/${sessionId}`,
        (message) => {
          console.log("후보 수신:", message.body);
          handleCandidate(JSON.parse(message.body));
        }
      );
      stompClient.current.subscribe(`/topic/stopShare/${sessionId}`, () => {
        console.log("화면 공유 중지 수신");
        handleStopShare();
      });
    });
  };

  const peerConnectionInit = () => {
    peerConnection.current = new RTCPeerConnection();

    if (peerConnection.current) {
      console.log(
        "RTCPeerConnection 초기화 완료: " +
          JSON.stringify(peerConnection.current, null, 2)
      );

      peerConnection.current.oniceconnectionstatechange = () => {
        if (
          peerConnection.current.iceConnectionState === "disconnected" ||
          peerConnection.current.iceConnectionState === "failed" ||
          peerConnection.current.iceConnectionState === "closed"
        ) {
          console.log(
            "ICE 연결 상태가 'disconnected', 'failed', 또는 'closed'입니다."
          );
          handleIceConnectionStateChange();
        }
      };

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("ICE 후보 전송");
          sendSignal(`/app/sendCandidate/${sessionId}`, {
            candidate: event.candidate,
          });
        }
      };
    }
  };

  const handleStopShare = () => {
    console.log("화면 공유 중지 처리");
    if (peerConnection.current) {
      peerConnection.current.close();
      remoteVideoRef.current.srcObject = null;
    }
    onScreenShareStatusChange(false);
  };

  const handleIceConnectionStateChange = () => {
    remoteVideoRef.current.srcObject = null;
    onClassProcessEnd();
  };

  const sendSignal = (destination, message) => {
    console.log(`신호 전송 중 ${destination}:`, message);
    stompClient.current.send(destination, {}, JSON.stringify(message));
  };

  const handleOffer = async (message) => {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(message.offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    sendSignal(`/app/sendAnswer/${sessionId}`, { answer });
  };

  const handleCandidate = async (message) => {
    if (peerConnection.current) {
      console.log("ICE 후보 추가 중");
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    }
  };

  const handleCanPlay = () => {
    setIsVideoReady(true);
  };

  return (
    <div>
      {!screenShareStatus && <p>화면 공유가 종료되었습니다.</p>}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        onCanPlay={handleCanPlay}
        style={{
          display: screenShareStatus && isVideoReady ? "block" : "none",
        }}
      />
    </div>
  );
};

export default ScreenShare;
