import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";

const LiveTeacherComponent = () => {
  const localVideoRef = useRef(null);
  const [stompClients, setStompClients] = useState({});
  const [peerConnections, setPeerConnections] = useState({});

  useEffect(() => {
    const fetchSessionIds = async () => {
      try {
        const response = await customAxios.get("/api/sessions/get-session-ids");
        const sessionIds = response.data;
        const clients = {};
        const peers = {};

        sessionIds.forEach((sessionId) => {
          const token = localStorage
            .getItem("access_token")
            .replace("Bearer ", "");
          const socket = new SockJS(
            `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
          );
          const stompClient = Stomp.over(socket);
          clients[sessionId] = stompClient;

          const pc = new RTCPeerConnection();
          peers[sessionId] = pc;

          setupStompClient(stompClient, pc, sessionId);
        });

        setStompClients(clients);
        setPeerConnections(peers);
      } catch (error) {
        console.error("Failed to fetch session IDs:", error);
        alert("Failed to fetch session IDs");
      }
    };

    fetchSessionIds();

    return () => {
      Object.values(stompClients).forEach((client) => {
        if (client.connected) {
          client.disconnect();
        }
      });
      Object.values(peerConnections).forEach((pc) => pc.close());
    };
  }, []);

  const setupStompClient = (client, pc, sessionId) => {
    client.connect({}, () => {
      console.log(`Connected to STOMP for session: ${sessionId}`);
      client.subscribe(`/topic/answer/${sessionId}`, (message) => {
        const { answer } = JSON.parse(message.body);
        pc.setRemoteDescription(new RTCSessionDescription(answer));
      });
      client.subscribe(`/topic/candidate/${sessionId}`, (message) => {
        const { candidate } = JSON.parse(message.body);
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      });
    });

    pc.ontrack = (event) => {
      console.log("Received remote stream");
      localVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        client.send(
          `/app/sendCandidate/${sessionId}`,
          {},
          JSON.stringify({ candidate: event.candidate })
        );
      }
    };
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1280, height: 720, frameRate: 15 },
      });
      localVideoRef.current.srcObject = stream;

      Object.values(peerConnections).forEach((pc) => {
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        pc.createOffer().then((offer) => {
          pc.setLocalDescription(offer);
          const sessionId = Object.keys(peerConnections).find(
            (key) => peerConnections[key] === pc
          );
          if (sessionId) {
            stompClients[sessionId].send(
              `/app/sendOffer/${sessionId}`,
              {},
              JSON.stringify({ offer })
            );
          }
        });
      });
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert("Screen sharing is not supported on this device.");
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
