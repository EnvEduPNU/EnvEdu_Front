import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveStudentComponent = () => {
  const [connected, setConnected] = useState(false);
  const [screenData, setScreenData] = useState(null);
  const stompClient = useRef(null);

  useEffect(() => {
    const socket = new SockJS("/ws");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      setConnected(true);
      stompClient.current.subscribe("/topic/screen", (message) => {
        setScreenData(message.body);
      });
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  return <div>{screenData && <img src={screenData} alt="Screen Share" />}</div>;
};

export default LiveStudentComponent;
