import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../../Common/CustomAxios";
import StudentRenderAssign from "../../teacher/component/StudentRenderAssign";
import { Typography } from "@mui/material";

// 선생님에 의해서 화면이 바뀌게 되는 학생의 소켓 통신이 있는 페이지
// 나중에 필요한 기능만 추출해서 LiveStudentComponet에 적용하기
export function StudentStepCompnent(props) {
  const [page, setPage] = useState(props.page);
  const [stepCount, setStepCount] = useState();
  const [tableData, setTableData] = useState();

  const [socketEclassUuid, setSocketEclassUuid] = useState();

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
    console.log("스텝카운트 : " + JSON.stringify(stepCount, null, 2));
    console.log("페이지 : " + JSON.stringify(page, null, 2));

    // 여기서 먼저 EClassUuidTable 부터 조회해서 assginmentData 있는지 확인하고 없으면
    // 기존 default로 정해진 수업 자료 axios로 가져오게하고
    // 만약 저번에 만들어진 데이터가 있으면 그거로 랜더링하게 하기.
    customAxios
      .get(`/api/assignment/get?uuid=${props.uuid}`)
      .then((res) => {
        console.log("가져온거 확인하기 : " + JSON.stringify(res.data, null, 2));

        setTableData(res.data);
        return;
      })
      .catch((err) => console.log(err));

    customAxios
      .get("/api/steps/getLectureContent")
      .then((res) => {
        console.log(
          "stepCount 확인 : " + JSON.stringify(props.stepCount, null, 2)
        );

        const filteredData = res.data.filter(
          (data) => data.uuid === props.uuid
        );

        const stepCount = parseInt(props.stepCount);

        // UUID가 일치하는 데이터 먼저 찾기
        const dataWithMatchingUUID = res.data.find(
          (data) => data.uuid === props.uuid
        );

        // 해당 데이터 내에서 stepNum이 stepCount와 일치하는 contents 필터링
        const filteredContents = dataWithMatchingUUID.contents.filter(
          (content) => content.stepNum === stepCount
        );

        dataWithMatchingUUID.contents = filteredContents;

        console.log(
          "수업자료 확인 : " + JSON.stringify(dataWithMatchingUUID, null, 2)
        );

        setTableData(filteredData);
      })
      .catch((err) => console.log(err));
  }, [stepCount]);

  return (
    <div>
      {page === "newPage" && props.uuid == socketEclassUuid ? (
        <>
          <StudentRenderAssign data={tableData} />
        </>
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
        minHeight: "70vh", // 부모 요소의 높이를 설정해야 전체 높이에 대해 중앙 정렬이 가능
        margin: "0 10px 0 0",
        border: "1px solid grey",
      }}
    >
      <Typography variant="h6">수업 시작 전 입니다.</Typography>
    </div>
  );
}
