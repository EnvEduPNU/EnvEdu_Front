import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";

const LiveTeacherComponent = () => {
  const localVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState({});
  const [peerConnections, setPeerConnections] = useState({}); // 여러 PeerConnection 객체 관리
  const [sessionIds, setSessionIds] = useState([]); // 세션 ID 배열 상태
  const [activeSessionId, setActiveSessionId] = useState(""); // 활성화된 세션 ID

  useEffect(() => {
    // 1. 세션 아이디 들을 가져와서 각 세션 마다 소켓 생성
    fetchSessionIds().then((ids) => {
      setSessionIds(ids);
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  // 2. 각 세션의 소켓 마다 peerConnection 생성
  useEffect(() => {
    if (stompClient.length > 0 && sessionIds.length > 0) {
      const newPeerConnections = { ...peerConnections };

      stompClient.forEach(({ sessionId, client }) => {
        const pc = new RTCPeerConnection();
        newPeerConnections[sessionId] = pc;

        client.connect({}, () => {
          console.log(`Connected to STOMP for session: ${sessionId}`);
          client.subscribe(`/topic/answer/${sessionId}`, (message) => {
            handleAnswer(JSON.parse(message.body), sessionId);
          });
          client.subscribe(`/topic/candidate/${sessionId}`, (message) => {
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

      setPeerConnections(newPeerConnections);
    }
  }, [stompClient, sessionIds]);

  // db의 세션 아이디를 받아서 각 세션 마다 소켓 생성 메서드
  const fetchSessionIds = async () => {
    try {
      const response = await customAxios.get("/api/sessions/get-session-ids");
      const sessionIds = response.data;

      console.log("받아온 세션들 : " + sessionIds);

      let clientTemp = [];

      sessionIds.forEach((sessionId) => {
        const token = localStorage
          .getItem("access_token")
          .replace("Bearer ", "");
        const socket = new SockJS(
          `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
        );
        const client = {};
        client[sessionId] = Stomp.over(socket);
        clientTemp.push(client);
      });

      setStompClient(clientTemp);

      return sessionIds;
    } catch (error) {
      console.error("Failed to fetch session IDs:", error);
      alert("Failed to fetch session IDs");
      return [];
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1280, height: 720, frameRate: 15 },
      });

      Object.keys(peerConnections).forEach((sessionId) => {
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
