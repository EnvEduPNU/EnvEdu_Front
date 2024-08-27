import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useLiveClassPartStore } from "../../../store/LiveClassPartStore";

let globalStompClient;

// 선생님 페이지 과제 공유 버튼
export function TeacherStepShareButton({
  stepCount,
  lectureDataUuid,
  sharedScreenState,
}) {
  const [sessionId, setSessionId] = useState();
  const [shared, setShared] = useState();
  const [assignShared, setAssignShared] = useState();
  const [assginmentSubmit, setAssginmentSubmit] = useState();
  const [reportSubmit, setReportSubmit] = useState();

  useEffect(() => {
    // SockJS 연결 설정

    const token = localStorage.getItem("access_token").replace("Bearer ", "");

    const sock = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=${token}`
    );

    const stompClient = Stomp.over(sock);

    if (stompClient && !stompClient.connected) {
      console.log(
        "스톰프 존재하는지 : " + JSON.stringify(stompClient, null, 2)
      );

      stompClient.connect(
        {},
        () => {
          globalStompClient = stompClient;

          // 학생에게 과제 공유 성공시 받는 소켓 메시지
          stompClient.subscribe("/topic/assginment-status", function (message) {
            const parsedMessage = JSON.parse(message.body);
            console.log(
              "과제 공유 : " + JSON.stringify(parsedMessage, null, 2)
            );

            setSessionId(parsedMessage.sessionId);
            setShared(parsedMessage.shared);
            setAssignShared(parsedMessage.assginmentStatus);
            setAssginmentSubmit(parsedMessage.assginmentSubmit);
            setReportSubmit(parsedMessage.reportSubmit);

            updateShareStatus(
              parsedMessage.sessionId,
              parsedMessage.shared,
              parsedMessage.assginmentStatus,
              parsedMessage.assginmentSubmit,
              parsedMessage.reportSubmit
            );
          });
        },
        onError
      );
    } else {
      console.log("커넥션이 이미 있습니다.");
    }

    function onError(error) {
      console.error("STOMP 연결 에러:", error);
      alert(
        "웹소켓 연결에 실패했습니다. 네트워크 설정을 확인하거나 관리자에게 문의하세요."
      );
    }

    // 컴포넌트가 언마운트될 때 연결 종료
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected");
        });
      }
    };
  }, [stepCount]);

  const updateShareStatus = useLiveClassPartStore(
    (state) => state.updateShareStatus
  );

  // 과제 공유 소켓 전달
  const sendMessage = () => {
    if (!stepCount) {
      alert("공유할 스텝을 선택해주세요");
      return;
    }

    if (globalStompClient && !sharedScreenState) {
      console.log("스텝카운트 " + stepCount);

      const message = {
        page: "newPage", // JSON 객체에서 "newPage"를 값으로 하는 'page' 키 생성
        stepCount: stepCount,
        lectureDataUuid: lectureDataUuid,
      };
      globalStompClient.send("/app/switch", {}, JSON.stringify(message));
    }

    if (sharedScreenState) {
      alert("화면 공유 중 입니다!");
    }
  };

  // 과제 중지 소켓 전달
  const sendStopMessage = () => {
    if (globalStompClient && !sharedScreenState) {
      // 과제 공유 상태 업데이트
      updateShareStatus(sessionId, shared, false);

      const message = {
        page: "stop", // JSON 객체에서 "newPage"를 값으로 하는 'page' 키 생성
      };
      globalStompClient.send("/app/switch", {}, JSON.stringify(message));
    }

    if (sharedScreenState) {
      alert("화면 공유 중 입니다!");
    }
  };

  return (
    <>
      <button
        onClick={sendMessage}
        style={{
          width: "18%",
          marginLeft: "10px",
          marginRight: 1,
          fontFamily: "'Asap', sans-serif", // 버튼에 Asap 폰트 적용
          fontWeight: "600",
          fontSize: "0.9rem",
          color: "grey",
          backgroundColor: "#feecfe",
          borderRadius: "2.469rem",
          border: "none",
        }}
      >
        과제 공유
      </button>
      <button
        onClick={sendStopMessage}
        style={{
          width: "18%",
          margin: "10px 0 0 10px ",
          marginRight: 1,
          fontFamily: "'Asap', sans-serif", // 버튼에 Asap 폰트 적용
          fontWeight: "600",
          fontSize: "0.9rem",
          color: "grey",
          backgroundColor: "#feecfe",
          borderRadius: "2.469rem",
          border: "none",
        }}
      >
        과제 중지
      </button>
    </>
  );
}
