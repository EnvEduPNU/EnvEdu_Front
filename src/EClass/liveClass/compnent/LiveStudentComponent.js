import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";
import { v4 as uuidv4 } from "uuid";

const LiveStudentComponent = () => {
  const remoteVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);
    const newSessionId = uuidv4();
    console.log("세션 아이디 : ", newSessionId);

    setSessionId(newSessionId);
    registerSessionId(newSessionId);

    setStompClient(client);

    setPeerConnection(new RTCPeerConnection());

    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("Disconnected from STOMP");
        });
      }
      console.log("세션 해제");
      deleteSessionId(newSessionId);
      setSessionId("");
    };
  }, []);

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
    await peerConnection.setLocalDescription(answer);
    console.log("Created answer SDP:", answer);
    sendSignal(`/app/sendAnswer/${sessionId}`, { answer });
  };

  const handleCandidate = async (message) => {
    if (peerConnection && peerConnection.remoteDescription) {
      console.log("Received ICE candidate:", message.candidate);
      await peerConnection.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    } else {
      console.log(
        "Remote description not set. Candidate saved for later:",
        message.candidate
      );
      // 여기에 지연된 후보자를 추가하는 로직 구현 필요
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
