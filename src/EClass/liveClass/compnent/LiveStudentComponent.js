import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";
import { v4 as uuidv4 } from "uuid"; // UUID 패키지를 사용하여 세션 ID 생성
import StudentAssignmentTable from "./table/StudentAssignmentTable";
import StudentAssignmentCheckTable from "./table/StudentAssignmentCheckTable";

const LiveStudentComponent = () => {
  const remoteVideoRef = useRef(null);
  const stompClient = useRef({});
  const peerConnection = useRef({});
  const [sessionId, setSessionId] = useState(""); // 세션 ID 상태 추가

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    const newSessionId = uuidv4(); // 새 세션 ID 생성

    console.log("세션 아이디 : {}", newSessionId);

    setSessionId(newSessionId);
    registerSessionId(newSessionId); // DB에 세션 ID 등록

    stompClient.current = client;
    peerConnection.current = new RTCPeerConnection();

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log("Disconnected from STOMP");
        });
      }

      console.log("세션 해제");
      // 컴포넌트 해제 시 세션 아이디도 삭제해줌
      deleteSessionId(newSessionId);
      setSessionId("");
    };
  }, []);

  // 세션 ID를 DB에 등록하는 함수
  const registerSessionId = async (sessionId) => {
    try {
      await customAxios.post("/api/sessions/register-session", {
        sessionId: sessionId,
      });
      console.log("Session ID registered:", sessionId);
    } catch (error) {
      console.error("Error registering session ID:", error);
    }
  };

  // 세션 ID를 DB에서 삭제하는 함수
  const deleteSessionId = async (sessionId) => {
    try {
      await customAxios.delete(`/api/sessions/delete-session/${sessionId}`);
      console.log("Session ID deleted:", sessionId);
    } catch (error) {
      console.error("Error deleting session ID:", error);
    }
  };

  useEffect(() => {
    // if (peerConnection.current && stompClient.current && sessionId) {

    if (peerConnection.current) {
      peerConnection.current.oniceconnectionstatechange = () => {
        if (
          peerConnection.current.iceConnectionState === "disconnected" ||
          peerConnection.current.iceConnectionState === "failed" ||
          peerConnection.current.iceConnectionState === "closed"
        ) {
          console.log("ICE connection state is disconnected, failed or closed");
          // 화면 공유가 끊긴 것으로 간주하고 필요한 UI 업데이트나 상태 변경을 수행
          alert("화면 공유를 종료했습니다");
          window.location.reload();
        }
      };
    }

    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(`/topic/offer/${sessionId}`, (message) => {
        console.log("Received offer:", message.body);
        handleOffer(JSON.parse(message.body));
      });
      stompClient.current.subscribe(
        `/topic/candidate/${sessionId}`,
        (message) => {
          console.log("Received candidate:", message.body);
          handleCandidate(JSON.parse(message.body));
        }
      );
    });

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate");
        sendSignal(`/app/sendCandidate/${sessionId}`, {
          candidate: event.candidate,
        });
      }
    };
    // }
  }, [peerConnection.current, stompClient.current, sessionId]);

  const sendSignal = (destination, message) => {
    console.log(`Sending signal to ${destination}:`, message);
    stompClient.current.send(destination, {}, JSON.stringify(message));
  };

  const handleOffer = async (message) => {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(message.offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    sendSignal(`/app/sendAnswer/${sessionId}`, { answer });
  };

  const handleCandidate = async (message) => {
    if (peerConnection.current) {
      console.log("Adding ICE candidate");
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    }
  };

  return (
    <>
      {/* 수업 셋리스트 & step 제출 리스트 블럭 */}
      <div style={{ width: "25%", marginRight: "30px" }}>
        <StudentAssignmentTable />
        <StudentAssignmentCheckTable />
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

          <video ref={remoteVideoRef} autoPlay playsInline></video>
        </div>
        <button style={{ margin: "10px 0 0 10px ", width: "20%" }}>
          과제 시작
        </button>
      </div>
    </>
  );
};

export default LiveStudentComponent;
