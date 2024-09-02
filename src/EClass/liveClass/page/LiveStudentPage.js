import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import ProgressCircular from "../student/component/ProgressCircular";
import StudentAssignmentTable from "../student/component/table/StudentAssignmentTable";
import { StudentStepCompnent } from "../student/component/StudentStepCompnent";
import { customAxios } from "../../../Common/CustomAxios";

import SockJS from "sockjs-client";
import Stomp from "stompjs";

export const LiveStudentPage = () => {
  const sessionId = useRef("");
  const [sessionIdState, setSessionIdState] = useState();
  const [finished, setFinished] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [courseStep, setCourseStep] = useState();
  const [stepCount, setStepCount] = useState();

  const location = useLocation();
  const { lectureDataUuid, row, eClassUuid } = location.state || {};

  const [reportTable, setReportTable] = useState([]);
  const [classProcess, setClassProcess] = useState(true);

  let stompClients = null;

  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "[LiveStudentPage] 이클래스 유유아이디 : " +
        JSON.stringify(eClassUuid, null, 2)
    );

    const initializeSession = async () => {
      const newSessionId = uuidv4();
      const registeredSessionId = await registerSessionId(newSessionId);

      if (registeredSessionId) {
        sessionId.current = registeredSessionId;
        setSessionIdState(registeredSessionId);
      } else {
        sessionId.current = newSessionId;
        setSessionIdState(newSessionId);
      }

      setFinished(true);
    };

    initializeSession();

    const handleBeforeUnload = (event) => {
      if (sessionId.current) {
        sendMessage(false);
        deleteSessionId(sessionId.current);
        setSessionIdState("");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      sendMessage(false);
      deleteSessionId(sessionId.current);
      setSessionIdState("");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!classProcess) {
      alert("수업이 종료되었습니다!");
      sendMessage(false);
      navigate("/");
      window.location.reload();
    }
  }, [classProcess]);

  // E-Class 나갈때 나감을 알려주는 소켓
  useEffect(() => {
    if (!stompClients) {
      const token = localStorage.getItem("access_token").replace("Bearer ", "");
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`
      );
      stompClients = Stomp.over(sock);

      stompClients.connect({}, () => {}, onError);
    }

    function onError(error) {
      console.error("STOMP 연결 에러:", error);
      alert(
        "웹소켓 연결에 실패했습니다. 네트워크 설정을 확인하거나 관리자에게 문의하세요."
      );
    }
  }, []);

  // 수업 상태 알려주는 소켓
  const sendMessage = async (state) => {
    const message = {
      entered: state,
    };
    await stompClients.send(
      "/app/student-entered",
      {},
      JSON.stringify(message)
    );
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
      console.error("세션 ID 등록 중 오류 발생:", error);
      return null; // 오류 발생 시 null 반환
    }
  };

  // 세션 ID를 DB에서 삭제하는 함수
  const deleteSessionId = async (sessionId) => {
    try {
      await customAxios.delete(`/api/sessions/delete-session/${sessionId}`);
      console.log("세션 ID 삭제됨:", sessionId);
    } catch (error) {
      console.error("세션 ID 삭제 중 오류 발생:", error);
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
      <div style={{ display: "inline-block", width: "100%", height: "100%" }}>
        <Typography variant="h4" sx={{ margin: "0 20px 0 20px" }}>
          {row.Name}
        </Typography>
        <div style={{ margin: "0 20px 0 20px" }}>
          {!isVideoReady && (
            <StudentStepCompnent
              setPage={setPage}
              setStepCount={setStepCount}
              page={page}
              data={tableData}
              uuid={lectureDataUuid}
              stepCount={stepCount}
              setReportTable={setReportTable}
              sessionIdState={sessionIdState}
              eclassUuid={eClassUuid}
              lectureDataUuid={lectureDataUuid}
            />
          )}
        </div>
      </div>

      <div style={{ width: "25%", marginRight: "30px" }}>
        <StudentAssignmentTable
          setCourseStep={setCourseStep}
          setTableData={setTableData}
          lectureDataUuid={lectureDataUuid}
          setStepCount={setStepCount}
          stepCount={stepCount}
          reportTable={reportTable}
          eclassUuid={eClassUuid}
        />
      </div>
    </div>
  );
};

export default LiveStudentPage;
