import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

let globalStompClient;

// 선생님 페이지 과제 공유 버튼
export function TeacherStopScreenShareButton() {
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
  }, []);

  const sendMessage = () => {
    if (globalStompClient) {
      const message = {
        page: "newPage", // JSON 객체에서 "newPage"를 값으로 하는 'page' 키 생성
      };
      globalStompClient.send("/app/switch", {}, JSON.stringify(message));
    }
  };

  return (
    <>
      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
        과제 공유
      </button>
    </>
  );
}
