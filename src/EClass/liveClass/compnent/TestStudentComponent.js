import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveStreamComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/screen-share", (message) => {
        const receivedData = JSON.parse(message.body);
        handleSignalingData(receivedData);
      });
    });

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    const handleSignalingData = (data) => {
      switch (data.type) {
        case "offer":
          handleOffer(data.offer);
          break;
        case "candidate":
          handleCandidate(data.candidate);
          break;
        case "answer":
          handleAnswer(data.answer);
          break;
        default:
          break;
      }
    };

    const handleOffer = async (offer) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      client.send(
        "/app/sendAnswer",
        {},
        JSON.stringify({ answer, type: "answer" })
      );
    };

    const handleAnswer = async (answer) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    };

    const handleCandidate = async (candidate) => {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    return () => {
      client.disconnect();
      peerConnection.close();
    };
  }, []);

  return (
    <div>
      <h3>Live Stream (Teacher's screen)</h3>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="640"
        height="480"
      ></video>
    </div>
  );
};

export default LiveStreamComponent;
