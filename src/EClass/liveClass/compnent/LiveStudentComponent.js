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

      stompClient.connect({}, () => {
        stompClient.subscribe(`/topic/${sessionId}`, (message) => {
          const signal = JSON.parse(message.body);

          console.log("커넥션 되나 : {}", signal);

          handleSignal(signal);
        });
      });
    }
  }, [flag]);

  const handleSignal = (signal) => {
    const { from, sdp, candidate } = signal;

    console.log("from 이 어디야 : {}", from);

    if (from === sessionId) return;

    if (!peerConnection) {
      createPeerConnection(from);
    }

    const pc = peerConnection;

    if (sdp) {
      console.log("sdp 는 있어? : {}", sdp);

      pc.setRemoteDescription(new RTCSessionDescription(sdp)).then(() => {
        if (sdp.type === "offer") {
          pc.createAnswer().then((answer) => {
            console.log("anwser 보내는곳 : {}", answer);

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
      console.log("아이스 캔디데잇");

      pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      console.log("피어 커넥션 생성");

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
      console.log("온트랙");

      remoteVideoRef.current.srcObject = event.streams[0];
    };

    setPeerConnection(pc);
  };

  const sendSignal = (signal) => {
    if (stompClient) {
      console.log("샌드 시그널");

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
