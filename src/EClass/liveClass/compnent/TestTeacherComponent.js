import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const TeacherStreamComponent = () => {
  const videoRef = useRef(null);
  const peerConnections = useRef({}); // 세션ID 별로 peer connection 저장
  const stompClient = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          // 모든 연결된 학생들에게 트랙을 추가
          Object.values(peerConnections.current).forEach((pc) => {
            pc.addTrack(track, stream);
          });
        });
      });

      stompClient.current.subscribe("/app/register", (message) => {
        const sessionId = message.body;
        const pc = createPeerConnection(sessionId);
        peerConnections.current[sessionId] = pc;
      });
    });

    const createPeerConnection = (sessionId) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          stompClient.current.send(
            `/app/sendCandidate/${sessionId}`,
            {},
            JSON.stringify({ candidate: event.candidate })
          );
        }
      };

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          stompClient.current.send(
            `/app/sendOffer/${sessionId}`,
            {},
            JSON.stringify({ offer: pc.localDescription })
          );
        });

      return pc;
    };

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
      Object.values(peerConnections.current).forEach((pc) => pc.close());
    };
  }, []);

  return (
    <div>
      <h3>Teacher's Live Stream (Shared Screen)</h3>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="640"
        height="480"
        muted
      ></video>
    </div>
  );
};

export default TeacherStreamComponent;
