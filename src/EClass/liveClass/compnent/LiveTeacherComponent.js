import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveTeacherComponent = (props) => {
  const localVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  const localStream = useRef(null);
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
      if (client) {
        client.disconnect();
      }
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

  const startScreenShare = () => {
    console.log("스크린 쉐어 시작");
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach((track) => {
          for (const peerId in peerConnections) {
            peerConnections[peerId].addTrack(track, localStream.current);
          }
        });
      });
  };

  const handleSignal = (signal) => {
    const { from, sdp, candidate } = signal;

    console.log("from : " + from);
    console.log("session id : " + sessionId);

    // if (from === sessionId) return;
    console.log("from 이 어디야 : {}", from);

    if (!peerConnections[from]) {
      createPeerConnection(from);
    }

    const pc = peerConnections[from];

    if (sdp) {
      console.log("sdp 는 있어? : {}", sdp);

      pc.setRemoteDescription(new RTCSessionDescription(sdp)).then(() => {
        if (sdp.type === "offer") {
          console.log("setRemoteDescription 되나");
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
      console.log("아이스 캔디데잇");

      pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ice candidate 이다 :  {}", event.candidate);

        sendSignal({
          type: "candidate",
          candidate: event.candidate,
          from: sessionId,
          to: peerId,
        });
      }
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });
    }

    setPeerConnections((prev) => ({ ...prev, [peerId]: pc }));
  };

  const sendSignal = (signal) => {
    if (stompClient) {
      console.log("시그널은 보내지나 ");
      stompClient.send(
        `/app/screen-share/${sessionId}`,
        {},
        JSON.stringify(signal)
      );
    }
  };

  return (
    <div>
      <button onClick={startScreenShare}>Start Screen Share</button>
      <h3>Local Stream (Your screen)</h3>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default LiveTeacherComponent;
