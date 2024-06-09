import React from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

function LiveTeacherPage() {
  const sendMessage = () => {
    const sock = new SockJS("http://localhost:9090/ws");
    const stompClient = Stomp.over(sock);

    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
      stompClient.send("/app/switch", {}, "newPage");
    });
  };

  return <button onClick={sendMessage}>Switch Student Page</button>;
}

export default LiveTeacherPage;
