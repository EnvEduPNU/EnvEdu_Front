import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveStudentComponent = (props) => {
  const remoteVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [sessionId] = useState(props.newSessionId);
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
      if (client) client.disconnect();
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
        stompClient.subscribe(`/topic/${sessionId}`, (message) => {
          const signal = JSON.parse(message.body);
          handleSignal(signal);
        });
      });
    }
  }, [peerConnection]);

  const handleSignal = (signal) => {
    const { from, sdp, candidate } = signal;

    if (from === sessionId) return;

    if (!peerConnection) {
      createPeerConnection(from);
    }

    const pc = peerConnection;

    if (sdp) {
      pc.setRemoteDescription(new RTCSessionDescription(sdp)).then(() => {
        if (sdp.type === "offer") {
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            sendSignal({
              type: "answer",
              sdp: answer,
              from: sessionId,
              to: from,
            });
          });
        }
      });
    }

    if (candidate) {
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createPeerConnection = (peerId) => {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "candidate",
          candidate: event.candidate,
          from: sessionId,
          to: peerId,
        });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    setPeerConnection(pc);
  };

  const sendSignal = (signal) => {
    if (stompClient) {
      stompClient.send(
        `/app/screen-share/${sessionId}`,
        {},
        JSON.stringify(signal)
      );
    }
  };

  return (
    <div>
      <h3>Remote Stream (Shared screen)</h3>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default LiveStudentComponent;
