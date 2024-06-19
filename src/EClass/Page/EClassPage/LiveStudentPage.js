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
      console.log("Connected to STOMP");
      client.subscribe("/topic/offer", (message) => {
        console.log("Received offer:", message.body);
        handleOffer(JSON.parse(message.body));
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

  const sendSignal = (destination, message) => {
    if (stompClient && stompClient.connected) {
      console.log(`Sending signal to ${destination}:`, message);
      stompClient.send(destination, {}, JSON.stringify(message));
    } else {
      console.error("STOMP client is not connected");
    }
  };

  const handleOffer = async (message) => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending candidate:", event.candidate);
        sendSignal("/app/sendCandidate", { candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track", event.streams);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    await pc.setRemoteDescription(new RTCSessionDescription(message.offer));
    console.log("Set remote description");

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log("Created and set local description");

    sendSignal("/app/sendAnswer", { answer });
  };

  const handleCandidate = async (message) => {
    if (peerConnection) {
      console.log("Adding ICE candidate:", message.candidate);
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
