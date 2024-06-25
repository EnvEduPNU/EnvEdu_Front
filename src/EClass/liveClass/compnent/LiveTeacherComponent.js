import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";
import TeacherAssignmentTable from "./table/TeacherAssignmentTable";
import TeacherAssignmentCheckTable from "./table/TeacherAssignmentCheckTable";
import { Typography } from "@mui/material";

const LiveTeacherComponent = () => {
  const localVideoRef = useRef(null);
  const stompClients = useRef({});
  const peerConnections = useRef({});
  const sharedStream = useRef(null); // 공유중인 스트림을 저장하는 ref
  const sessionIdCheck = useRef(false);

  useEffect(() => {
    // 학생의 참여와 퇴장을 소켓으로 받아오는 메서드
    studentCheckStompClient();

    // 초기 학생들 세션을 소켓을 세팅하는 메서드
    fetchSessionIds();

    return () => {
      Object.values(stompClients.current).forEach((client) => {
        if (client.connected) {
          client.disconnect();
        }
      });
      Object.values(peerConnections.current).forEach((pc) => pc.close());

      sessionIdCheck.current = false;
    };
  }, []);

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

        sessionIdCheck.current = true;

        setupStompClient(stompClient, pc, sessionId);
      });

      stompClients.current = clients;
      peerConnections.current = peers;
    } catch (error) {
      console.error("Failed to fetch session IDs:", error);
      alert("Failed to fetch session IDs");
    }
  };

  const studentCheckStompClient = () => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/changes`, (messages) => {
        const message = messages.body;

        console.log("확인좀 : " + message.includes("입장"));

        if (message.includes("입장")) {
          alert("학생이 입장 했습니다.");
          // 현재 화면이 공유 중이면 지금까지의 스트림을 공유
          if (sharedStream.current) {
            setupStompClientForNewStudent(
              message.sessionId,
              sharedStream.current
            );
          }
          // 맨처음 학생이면 재랜더링해서 초기화
          else {
            window.location.reload();
          }
        }

        if (message.includes("퇴장")) {
          alert("학생이 퇴장 했습니다.");
        }
      });
    });
  };

  // 추가로 들어온 학생에게 넘길 소켓 생성
  const setupStompClientForNewStudent = (sessionId, stream) => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const stompClient = Stomp.over(socket);
    stompClients.current[sessionId] = stompClient;

    const pc = new RTCPeerConnection();
    peerConnections.current[sessionId] = pc;
    setupStompClient(stompClient, pc, sessionId);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
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

  const startScreenShare = async () => {
    try {
      if (sessionIdCheck.current === true) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1280, height: 720, frameRate: 15 },
        });
        localVideoRef.current.srcObject = stream;
        sharedStream.current = stream; // 스트림 저장

        Object.values(peerConnections.current).forEach((pc) => {
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
            // 화면 공유 중지 누른 후
            track.onended = () => {
              console.log("Screen sharing stopped");
              sessionIdCheck.current = false;
              window.location.reload();
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
            }
          });
        });
      } else {
        alert("화면을 공유할 사람이 없습니다!");
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert("Screen sharing is not supported on this device.");
    }
  };

  return (
    <>
      {/* 수업 셋리스트 & step 제출 리스트 블럭 */}
      <div style={{ width: "25%", marginRight: "30px" }}>
        <TeacherAssignmentTable />
        <TeacherAssignmentCheckTable />
      </div>

      {/* 화면 공유 블럭 */}
      <div style={{ display: "inline-block", width: "100%", height: "100%" }}>
        {" "}
        <h2>{"[ step2 ]"}</h2>
        <div style={{ border: "1px solid grey" }}>
          {/* {sessionIdCheck.current === true ? (
            ""
          ) : (
            <div
              style={{
                display: "flex", // Flexbox 레이아웃 사용
                justifyContent: "center", // 수평 중앙 정렬
                alignItems: "center", // 수직 중앙 정렬
                minHeight: "430px", // 최소 높이 설정
                width: "100%", // 너비 100%
              }}
            >
              <Typography variant="h6">수업 시작 전입니다.</Typography>
          )} */}

          <video ref={localVideoRef} autoPlay playsInline></video>
        </div>
        <button
          onClick={startScreenShare}
          style={{ margin: "10px 0 ", width: "20%" }}
        >
          화면 공유
        </button>
      </div>
    </>
  );
};

export default LiveTeacherComponent;
