import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";

const LiveTeacherComponent = () => {
  const localVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnections, setPeerConnections] = useState({}); // 여러 PeerConnection 객체 관리
  const [sessionIds, setSessionIds] = useState([]); // 세션 ID 배열 상태
  const [activeSessionId, setActiveSessionId] = useState(""); // 활성화된 세션 ID

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);
    setStompClient(client);

    fetchSessionIds().then((ids) => {
      setSessionIds(ids);
      if (ids.length > 0) {
        setActiveSessionId(ids[0]); // 첫 번째 세션을 활성 세션으로 설정
      }
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  const fetchSessionIds = async () => {
    try {
      const response = await customAxios.get("/api/sessions/get-session-ids");
      console.log("받아온 세션들 : " + response.data);
      return response.data; // 세션 ID 배열 반환
    } catch (error) {
      console.error("Failed to fetch session IDs:", error);
      alert("Failed to fetch session IDs");
      return [];
    }
  };

  useEffect(() => {
    if (stompClient && sessionIds.length > 0) {
      let peerConnectionTotal = [];

      sessionIds.forEach((sessionId) => {
        const pc = new RTCPeerConnection();
        const peerConnectionTemp = {};
        peerConnectionTemp[sessionId] = pc;
        peerConnectionTotal.push(peerConnectionTemp);

        stompClient.connect({}, () => {
          console.log("Connected to STOMP");
          stompClient.subscribe(`/topic/answer/${sessionId}`, (message) => {
            handleAnswer(JSON.parse(message.body), sessionId);
          });
          stompClient.subscribe(`/topic/candidate/${sessionId}`, (message) => {
            handleCandidate(JSON.parse(message.body), sessionId);
          });
        });

        pc.ontrack = (event) => {
          if (sessionId === activeSessionId) {
            console.log("Received remote stream from active session");
            localVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignal(`/app/sendCandidate/${sessionId}`, {
              candidate: event.candidate,
            });
          }
        };
      });

      setPeerConnections(peerConnectionTotal);
    }
  }, [stompClient, sessionIds]);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1280, height: 720, frameRate: 15 },
      });

      Object.keys(peerConnections).forEach((sessionId) => {
        console.log("startScreenShare에서 session id : " + sessionId);

        const pc = peerConnections[sessionId];
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.createOffer().then((offer) => {
          pc.setLocalDescription(offer);
          sendSignal(`/app/sendOffer/${sessionId}`, { offer });
        });
      });

      if (activeSessionId) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert("Screen sharing is not supported on this device.");
    }
  };

  const sendSignal = (destination, message) => {
    console.log(`Sending signal to ${destination}:`, message);
    stompClient.send(destination, {}, JSON.stringify(message));
  };

  const handleAnswer = async (message, sessionId) => {
    const pc = peerConnections[sessionId];
    if (pc) {
      console.log(`Processing answer for session ${sessionId}`);
      await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
    }
  };

  const handleCandidate = async (message, sessionId) => {
    const pc = peerConnections[sessionId];
    if (pc) {
      console.log(`Processing candidate for session ${sessionId}`);
      await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
  };

  return (
    <div>
      <button onClick={startScreenShare}>Start Screen Share</button>
      <div>
        <h3>Local Stream (Your screen)</h3>
        <video ref={localVideoRef} autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default LiveTeacherComponent;
