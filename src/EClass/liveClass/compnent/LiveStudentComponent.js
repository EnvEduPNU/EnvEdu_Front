import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveStudentComponent = () => {
  const remoteVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");

    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe("/topic/offer", (message) =>
        handleOffer(JSON.parse(message.body))
      );
      client.subscribe("/topic/candidate", (message) =>
        handleCandidate(JSON.parse(message.body))
      );
    });
    setStompClient(client);
  }, []);

  const sendSignal = (destination, message) => {
    stompClient.send(destination, {}, JSON.stringify(message));
  };

  const handleOffer = async (message) => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal("/app/sendCandidate", { candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    await pc.setRemoteDescription(new RTCSessionDescription(message.offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    sendSignal("/app/sendAnswer", { answer });
  };

  const handleCandidate = async (message) => {
    await peerConnection.addIceCandidate(
      new RTCIceCandidate(message.candidate)
    );
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
