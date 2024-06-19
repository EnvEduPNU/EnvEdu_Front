import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveStudentComponent = () => {
  const remoteVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const sessionId = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");

    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      sessionId.current = client.ws._transport.url.split("/").slice(-1)[0];
      client.subscribe(`/topic/${sessionId.current}`, (message) => {
        const signal = JSON.parse(message.body);
        handleSignal(signal);
      });
    });

    return () => {
      if (client) client.disconnect();
    };
  }, []);

  const handleSignal = (signal) => {
    const { from, sdp, candidate } = signal;

    if (from === sessionId.current) return;

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
              from: sessionId.current,
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
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "candidate",
          candidate: event.candidate,
          from: sessionId.current,
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
        `/app/screen-share/${sessionId.current}`,
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
