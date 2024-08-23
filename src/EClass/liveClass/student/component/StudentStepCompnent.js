import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../../Common/CustomAxios";
import StudentRenderAssign from "../../teacher/component/StudentRenderAssign";
import { Typography } from "@mui/material";

export function StudentStepCompnent(props) {
  const [page, setPage] = useState(props.page);
  const [stepCount, setStepCount] = useState();
  const [tableData, setTableData] = useState([]);
  const [latestTableData, setLatestTableData] = useState([]);

  const [socketEclassUuid, setSocketEclassUuid] = useState();
  const [assginmentCheck, setAssignmentCheck] = useState(false);

  // 과제 공유 받는 소켓 설정
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

        if (parsedMessage.page === "newPage") {
          assginmentCheckStompClient();
        }

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

  // 과제 공유 성공시 응답 소켓 메서드
  const assginmentCheckStompClient = () => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");
    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=${token}`
    );
    const message = {
      assginmentStatus: "success",
      sessionId: props.sessionIdState,
    };

    console.log(
      "[학생]과제 공유 성공보내기 : " + JSON.stringify(message, null, 2)
    );

    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.send("/app/assginment-status", {}, JSON.stringify(message));
    });
  };

  // 이전에 수업자료로 생성한 테이블있으면 가져오는 설정
  useEffect(() => {
    setStepCount(props.stepCount);
    props.setStepCount(props.stepCount);

    if (
      !tableData ||
      tableData.length === 0 ||
      !props.data ||
      props.data.length === 0
    )
      return;

    customAxios
      .get(`/api/assignment/get?uuid=${props.uuid}`)
      .then((res) => {
        if (res.data.length === 0) {
          return;
        }

        const updatedTableData = tableData.map((existingStepData) => {
          const updatedStepData = res.data.find(
            (newStepData) => newStepData.stepNum === existingStepData.stepNum
          );

          if (updatedStepData) {
            return {
              ...existingStepData,
              ...updatedStepData,
            };
          } else {
            return existingStepData;
          }
        });

        setLatestTableData(updatedTableData);
        props.setReportTable(updatedTableData);
        // console.log(
        //   "업데이트된 수업자료 : " + JSON.stringify(updatedTableData, null, 2)
        // );

        setAssignmentCheck(true);
      })
      .catch((err) => console.log(err));
  }, [stepCount, props.stepCount]);

  // E-Class에서 설정한 기본 수업자료 받아오는 설정
  useEffect(() => {
    customAxios
      .get("/api/steps/getLectureContent")
      .then((res) => {
        const filteredData = res.data.filter(
          (data) => data.uuid === props.uuid
        );

        const dataWithMatchingUUID = res.data.find(
          (data) => data.uuid === props.uuid
        );

        console.log(
          "기본수업자료 가져온것 : " +
            JSON.stringify(dataWithMatchingUUID, null, 2)
        );

        setTableData(filteredData);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {page === "newPage" || props.uuid == socketEclassUuid || stepCount ? (
        <StudentRenderAssign
          tableData={tableData}
          assginmentCheck={assginmentCheck}
          stepCount={stepCount}
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
