import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const LiveTeacherComponent = () => {
  const [connected, setConnected] = useState(false);
  const stompClient = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token").replace("Bearer ", "");

    const socket = new SockJS(
      `${process.env.REACT_APP_API_URL}/screen-share?token=${token}`
    );

    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      setConnected(true);
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  const shareScreen = (data) => {
    if (connected) {
      stompClient.current.send("/app/share", {}, data);
    }
  };

  const startScreenShare = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.addEventListener("play", () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const captureFrame = () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/png");
          shareScreen(dataUrl);

          requestAnimationFrame(captureFrame);
        };

        captureFrame();
      });
    });
  };

  return (
    <div>
      <button onClick={startScreenShare}>Start Screen Share</button>
    </div>
  );
};

export default LiveTeacherComponent;
