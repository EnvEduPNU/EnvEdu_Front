import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../Common/CustomAxios";
import { v4 as uuidv4 } from "uuid"; // UUID 패키지를 사용하여 세션 ID 생성
import StudentAssignmentTable from "../student/component/table/StudentAssignmentTable";
import { StudentStepCompnent } from "../student/component/StudentStepCompnent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import ProgressCircular from "../student/component/ProgressCircular";

export const LiveStudentPage = () => {
  const remoteVideoRef = useRef(null);
  const stompClient = useRef(null);
  const peerConnection = useRef(null);
  const sessionId = useRef("");
  const [sessionIdState, setSessionIdState] = useState("");
  const [finished, setFinished] = useState(false);
  const iceConnectionCheckInterval = useRef(null);

  const [tableData, setTableData] = useState([]);
  const [courseStep, setCourseStep] = useState();
  const [stepCount, setStepCount] = useState();

  const location = useLocation();
  const { lectureDataUuid, row } = location.state || {};

  const [reportTable, setReportTable] = useState([]);

  const [screenShareStatus, setScreenShareStatus] = useState(true);

  const [classProcess, setClassProcess] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const newSessionId = uuidv4(); // 새 세션 ID 생성

      const registeredSessionId = await registerSessionId(newSessionId);

      if (registeredSessionId) {
        console.log("올드 세션 아이디 : " + registeredSessionId);
        sessionId.current = registeredSessionId;
        setSessionIdState(registeredSessionId);
      } else {
        console.log("뉴세션 아이디 : ", newSessionId);
        sessionId.current = newSessionId;
        setSessionIdState(newSessionId);
      }

      setFinished(true);
    };

    initializeSession();

    const handleBeforeUnload = async () => {
      await deleteSessionId(sessionId.current);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log("Disconnected from STOMP");
        });
      }
      deleteSessionId(sessionId.current);
      setSessionIdState("");

      // 주기적 체크 인터벌 종료
      if (iceConnectionCheckInterval.current) {
        clearInterval(iceConnectionCheckInterval.current);
      }

      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (finished) {
      stompClientConnectionInit();
      peerConnectionInit();
    }
  }, [finished]);

  // 상태 메시지 받는 소켓 설정
  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");

    const sock = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=${token}`
    );

    const stompClient = Stomp.over(sock);

    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/screen-share-status", function (message) {
        const body = JSON.parse(message.body);
        const status = body.screenStatus;
        // alert("화면공유상태 : " + body.screenStatus);

        if (status === "start") {
          setScreenShareStatus(true);
        }

        if (status === "stop") {
          setScreenShareStatus(false);
        }

        if (status === "finish") {
          setClassProcess(false);
        }
      });
    });

    // return () => {
    //   stompClient.disconnect();
    //   console.log("Disconnected");
    // };
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!classProcess) {
      alert("수업이 종료되었습니다!");
      navigate("/");
    }
  }, [classProcess]);

  const stompClientConnectionInit = () => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );
    const client = Stomp.over(socket);

    stompClient.current = client;

    stompClient.current.connect({}, () => {
      console.log(
        "STOMP client connected with session ID: " + sessionId.current
      );

      stompClient.current.subscribe(
        `/topic/offer/${sessionId.current}`,
        (message) => {
          console.log("Received offer:", message.body);
          handleOffer(JSON.parse(message.body));
        }
      );
      stompClient.current.subscribe(
        `/topic/candidate/${sessionId.current}`,
        (message) => {
          console.log("Received candidate:", message.body);
          handleCandidate(JSON.parse(message.body));
        }
      );
      stompClient.current.subscribe(
        `/topic/stopShare/${sessionId.current}`,
        () => {
          console.log("Received stopShare");
          handleStopShare();
        }
      );
    });
  };

  const peerConnectionInit = () => {
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
          console.log("ICE connection state is disconnected, failed or closed");
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
          console.log("Sending ICE candidate");
          sendSignal(`/app/sendCandidate/${sessionId.current}`, {
            candidate: event.candidate,
          });
        }
      };
    }
  };

  const handleStopShare = () => {
    console.log("Handling stop share");
    if (peerConnection.current) {
      peerConnection.current.close();
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleIceConnectionStateChange = () => {
    remoteVideoRef.current.srcObject = null; // 공유된 화면 제거
    window.location.reload();
  };

  // 세션 ID를 DB에 등록하는 함수
  const registerSessionId = async (sessionId) => {
    try {
      const userName = localStorage.getItem("username");

      const resp = await customAxios.post("/api/sessions/register-session", {
        sessionId: sessionId,
        userName: userName,
      });

      return resp.data;
    } catch (error) {
      console.error("Error registering session ID:", error);
      return null; // 오류 발생 시 null 반환
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
    sendSignal(`/app/sendAnswer/${sessionId.current}`, { answer });
  };

  const handleCandidate = async (message) => {
    if (peerConnection.current) {
      console.log("Adding ICE candidate");
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(message.candidate)
      );
    }
  };

  const [page, setPage] = useState("defaultPage");

  const [isVideoReady, setIsVideoReady] = useState(false);

  const handleCanPlay = () => {
    setIsVideoReady(true);
  };

  useEffect(() => {
    if (!isVideoReady) {
      setPage("defaultPage");
    }
  }, [isVideoReady, setPage]);

  return (
    <div style={{ display: "flex", margin: "0 20vh" }}>
      {/* {console.log("E-Class 정보 : " + JSON.stringify(row, null, 2))} */}

      {/* 화면 공유 블럭 */}
      <div style={{ display: "inline-block", width: "100%", height: "100%" }}>
        <Typography variant="h4" sx={{ margin: "0 20px 0 20px" }}>
          {row.Name}
        </Typography>
        <div style={{ margin: "0 20px 0 20px" }}>
          {!screenShareStatus && <ProgressCircular />}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            onCanPlay={handleCanPlay}
            style={{
              display: screenShareStatus && isVideoReady ? "block" : "none",
            }}
          />

          {!isVideoReady && (
            <StudentStepCompnent
              setPage={setPage}
              setStepCount={setStepCount}
              page={page}
              data={tableData}
              uuid={lectureDataUuid}
              stepCount={stepCount}
              setReportTable={setReportTable}
            />
          )}
        </div>
      </div>

      {/* 수업 셋리스트 & step 제출 리스트 블럭 */}
      <div style={{ width: "25%", marginRight: "30px" }}>
        <StudentAssignmentTable
          setCourseStep={setCourseStep}
          setTableData={setTableData}
          lectureDataUuid={lectureDataUuid}
          setStepCount={setStepCount}
          stepCount={stepCount}
          reportTable={reportTable}
        />
      </div>
    </div>
  );
};
