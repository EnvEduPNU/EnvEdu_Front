import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveStudentComponent = () => {
  const remoteVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");

    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    setStompClient(client);
    setFlag(true);

    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("Disconnected from STOMP");
        });
      }
    };
  }, []);

  useEffect(() => {
    if (stompClient && flag) {
      console.log("버퍼대신");
      setFlag(false);
      const pc = new RTCPeerConnection();
      setPeerConnection(pc);

      stompClient.connect({}, () => {
        stompClient.subscribe("/topic/offer", (message) => {
          console.log("handleOffer에 들어갈 message:", message.body);
          handleOffer(JSON.parse(message.body));
        });
        stompClient.subscribe("/topic/candidate", (message) => {
          console.log("handleCandidate에 들어갈 message:", message.body);
          handleCandidate(JSON.parse(message.body));
        });
      });
    }
  }, [flag]);

  const sendSignal = (destination, message) => {
    console.log("샌드시그널");
    stompClient.send(destination, {}, JSON.stringify(message));
  };

  const handleOffer = async (message) => {
    console.log("샌드오퍼");

    peerConnection.onicecandidate = (event) => {
      console.log("온 아이스 candidate : {}", event.candidate);
      if (event.candidate) {
        sendSignal("/app/sendCandidate", { candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("온트랙");
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(message.offer)
    );

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    sendSignal("/app/sendAnswer", { answer });
  };

  const handleCandidate = async (message) => {
    if (peerConnection) {
      console.log("핸들 캔디데이트 : {}", message.candidate);
      await peerConnection.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    }
  };

  return (
    <div>
      <div>
        <h3>Remote Stream (Shared screen)</h3>
        <video ref={remoteVideoRef} autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default LiveStudentComponent;
