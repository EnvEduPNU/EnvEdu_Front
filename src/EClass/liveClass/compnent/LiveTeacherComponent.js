import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveTeacherComponent = () => {
  const localVideoRef = useRef(null);
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
        client.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (stompClient && flag) {
      setFlag(false);
      const pc = new RTCPeerConnection();
      setPeerConnection(pc);
    }
  }, [flag]);

  useEffect(() => {
    if (peerConnection) {
      stompClient.connect({}, () => {
        console.log("Connected to STOMP");

        stompClient.subscribe("/topic/answer", (message) => {
          console.log("Received answer:", message.body);
          handleAnswer(JSON.parse(message.body));
        });
        stompClient.subscribe("/topic/candidate", (message) => {
          console.log("Received candidate:", message.body);
          handleCandidate(JSON.parse(message.body));
        });
      });
    }
  }, [peerConnection]);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1280, height: 720, frameRate: 15 },
      });
      localVideoRef.current.srcObject = stream;

      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending candidate:", event.candidate);
          sendSignal("/app/sendCandidate", { candidate: event.candidate });
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      console.log("Sending offer:", offer);
      sendSignal("/app/sendOffer", { offer });
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert("Screen sharing is not supported on this device.");
    }
  };

  const sendSignal = (destination, message) => {
    console.log(`Sending signal to ${destination}:`, message);
    stompClient.send(destination, {}, JSON.stringify(message));
  };

  const handleAnswer = async (message) => {
    if (peerConnection) {
      console.log("똑바로 보내고 있나");
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(message.answer)
      );
    }
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
      <button onClick={startScreenShare}>Start Screen Share</button>
      <div>
        <h3>Local Stream (Your screen)</h3>
        <video ref={localVideoRef} autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default LiveTeacherComponent;
