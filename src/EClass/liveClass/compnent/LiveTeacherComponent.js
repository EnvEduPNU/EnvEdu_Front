import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";

const LiveTeacherComponent = () => {
  const localVideoRef = useRef(null);
  const [peerConnections, setPeerConnections] = useState({});
  const [stompClients, setStompClients] = useState({});
  const [sessionIds, setSessionIds] = useState([]);

  useEffect(() => {
    fetchSessionIds().then((ids) => {
      setSessionIds(ids);
    });

    return () => {
      Object.values(stompClients).forEach((client) => {
        if (client) {
          client.disconnect();
        }
      });
    };
  }, []);

  const fetchSessionIds = async () => {
    try {
      const response = await customAxios.get("/api/sessions/get-session-ids");
      console.log("받아온 세션들 : " + response.data);
      return response.data;
    } catch (error) {
      console.error("세션 ID를 가져오는 데 실패했습니다:", error);
      alert("세션 ID를 가져오는 데 실패했습니다");
      return [];
    }
  };

  useEffect(() => {
    if (sessionIds.length > 0) {
      const newPeerConnections = {};
      const newStompClients = {};

      sessionIds.forEach((sessionId) => {
        const pc = new RTCPeerConnection();
        newPeerConnections[sessionId] = pc;

        const token = localStorage
          .getItem("access_token")
          .replace("Bearer ", "");
        const socket = new SockJS(
          `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
        );
        const client = Stomp.over(socket);

        client.connect({}, () => {
          console.log(`STOMP에 연결됨: 세션 ${sessionId}`);
          client.subscribe(`/topic/answer/${sessionId}`, (message) => {
            handleAnswer(JSON.parse(message.body), sessionId);
          });
          client.subscribe(`/topic/candidate/${sessionId}`, (message) => {
            handleCandidate(JSON.parse(message.body), sessionId);
          });
        });

        newStompClients[sessionId] = client;

        pc.ontrack = (event) => {
          console.log("활성 세션에서 원격 스트림 수신");
          localVideoRef.current.srcObject = event.streams[0];
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignal(client, `/app/sendCandidate/${sessionId}`, {
              candidate: event.candidate,
            });
          }
        };
      });

      setPeerConnections(newPeerConnections);
      setStompClients(newStompClients);
    }
  }, [sessionIds]);

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
          sendSignal(stompClients[sessionId], `/app/sendOffer/${sessionId}`, {
            offer,
          });
        });
      });

      localVideoRef.current.srcObject = stream;
    } catch (error) {
      console.error("화면 공유 중 오류 발생:", error);
      alert("이 장치에서는 화면 공유를 지원하지 않습니다.");
    }
  };

  const sendSignal = (client, destination, message) => {
    console.log(`신호를 ${destination}로 보냄:`, message);
    client.send(destination, {}, JSON.stringify(message));
  };

  const handleAnswer = async (message, sessionId) => {
    const pc = peerConnections[sessionId];
    if (pc) {
      console.log(`세션 ${sessionId}의 답변 처리 중`);
      await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
    }
  };

  const handleCandidate = async (message, sessionId) => {
    const pc = peerConnections[sessionId];
    if (pc) {
      console.log(`세션 ${sessionId}의 후보 처리 중`);
      await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
  };

  return (
    <div>
      <button onClick={startScreenShare}>화면 공유 시작</button>
      <div>
        <h3>로컬 스트림 (내 화면)</h3>
        <video ref={localVideoRef} autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default LiveTeacherComponent;
