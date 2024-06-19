import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveStudentComponent = (props) => {
  const remoteVideoRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const teacherSessionId = props.teacherSessionId;
  const studentSessionId = props.studentSessionId;

  useEffect(() => {
    const token = localStorage.getItem("access_token")?.replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("STOMP 클라이언트 연결됨");

      setStompClient(client);

      client.subscribe(`/topic/${studentSessionId}`, (message) => {
        const signal = JSON.parse(message.body);
        console.log("받은 시그널: ", signal);

        handleSignal(signal);
      });

      console.log("구독 시작: /topic/" + studentSessionId);
    });

    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("STOMP 클라이언트 연결 끊김");
        });
      }
    };
  }, [props]);

  const handleSignal = (signal) => {
    const { from, sdp, candidate } = signal;

    if (from === studentSessionId) return; // 자기 자신이 보낸 시그널 무시

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
              from: studentSessionId,
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
          from: studentSessionId,
          to: peerId,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("ontrack 이벤트 발생", event);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    setPeerConnection(pc);
  };

  const sendSignal = (signal) => {
    if (stompClient) {
      console.log("시그널 보내기: ", signal);
      stompClient.send(
        `/app/screen-share/${studentSessionId}`,
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
