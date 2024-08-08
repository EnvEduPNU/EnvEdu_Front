import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { customAxios } from "../../../../Common/CustomAxios";
import StudentRenderAssign from "../../teacher/component/StudentRenderAssign";

// 선생님에 의해서 화면이 바뀌게 되는 학생의 소켓 통신이 있는 페이지
// 나중에 필요한 기능만 추출해서 LiveStudentComponet에 적용하기
export function StudentStepCompnent(props) {
  const [page, setPage] = useState(props.page);
  const [stepCount, setStepCount] = useState();
  const [tableData, setTableData] = useState();

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
      {page === "newPage" ? (
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
  return <></>;
}
