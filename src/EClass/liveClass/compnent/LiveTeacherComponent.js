import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveTeacherComponent = (props) => {
  const localVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  const localStream = useRef(null);
  const sessionId = props.newSessionId;
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token")?.replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    setStompClient(client);
    setFlag(true);

    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("STOMP 클라이언트 연결 끊김");
        });
      }
    };
  }, [sessionId]);

  useEffect(() => {
    if (stompClient && flag) {
      setFlag(false);

      stompClient.connect({}, () => {
        console.log("STOMP 클라이언트 연결됨");

        // 화면 공유 시작
        // startScreenShare();

        // 신호를 보내고 구독을 설정합니다.
        sendInitialSignal();

        stompClient.subscribe(`/topic/${sessionId}`, (message) => {
          const signal = JSON.parse(message.body);
          console.log("받은 시그널: ", signal);

          handleSignal(signal);
        });

        console.log("구독 시작: /topic/" + sessionId);
      });
    }
  }, [stompClient, flag]);

  const sendInitialSignal = () => {
    // 초기 신호를 보냅니다.
    sendSignal({
      type: "initial",
      from: sessionId,
      to: sessionId,
      sdp: null,
      candidate: null,
    });
  };

  const startScreenShare = () => {
    console.log("스크린 쉐어 시작");
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;

        Object.values(peerConnections).forEach((pc) => {
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
        });
      });
  };

  const handleSignal = (signal) => {
    const { from, sdp, candidate } = signal;

    if (from === sessionId) return; // 자기 자신이 보낸 시그널 무시

    if (!peerConnections[from]) {
      createPeerConnection(from);
    }

    const pc = peerConnections[from];

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
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`ICE candidate: ${JSON.stringify(event.candidate)}`);
        sendSignal({
          type: "candidate",
          candidate: event.candidate,
          from: sessionId,
          to: peerId,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("ontrack 이벤트 발생", event);
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
      console.log("시그널 보내기: ", signal);
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
