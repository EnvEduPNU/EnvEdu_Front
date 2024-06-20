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
      setFlag(false);
      const pc = new RTCPeerConnection();
      setPeerConnection(pc);
    }
  }, [flag]);

  useEffect(() => {
    if (peerConnection) {
      stompClient.connect({}, () => {
        stompClient.subscribe("/topic/offer", (message) => {
          console.log("Received offer:", message.body);
          handleOffer(JSON.parse(message.body));
        });
        stompClient.subscribe("/topic/candidate", (message) => {
          console.log("Received candidate:", message.body);
          handleCandidate(JSON.parse(message.body));
        });
      });

      peerConnection.ontrack = (event) => {
        console.log("Received remote stream");
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate");
          sendSignal("/app/sendCandidate", { candidate: event.candidate });
        }
      };
    }
  }, [peerConnection]);

  const sendSignal = (destination, message) => {
    console.log(`Sending signal to ${destination}:`, message);
    stompClient.send(destination, {}, JSON.stringify(message));
  };

  const handleOffer = async (message) => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(message.offer)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendSignal("/app/sendAnswer", { answer });
  };

  const handleCandidate = async (message) => {
    if (peerConnection) {
      console.log("Adding ICE candidate");
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
