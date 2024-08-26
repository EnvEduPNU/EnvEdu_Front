import React, { useEffect, useState, useCallback, useMemo } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import StudentRenderAssign from "../../teacher/component/StudentRenderAssign";
import { Typography } from "@mui/material";
import { customAxios } from "../../../../Common/CustomAxios";

export function StudentStepCompnent(props) {
  const [page, setPage] = useState();
  const [stepCount, setStepCount] = useState();
  const [tableData, setTableData] = useState(props.data);
  const [socketEclassUuid, setSocketEclassUuid] = useState(null);
  const [assginmentCheck, setAssignmentCheck] = useState(false);
  const [eclassUuid] = useState(props.eclassUuid);
  const [studentId, setStudentId] = useState(null);

  // WebSocket 연결 및 페이지 변경에 따른 처리
  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const sock = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=${token}`
    );
    const stompClient = Stomp.over(sock);

    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/switchPage", function (message) {
        const parsedMessage = JSON.parse(message.body);

        setPage(parsedMessage.page);
        props.setPage(parsedMessage.page);
        setStepCount(parsedMessage.stepCount);
        props.setStepCount(parsedMessage.stepCount);
        setSocketEclassUuid(parsedMessage.lectureDataUuid);
      });
    });

    return () => {
      stompClient.disconnect();
      console.log("Disconnected");
    };
  }, []);

  useEffect(() => {
    const success = "success";
    const failed = "failed";
    assginmentCheckStompClient(success);
    if (props.stepCount !== stepCount) {
      assginmentCheckStompClient(failed);
    }
  }, [props]);

  // 과제 공유 성공시 응답 소켓 메서드
  const assginmentCheckStompClient = useCallback(
    (state) => {
      const token = localStorage.getItem("access_token").replace("Bearer ", "");
      const socket = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`
      );

      const message = {
        assginmentStatus: state,
        sessionId: props.sessionIdState,
      };

      const stompClient = Stomp.over(socket);

      stompClient.connect({}, () => {
        stompClient.send("/app/assginment-status", {}, JSON.stringify(message));
      });
    },
    [props.sessionIdState]
  );

  // 학생 ID 및 테이블 데이터 가져오기
  useEffect(() => {
    const username = localStorage.getItem("username");

    const fetchStudentId = async () => {
      try {
        const response = await customAxios.get(
          `/api/student/getStudentId?username=${username}&uuid=${eclassUuid}`
        );
        setStudentId(response.data);
      } catch (error) {
        console.error("Error fetching student ID:", error);
      }
    };

    if (!studentId) {
      fetchStudentId();
    }

    setTableData(props.data);
    setStepCount(props.stepCount);
  }, [props.data, props.stepCount, eclassUuid, studentId]);

  // // Page와 eClassUuid가 맞는지 여부를 메모이제이션
  // const shouldRenderAssign = useMemo(() => {
  //   return ;
  // }, [page, props.uuid, socketEclassUuid, stepCount]);

  return (
    <div>
      {page === "newPage" || props.uuid === socketEclassUuid || stepCount ? (
        <StudentRenderAssign
          tableData={tableData}
          assginmentCheck={assginmentCheck}
          stepCount={stepCount}
          studentId={studentId}
        />
      ) : (
        <DefaultPageComponent />
      )}
    </div>
  );
}

function DefaultPageComponent() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "61vh",
        margin: "0 10px 10vh 0",
        border: "1px solid grey",
      }}
    >
      <Typography variant="h6">수업을 기다려주세요.</Typography>
    </div>
  );
}
