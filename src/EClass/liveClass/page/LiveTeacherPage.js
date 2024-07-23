import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";
import TeacherAssignmentTable from "../teacher/component/table/TeacherAssignmentTable";
import TeacherCourseStatusTable from "../teacher/component/table/TeacherCourseStatusTable";
import { Typography } from "@mui/material";
import { useLiveClassPartStore } from "../store/LiveClassPartStore";
import { TeacherStepShareButton } from "../teacher/component/button/TeacherStepShareButton";

export const LiveTeacherPage = () => {
  const localVideoRef = useRef(null);
  const stompClients = useRef({});
  const peerConnections = useRef({});
  const sessionIdCheck = useRef(false);
  const [sharedScreenState, setSharedScreenState] = useState(false);
  const [courseStep, setCourseStep] = useState();

  const addSessionId = useLiveClassPartStore((state) => state.addSessionId);
  const removeSessionId = useLiveClassPartStore(
    (state) => state.removeSessionId
  );
  const updateShareStatus = useLiveClassPartStore(
    (state) => state.updateShareStatus
  );

  const hasSessionId = useLiveClassPartStore((state) => state.hasSessionId);

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

  useEffect(() => {}, [sharedScreenState]);

  const fetchSessionIds = async () => {
    try {
      const response = await customAxios.get("/api/sessions/get-session-ids");
      const sessionIds = response.data;
      const clients = {};
      const peers = {};

      console.log("참여한 학생 : ", sessionIds);

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

  const studentCheckStompClient = () => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/changes`, (messages) => {
        const message = messages.body;
        const parsedMessage = JSON.parse(message);
        const messageBody = JSON.stringify(parsedMessage, null, 2);

        console.log("메세지 : " + messageBody);
        console.log("액션 : " + parsedMessage.action);
        console.log("세션아이디 : " + parsedMessage.sessionId);

        if (message.includes("입장")) {
          console.log("학생이 입장했습니다");
          fetchSessionIds();
          if (!hasSessionId(parsedMessage.sessionId)) {
            addSessionId(parsedMessage.sessionId);
          }
        }

        if (message.includes("퇴장")) {
          console.log("학생이 퇴장했습니다");
          fetchSessionIds();
          removeSessionId(parsedMessage.sessionId); // 학생 퇴장 시 sessionId 제거
        }
      });
    });
  };

  // 학생들에게 공유할 화면 소켓 생성
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

  //화면 공유 시작 메서드
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
      } else {
        alert("화면을 공유할 사람이 없습니다!");
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      setSharedScreenState(false);
      // alert("Screen sharing is not supported on this device.");
    }
  };

  // 화면 공유 중지 메서드
  const stopScreenShare = async () => {
    try {
      const stream = localVideoRef.current.srcObject;
      if (stream) {
        // 모든 트랙을 중지시킵니다.
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;

        // 각 peer connection에서 화면 공유 상태를 false로 업데이트합니다.
        for (const [sessionId, pc] of Object.entries(peerConnections.current)) {
          updateShareStatus(sessionId, false);
          stompClients.current[sessionId].send(
            `/app/stopShare/${sessionId}`,
            {},
            JSON.stringify({ message: "stop" })
          );

          // peer connection 닫기
          pc.close();
          delete peerConnections.current[sessionId];
        }

        sessionIdCheck.current = false;
      }

      setSharedScreenState(false);
    } catch (error) {
      console.error("Error stopping screen share:", error);
      setSharedScreenState(false);
      // alert("Error stopping screen share.");
    }
  };

  return (
    <>
      {/* [왼쪽 블럭] 수업 Step 테이블, 수업 상태 테이블 */}
      <div style={{ width: "25%", marginRight: "30px" }}>
        <TeacherAssignmentTable setCourseStep={setCourseStep} />
        <TeacherCourseStatusTable />
      </div>

      {/* [오른쪽 블럭] 화면 공유 블럭 */}
      <div style={{ display: "inline-block", width: "100%", height: "100%" }}>
        <Typography variant="h4" sx={{ margin: "10px 0 10px 0" }}>
          {`[ ${courseStep} ]`}
        </Typography>
        <div style={{ minHeight: "40rem" }}>
          {sharedScreenState ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "80rem",
                minHeight: "40rem", // 부모 요소의 높이를 설정해야 전체 높이에 대해 중앙 정렬이 가능
                border: "1px solid grey",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "80rem",
                minHeight: "40rem", // 부모 요소의 높이를 설정해야 전체 높이에 대해 중앙 정렬이 가능
                border: "1px solid grey",
              }}
            >
              <Typography>수업을 시작해 주세요.</Typography>
            </div>
          )}
        </div>
        <button
          onClick={startScreenShare}
          style={{ margin: "10px 0 ", width: "20%" }}
        >
          화면 공유
        </button>
        <button
          onClick={stopScreenShare}
          style={{ margin: "10px 0 0 10px ", width: "20%" }}
        >
          공유 중지
        </button>
        {/* 과제 공유 버튼 */}
        <TeacherStepShareButton />
        <button onClick={""} style={{ margin: "10px 0 0 10px ", width: "20%" }}>
          과제 중지
        </button>
      </div>
    </>
  );
};
