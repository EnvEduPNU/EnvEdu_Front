import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveTeacherComponent = () => {
  const localVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");

    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);
    client.connect({}, () => {
      console.log("Connected to STOMP");
      client.subscribe("/topic/answer", (message) => {
        console.log("Received answer:", message.body);
        handleAnswer(JSON.parse(message.body));
      });
      client.subscribe("/topic/candidate", (message) => {
        console.log("Received candidate:", message.body);
        handleCandidate(JSON.parse(message.body));
      });
    });
    setStompClient(client);

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1280, height: 720, frameRate: 15 },
      });
      localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection();
      setPeerConnection(pc);

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending candidate:", event.candidate);
          sendSignal("/app/sendCandidate", { candidate: event.candidate });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

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
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(message.answer)
    );
  };

  const handleCandidate = async (message) => {
    if (peerConnection) {
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
