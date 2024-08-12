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

  // 이전에 수업자료로 생성한 테이블있으면 가져오는 설정
  useEffect(() => {
    if (!tableData || tableData.length === 0) return;

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
        console.log(
          "업데이트된 수업자료 : " + JSON.stringify(updatedTableData, null, 2)
        );

        setAssignmentCheck(true);
      })
      .catch((err) => console.log(err));
  }, [stepCount]);

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
      {page === "newPage" && props.uuid == socketEclassUuid ? (
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
      <Typography variant="h6">수업 시작 전 입니다.</Typography>
    </div>
  );
}
