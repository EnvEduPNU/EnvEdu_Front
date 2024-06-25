import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import DataInChartPage from "../../../Data/DataInChart/Page/DataInChartPage";
import LiveStudentComponent from "../compnent/LiveStudentComponent";

// 선생님에 의해서 화면이 바뀌게 되는 학생의 소켓 통신이 있는 페이지
// 나중에 필요한 기능만 추출해서 LiveStudentComponet에 적용하기
function LiveStudentPage() {
  const [page, setPage] = useState("defaultPage");

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");

    const sock = new SockJS(
      `${process.env.REACT_APP_API_URL}/ws?token=${token}`
    );

    const stompClient = Stomp.over(sock);

    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/switchPage", function (message) {
        setPage(message.body);
      });
    });

    return () => {
      stompClient.disconnect();
      console.log("Disconnected");
    };
  }, []);

  return (
    <div>
      {page === "newPage" ? <DataInChartPage /> : <DefaultPageComponent />}
    </div>
  );
}

function NewPageComponent() {
  return <h1>New Page</h1>;
}

function DefaultPageComponent() {
  return <></>;
}

export default LiveStudentPage;
