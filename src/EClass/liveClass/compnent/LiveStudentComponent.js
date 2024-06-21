import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";
import { v4 as uuidv4 } from "uuid"; // UUID 패키지를 사용하여 세션 ID 생성

const LiveStudentComponent = () => {
  const remoteVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [sessionId, setSessionId] = useState(""); // 세션 ID 상태 추가

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    const newSessionId = uuidv4(); // 새 세션 ID 생성

    console.log("세션 아이디 : ", newSessionId);

    setSessionId(newSessionId);
    registerSessionId(newSessionId); // DB에 세션 ID 등록

    setStompClient(client);
    setPeerConnection(new RTCPeerConnection());

    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("Disconnected from STOMP");
        });
      }

      console.log("세션 해제");
      // 컴포넌트 해제 시 세션 아이디도 삭제해줌
      deleteSessionId(newSessionId);
      setSessionId("");
    };
  }, []);

  // 세션 ID를 DB에 등록하는 함수
  const registerSessionId = async (sessionId) => {
    try {
      await customAxios.post("/api/sessions/register-session", {
        sessionId: sessionId,
      });
      console.log("Session ID registered:", sessionId);
    } catch (error) {
      console.error("Error registering session ID:", error);
    }
  };

  // 세션 ID를 DB에서 삭제하는 함수
  const deleteSessionId = async (sessionId) => {
    try {
      await customAxios.delete("/api/sessions/delete-session", {
        sessionId: sessionId,
      });
      console.log("Session ID deleted:", sessionId);
    } catch (error) {
      console.error("Error deleting session ID:", error);
    }
  };

  useEffect(() => {
    if (peerConnection && stompClient && sessionId) {
      console.log("Initializing STOMP client and PeerConnection");
      stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/offer/${sessionId}`, (message) => {
          console.log("Received offer:", message.body);
          handleOffer(JSON.parse(message.body));
        });
        stompClient.subscribe(`/topic/candidate/${sessionId}`, (message) => {
          console.log("Received candidate:", message.body);
          handleCandidate(JSON.parse(message.body));
        });
      });

      peerConnection.ontrack = (event) => {
        console.log("Received remote stream", event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
        console.log(
          "Video element srcObject set",
          remoteVideoRef.current.srcObject
        );
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate");
          sendSignal(`/app/sendCandidate/${sessionId}`, {
            candidate: event.candidate,
          });
        }
      };
    }
  }, [peerConnection, stompClient, sessionId]);

  const sendSignal = (destination, message) => {
    console.log(`Sending signal to ${destination}:`, message);
    stompClient.send(destination, {}, JSON.stringify(message));
  };

  const handleOffer = async (message) => {
    console.log("Received offer SDP:", message.offer);
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(message.offer)
    );
    const answer = await peerConnection.createAnswer();
    console.log("Created answer SDP:", answer);
    await peerConnection.setLocalDescription(answer);
    sendSignal(`/app/sendAnswer/${sessionId}`, { answer });
  };

  const handleCandidate = async (message) => {
    if (peerConnection) {
      console.log("Received ICE candidate:", message.candidate);
      await peerConnection.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    }
  };

  return (
    <div>
      <div>
        <h3>Remote Stream (Shared screen)</h3>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          width="640"
          height="480"
        ></video>
      </div>
    </div>
  );
};

export default LiveStudentComponent;
