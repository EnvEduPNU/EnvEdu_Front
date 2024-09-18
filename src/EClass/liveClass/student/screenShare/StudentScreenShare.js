import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';

const StudentScreenShare = ({ sessionId, setIsVideoReady }) => {
  const remoteVideoRef = useRef();
  const stompClient = useRef();
  const ShareStompClient = useRef();

  const peerConnection = useRef();
  const iceConnectionCheckInterval = useRef();

  const [isVideoReadyLocal, setIsVideoReadyLocal] = useState(false);
  const [screenShareStatus, setScreenShareStatus] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Optimized effect to initialize stompClient and peerConnection
  useEffect(() => {
    if (!isConnected) {
      stompClientConnectionInit();
      peerConnectionInit();
      stopShareStompClientInit();
    }

    // return () => {
    //   // Cleanup stompClient connection
    //   if (stompClient.current) {
    //     stompClient.current.disconnect(() => {
    //       console.log("STOMP 연결 해제됨");
    //     });
    //   }
    //   if (iceConnectionCheckInterval.current) {
    //     clearInterval(iceConnectionCheckInterval.current);
    //   }
    // };
  }, [isConnected]);

  const stopShareStompClientInit = () => {
    try {
      const token = localStorage.getItem("access_token").replace("Bearer ", "");

      if (!token) {
        throw new Error("Access token is missing. Please log in again.");
      }

      if (!ShareStompClient.current) {
        const socket = new SockJS(
          `${process.env.REACT_APP_API_URL}/ws?token=${token}`
        );
        const client = new Client({ webSocketFactory: () => socket });


        ShareStompClient.current = client;

        // 연결 완료 후 구독 설정
        ShareStompClient.current.onConnect = (frame) =>(
          {},
          () => {
            console.log("STOMP 연결 완료, 화면 공유 상태 구독 중...");
            ShareStompClient.current.subscribe(
              `/topic/screen-share-status`,
              (message) => {
                try {
                  const state = JSON.parse(message.body).screenStatus;
                  console.log("화면 공유 멈춤 :", state);

                  if (state === "stop") {
                    setScreenShareStatus(false);
                    setIsVideoReady(false);
                    setIsVideoReadyLocal(false);

                    stompClientConnectionInit();
                  }

                  // handleStopShare();
                } catch (error) {
                  console.error("Failed to process stop share message:", error);
                }
              }
            );
          },
          onError
        );

        ShareStompClient.activate()
      }
    } catch (error) {
      console.error("STOMP client initialization failed:", error);
      alert("STOMP 연결에 실패했습니다. 네트워크 설정을 확인하세요.");
    }
  };

  const stompClientConnectionInit = () => {
    try {
      const token = localStorage.getItem("access_token").replace("Bearer ", "");

      if (!token) {
        throw new Error("Access token is missing. Please log in again.");
      }

      if (!stompClient.current) {
        const socket = new SockJS(
          `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
        );
        const client = new Client({ webSocketFactory: () => socket });

        stompClient.current = client;

        stompClient.current.onConnect = (frame) =>({}, onConnected, onError);

        stompClient.activate()
      }
    } catch (error) {
      console.error("STOMP client initialization failed:", error);
      alert("STOMP 연결에 실패했습니다. 네트워크 설정을 확인하세요.");
    }
  };

  const onConnected = () => {
    try {
      console.log("화면공유 소켓이 세션 ID로 연결됨: " + sessionId);
      setIsConnected(true);

      stompClient.current.subscribe(`/topic/offer/${sessionId}`, (message) => {
        try {
          console.log("오퍼 수신:", message.body);
          handleOffer(JSON.parse(message.body));
        } catch (error) {
          console.error("Failed to process offer message:", error);
        }
      });

      stompClient.current.subscribe(
        `/topic/candidate/${sessionId}`,
        (message) => {
          try {
            console.log("후보 수신:", message.body);
            handleCandidate(JSON.parse(message.body));
          } catch (error) {
            console.error("Failed to process candidate message:", error);
          }
        }
      );

      // stompClient.current.subscribe(`/topic/stopShare/${sessionId}`, () => {
      //   try {
      //     console.log("화면 공유 중지 수신");
      //     handleStopShare();
      //   } catch (error) {
      //     console.error("Failed to handle stopShare message:", error);
      //   }
      // });
    } catch (error) {
      console.error(
        "STOMP client connected but failed to set up subscriptions:",
        error
      );
      alert("구독 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const onError = (error) => {
    console.error("STOMP 연결 에러:", error);
    alert(
      "STOMP 연결에 실패했습니다. 네트워크 설정을 확인하거나 관리자에게 문의하세요."
    );

    // Retry connection with a delay if the connection fails
    // setTimeout(() => {
    //   console.log("Retrying STOMP connection...");
    //   stompClientConnectionInit();
    // }, 5000); // Retry after 5 seconds
  };

  const peerConnectionInit = () => {
    console.log("피어 커넥션 초기화 ");

    peerConnection.current = new RTCPeerConnection();

    if (peerConnection.current) {
      console.log(
        "RTCPeerConnection 초기화 완료: " +
          JSON.stringify(peerConnection.current, null, 2)
      );

      peerConnection.current.oniceconnectionstatechange = () => {
        if (
          peerConnection.current.iceConnectionState === "disconnected" ||
          peerConnection.current.iceConnectionState === "failed" ||
          peerConnection.current.iceConnectionState === "closed"
        ) {
          console.log(
            "ICE 연결 상태가 'disconnected', 'failed', 또는 'closed'입니다."
          );
          handleIceConnectionStateChange();
        }
      };

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("ICE 후보 전송");
          sendSignal(`/app/sendCandidate/${sessionId}`, {
            candidate: event.candidate,
          });
        }
      };
    }
  };

  const handleStopShare = () => {
    console.log("화면 공유 중지 처리");
    if (peerConnection.current) {
      peerConnection.current.close();
      remoteVideoRef.current.srcObject = null;
    }
    // onScreenShareStatusChange(false);
  };

  const handleIceConnectionStateChange = () => {
    remoteVideoRef.current.srcObject = null;
    // onClassProcessEnd();
  };

  const sendSignal = (destination, message) => {
    console.log(`신호 전송 중 ${destination}:`, message);
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
      console.log("ICE 후보 추가 중");
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    }
  };

  const handleCanPlay = () => {
    setIsVideoReady(true);
    setIsVideoReadyLocal(true);
  };

  return (
    <div>
      {!screenShareStatus && <></>}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        onCanPlay={handleCanPlay}
        style={{
          display: screenShareStatus && isVideoReadyLocal ? "block" : "none",
        }}
      />
    </div>
  );
};

export default StudentScreenShare;
