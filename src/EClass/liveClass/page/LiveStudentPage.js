import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import StudentAssignmentTable from "../student/component/table/StudentAssignmentTable";
import { StudentStepCompnent } from "../student/component/StudentStepCompnent";
import { customAxios } from "../../../Common/CustomAxios";
import TeacherReportTable from "../teacher/component/table/eclassPageTable/TeacherReportTable";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export const LiveStudentPage = () => {
  const sessionId = useRef("");
  const [sessionIdState, setSessionIdState] = useState();
  const [finished, setFinished] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [courseStep, setCourseStep] = useState();
  const [stepCount, setStepCount] = useState();
  const [reportTable, setReportTable] = useState([]);
  const [classProcess, setClassProcess] = useState(true);
  const [page, setPage] = useState("defaultPage");
  const [isVideoReady, setIsVideoReady] = useState(false);

  const location = useLocation();
  const { lectureDataUuid, row, eClassUuid } = location.state || {};

  const stompClients = useRef(null);
  const navigate = useNavigate();

  // stompClients 커넥션 생성 훅
  useEffect(() => {
    if (!stompClients.current) {
      const token = localStorage.getItem("access_token").replace("Bearer ", "");
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`
      );
      stompClients.current = Stomp.over(sock);

      stompClients.current.connect({}, () => {}, onError);
    }

    function onError(error) {
      console.error("STOMP 연결 에러:", error);
      alert(
        "웹소켓 연결에 실패했습니다. 네트워크 설정을 확인하거나 관리자에게 문의하세요."
      );
    }
  }, []);

  // 각 학생의 E-Class에 대한 Session Id 생성 훅
  useEffect(() => {
    console.log(
      "[LiveStudentPage] 이클래스 UUID: " + JSON.stringify(eClassUuid, null, 2)
    );

    const initializeSession = async () => {
      const newSessionId = uuidv4();
      const registeredSessionId = await registerSessionId(newSessionId);

      sessionId.current = registeredSessionId || newSessionId;
      setSessionIdState(sessionId.current);
      setFinished(true);
      sendMessage(true);
    };

    initializeSession();

    const handleBeforeUnload = (event) => {
      sendMessage(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      sendMessage(false);
      // deleteSessionId(sessionId.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // 수업 종료 훅
  useEffect(() => {
    if (!classProcess) {
      alert("수업이 종료되었습니다!");
      sendMessage(false);
      navigate("/");
      window.location.reload();
    }
  }, [classProcess]);

  // 화면 공유 아닐때 Default Page 설정 훅
  useEffect(() => {
    if (!isVideoReady) {
      setPage("defaultPage");
    }
  }, [isVideoReady, setPage]);

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
      return null;
    }
  };

  const sendMessage = async (state) => {
    const message = {
      entered: state,
      sessionId: sessionId.current,
    };
    if (stompClients) {
      await stompClients.current.send(
        "/app/student-entered",
        {},
        JSON.stringify(message)
      );
    }
  };

  // const deleteSessionId = async (sessionId) => {
  //   try {
  //     const url = `${process.env.REACT_APP_API_URL}/api/sessions/delete-session/${sessionId}`;
  //     const body = JSON.stringify({ sessionId: sessionId });

  //     await customAxios.delete(url, body);

  //     console.log("세션 ID 삭제됨:", sessionId);
  //   } catch (error) {
  //     console.error("세션 ID 삭제 중 오류 발생:", error);
  //   }
  // };

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
        <TeacherReportTable selectedEClassUuid={eClassUuid} />
      </div>
    </div>
  );
};

export default LiveStudentPage;
