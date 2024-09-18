import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import { useLiveClassPartStore } from "../../../store/LiveClassPartStore";
import { customAxios } from "../../../../../Common/CustomAxios";

export const TeacherScreenShare = ({
  eClassUuid,
  setSharedScreenState,
  sharedScreenState,
  sessionIds,
}) => {
  const localVideoRef = useRef(null);
  const stompClients = useRef({});
  const peerConnections = useRef({});
  const sessionIdCheck = useRef(false);
  const screenStatusStompClients = useRef({});

  const addSessionId = useLiveClassPartStore((state) => state.addSessionId);
  const removeSessionId = useLiveClassPartStore(
    (state) => state.removeSessionId
  );
  const updateShareStatus = useLiveClassPartStore(
    (state) => state.updateShareStatus
  );
  const hasSessionId = useLiveClassPartStore((state) => state.hasSessionId);

  useEffect(() => {
    fetchSessionIds();
    screenShareStatusStompClient();

    return () => {
      Object.values(stompClients.current).forEach((client) => {
        if (client.connected) {
          client.disconnect();
        }
      });
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      sessionIdCheck.current = false;
    };
  }, [sessionIds]);

  const fetchSessionIds = async () => {
    try {
      const clients = {};
      const peers = {};

      console.log("참여한 학생 : ", JSON.stringify(sessionIds, null, 2));

      sessionIds.forEach((sessionId) => {
        const token = localStorage
          .getItem("access_token")
          .replace("Bearer ", "");
        const socket = new SockJS(
          `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
        );
        const stompClient = new Client({ webSocketFactory: () => socket });

        clients[sessionId] = stompClient;

        const pc = new RTCPeerConnection();
        peers[sessionId] = pc;

        sessionIdCheck.current = true;

        setupStompClient(stompClient, pc, sessionId);

        if (!hasSessionId(sessionId)) {
          addSessionId(sessionId);
        }
      });

      stompClients.current = clients;
      peerConnections.current = peers;
    } catch (error) {
      console.error("Failed to fetch session IDs:", error);
      alert("Failed to fetch session IDs");
    }
  };

  const screenShareStatusStompClient = () => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=${token}`
    );

    screenStatusStompClients.current = new Client({ webSocketFactory: () => socket });

    screenStatusStompClients.current.connect({}, () => {
      screenStatusStompClients.current.subscribe(
        `/topic/screen-share-status`,
        (messages) => {
          const message = messages.body;
        }
      );
    });
  };

  const setupStompClient = (client, pc, sessionId) => {
    if (peerConnections.current) {
      client.connect({}, () => {
        console.log(`Connected to STOMP for session: ${sessionId}`);
        client.subscribe(`/topic/answer/${sessionId}`, async (message) => {
          const { answer } = JSON.parse(message.body);
          if (answer) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
              console.log(
                `Remote description set successfully for session: ${sessionId}`
              );
            } catch (error) {
              console.error(
                `Error setting remote description for session: ${sessionId}`,
                error
              );
            }
          }
        });

        client.subscribe(`/topic/candidate/${sessionId}`, async (message) => {
          const { candidate } = JSON.parse(message.body);
          if (candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
              console.log(
                `ICE candidate added successfully for session: ${sessionId}`
              );
            } catch (error) {
              console.error(
                `Error adding ICE candidate for session: ${sessionId}`,
                error
              );
            }
          }
        });
      });
    }

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

  const sendMessage = (status) => {
    const message = {
      screenStatus: status,
    };
    screenStatusStompClients.current.send(
      "/app/screen-share-status",
      {},
      JSON.stringify(message)
    );
  };

  const startScreenShare = async () => {
    if (sharedScreenState) {
      await stopScreenShare();
    }

    setSharedScreenState(true);

    try {
      if (sessionIdCheck.current === true) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1280, height: 680, frameRate: 15 },
        });
        localVideoRef.current.srcObject = stream;

        Object.values(peerConnections.current).forEach((pc) => {
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
            // 화면 공유 중지 누른 후
            track.onended = () => {
              console.log("Screen sharing stopped");
              sessionIdCheck.current = false;
            };
          });

          pc.createOffer().then((offer) => {
            pc.setLocalDescription(offer);
            const sessionId = Object.keys(peerConnections.current).find(
              (key) => peerConnections.current[key] === pc
            );
            if (sessionId) {
              stompClients.current[sessionId].send(
                `/app/sendOffer/${sessionId}`,
                {},
                JSON.stringify({ offer })
              );
              updateShareStatus(sessionId, true);
            }
          });
        });

        const shareStart = "start";
        sendMessage(shareStart);
      } else {
        alert("화면을 공유할 사람이 없습니다!");
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      setSharedScreenState(false);
    }
  };

  const stopScreenShare = async () => {
    try {
      const stream = localVideoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;

        for (const [sessionId, pc] of Object.entries(peerConnections.current)) {
          updateShareStatus(sessionId, false);
          // stompClients.current[sessionId].send(
          //   `/app/stopShare/${sessionId}`,
          //   {},
          //   JSON.stringify({ message: "stop" })
          // );
          pc.close();
          delete peerConnections.current[sessionId];
        }

        sessionIdCheck.current = false;
      }
      const shareStop = "stop";
      sendMessage(shareStop);

      setSharedScreenState(false);
    } catch (error) {
      console.error("Error stopping screen share:", error);
      setSharedScreenState(false);
    }
  };

  return (
    <>
      {sharedScreenState && (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "63rem",
            minHeight: "40rem",
          }}
        />
      )}

      <button
        onClick={startScreenShare}
        style={{
          margin: "10px 0 ",
          width: "18%",
          marginRight: 1,
          fontFamily: "'Asap', sans-serif",
          fontWeight: "600",
          fontSize: "0.9rem",
          color: "grey",
          backgroundColor: "#feecfe",
          borderRadius: "2.469rem",
          border: "none",
        }}
      >
        화면 공유
      </button>
      <button
        onClick={stopScreenShare}
        style={{
          margin: "10px 0 0 10px ",
          width: "18%",
          marginRight: 1,
          fontFamily: "'Asap', sans-serif",
          fontWeight: "600",
          fontSize: "0.9rem",
          color: "grey",
          backgroundColor: "#feecfe",
          borderRadius: "2.469rem",
          border: "none",
        }}
      >
        공유 중지
      </button>
    </>
  );
};
