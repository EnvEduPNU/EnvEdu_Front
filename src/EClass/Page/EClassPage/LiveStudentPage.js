import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import CustomTable from "../../../Study/DrwaGraph/CustomTable/CustomTable";

function LiveStudentPage() {
  const [page, setPage] = useState("defaultPage");

  useEffect(() => {
    // const sock = new SockJS("http://localhost:8080/ws");
    const sock = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);

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
    <div>{page === "newPage" ? <CustomTable /> : <DefaultPageComponent />}</div>
  );
}

function NewPageComponent() {
  return <h1>New Page</h1>;
}

function DefaultPageComponent() {
  return <h1>Default Page</h1>;
}

export default LiveStudentPage;
