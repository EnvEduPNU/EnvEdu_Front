import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import SingleDataContainer from "./SingleDataContainer";
import { customAxios } from "../../Common/CustomAxios";

import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import React, { forwardRef, useImperativeHandle } from "react";
import { MdError } from "react-icons/md";
import { MdSignalWifiStatusbarConnectedNoInternet } from "react-icons/md";
import { ImConnection } from "react-icons/im";

/**
 * 전역 변수 관리
 * 작성자: 김선규
 */
let saveTest = false;
let periodTest = "";
let memoTest = "";
let CountTest = 0;
const stomp = require("stompjs"); //웹 소켓 연결을 위한 stompClient
let stompClient = null;
let receiveObject = null; //받은 데이터를 객체로 관리하기 위한 용도
let isFinished = false; //데이터 저장 중지 여부
let lastReceivedDate = null; //마지막으로 데이터를 받은 날짜

/**
 * 본 컴포넌트
 * 작성자: 김선규
 */
export default function SocketConnect(props) {
  /**
   * 상태 관리
   */
  const [selectedTypes, setSelectedTypes] = useState([]); // 선택된 데이터 타입들을 저장하는 상태
  const [period, setPeriod] = useState("");
  const [location, setLocation] = useState("");
  const [memo, setMemo] = useState("");
  const dataTypes = [
    //센서 기기에서 전송하는 데이터 종류
    "temp",
    "pH",
    "hum",
    "hum_earth",
    "tur",
    "dust",
    "dox",
    "co2",
    "lux",
    "pre",
  ];
  const [connected, setConnected] = useState(false); //현재 웹 소켓 연결 여부
  const [receivedData, setReceivedData] = useState([]); //전송받은 데이터
  const [receivedDataView, setReceivedDataView] = useState([]);
  const [saveData, setSaveData] = useState([]); //저장할 데이터
  const [isConnectionDropped, setIsConnectionDropped] = useState(false); //연결 끊김 여부

  /**
   * [Method] 선택된 데이터 타입을 토글하는 메서드
   * 작성자: 김선규
   */
  const toggleSelectedType = (type) => {
    setSelectedTypes((prev) => {
      // 이미 선택된 타입이면 제거, 아니면 추가
      return prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
    });
  };

  /**
   * [Method] 소켓을 등록하는 메서드
   * 작성자: 김선규
   */
  function register() {
    const sock = new SockJS(`${process.env.REACT_APP_API_URL}/client/socket`);
    stompClient = stomp.over(sock);

    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: localStorage.getItem("jwt"),
    };

    if (stompClient && !stompClient.connected) {
      stompClient.connect(headers, onConnected, onError);
      console.log("백서버에 Connection은 생성");
    } else {
      console.log("Already connected or not initialized");
    }
  }

  /**
   * [Method] 소켓에 연결하여 구독메시지를 주기적으로 받는 메서드
   * 작성자: 김선규
   */
  const onConnected = () => {
    const subscribePath = "/topic/user/" + props.mac;

    console.log("구독 주소 : " + subscribePath);

    // setTimeout을 안해주면 동작하지 않는다. 조금더 알아볼것
    setTimeout(() => {
      stompClient.subscribe(subscribePath, function (message) {
        const messageData = JSON.parse(message.body);

        console.log("MAC 주소:", messageData.mac);
        console.log("습도:", messageData.hum);
        console.log("온도:", messageData.temp);

        // const now = new Date(2024, 5, 1, 15, 45, 30);
        // console.log("Set specific date and time: " + now);

        onMessageReceived(messageData);
      });
      sendMessage(); // 연결 후에 메시지를 전송
    }, 1);
  };

  /**
   * [Method] 소켓 연결후 메시지를 전송하여 구독을 연결하는 메서드
   * 작성자: 김선규
   */
  const sendMessage = () => {
    const message = {
      mac: props.mac,
    };
    console.log("Sending message to /app/user:", message);
    stompClient.send("/app/device", {}, JSON.stringify(message));
  };

  function onError() {
    alert("연결 실패");
  }

  function disconnect() {
    stompClient.disconnect();
    setConnected(false);
  }

  /**
   * 몇몇 센서의 보정 메세지 전송 함수
   */
  function sendCalibrationMsg(message) {
    stompClient.send("/topic/" + props.mac, {}, message);
  }

  /**
   * [Method] OnConnected메서드 안의 메시지 받아 처리하는 메서드
   * 작성자: 김선규
   */
  function onMessageReceived(payload) {
    /**
     * 가장 최근 데이터가 수신된 시점 갱신
     * 데이터를 받았으므로 연결 끊김 여부를 false로 설정
     */

    setConnected(true);

    console.log("커넥션 상태 : " + connected);

    console.log("기기 정보 : " + props.name);

    // lastReceivedDate = new Date();
    // setIsConnectionDropped(false);

    /**
     * 받은 데이터 파싱
     */
    receiveObject = payload;

    // lastReceivedDate = receiveObject.dateString;

    /**
     * 저장 버튼 누르고 시작하면 데이터 저장
     * saveTest<boolean> : 저장버튼 true/false
     */
    if (saveTest) {
      console.log("저장 시작후 데이터 넣음 ");

      // receiveObject를 복제
      const updatedReceiveObject = { ...receiveObject };

      console.log("저장 ? :");
      console.log("dataType ? :" + dataTypes);
      console.log("selectedTypes ? :" + selectedTypes);

      updatedReceiveObject.username = props.username;

      if (periodTest !== "") {
        updatedReceiveObject.period = periodTest;
      }
      if (location !== "") {
        updatedReceiveObject.location = location;
      }

      const now = new Date();
      // const year = now.getFullYear().toString().padStart(4, "0");
      // const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
      // const day = now.getDate().toString().padStart(2, "0");
      // const hours = now.getHours().toString().padStart(2, "0");
      // const minutes = now.getMinutes().toString().padStart(2, "0");
      // const seconds = now.getSeconds().toString().padStart(2, "0");

      // const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      const formattedDateTime = now.toISOString;

      // console.log("똑바로된 date 인가 : " + formattedDateTime); // 생성된 날짜 문자열 로그 출력

      // updatedReceiveObject.dateString = formattedDateTime;

      // const lastSavedDate =
      //   saveData.length > 0
      //     ? new Date(JSON.parse(saveData[saveData.length - 1]))
      //     : (() => {
      //         const date = new Date();
      //         date.setTime(date.getTime() - 5000); // 5000밀리초 (5초)를 정확하게 빼줍니다.
      //         return date;
      //       })();

      // const currentObjectDate = new Date();

      // console.log("lastSavedDate : " + lastSavedDate);
      // console.log("currentObjectDate : " + formattedDateTime);

      // 두 날짜의 차이 계산 (밀리초 단위)
      // const timeDifference = currentObjectDate - lastSavedDate;

      // 5초(5000 밀리초) 차이 확인
      // if (timeDifference >= 5000) {
      //   console.log("5초 넘어가는 것! : " + timeDifference);

      // saveData.push(JSON.stringify(updatedReceiveObject));
      // setSaveData([...saveData]);
      // }

      // saveData.push(JSON.stringify(updatedReceiveObject));
      // setSaveData([...saveData]);

      console.log("저장버튼 누르고 저장한 것들 : " + saveData);

      // 기록 중지 버튼 누르면 지금까지 저장한 데이터들 저장 요청
      if (isFinished) {
        console.log("저장할 객체 : " + JSON.stringify(updatedReceiveObject));
        customAxios
          .post("/seed/save/continuous", { data: saveData, memo: memo })
          .then(() => {
            console.log(saveData); //location, period 확인
          })
          .catch((err) => console.log(err));

        // setSave(false);
        saveTest = false;
        isFinished = false;

        saveData.splice(0, saveData.length);
        setSaveData([...saveData]);
      }
    } else {
      console.log("저장 시작전 데이터 넣음");
      receivedDataView.push(receiveObject);
      // if (receivedDataView.length > 10) {
      //   receivedDataView.splice(0, 1);
      // }
      setReceivedDataView([...receivedDataView]);
    }
  }

  //modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [save, setSave] = useState(false);

  useEffect(() => {}, [saveTest, selectedTypes, isFinished]);

  useEffect(() => {
    register();
    onConnected();
  }, []);

  return (
    <div>
      <div
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          {connected && !isConnectionDropped && (
            <span
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "0.625rem",
                color: "blue",
              }}
            >
              <ImConnection size="20" /> 연결됨
            </span>
          )}

          {!connected && (
            <span
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "0.625rem",
                color: "red",
              }}
            >
              <MdError size="20" /> 연결 해제
            </span>
          )}

          {connected && isConnectionDropped && (
            <span
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "0.625rem",
                color: "red",
              }}
            >
              <MdSignalWifiStatusbarConnectedNoInternet size="20" /> 전송 중단
            </span>
          )}
        </div>

        {(!saveTest || (saveTest && selectedTypes.length === 0)) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 1.5rem",
              width: "10rem",
              height: "2rem",
              borderRadius: "0.625rem",
              background: "#666666",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={handleShow}
          >
            <FaPlay style={{ marginRight: "0.5rem" }} />
            데이터 기록
          </div>
        )}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>데이터 기록하기</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/*저장 간격*/}
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.25rem",
                  width: "11rem",
                  height: " 2rem",
                  borderRadius: "1.25rem",
                  background: "#CBE0FF",
                  marginRight: "1.5rem",
                }}
              >
                시간 간격
              </div>

              <input
                style={{
                  width: "40%",
                  height: "2rem",
                  borderRadius: "0.625rem",
                  background: "#fff",
                  border: "1px solid #d2d2d2",
                  outline: "none",
                  fontSize: "1.25rem",
                  padding: "0 1rem",
                  marginRight: "1rem",
                }}
                onChange={(e) => (periodTest = e.target.value)}
                placeholder="단위는 초"
              />
            </div>

            {/*측정 위치*/}
            <div style={{ display: "flex", marginTop: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.25rem",
                  width: "11rem",
                  height: " 2rem",
                  borderRadius: "1.25rem",
                  background: "#CBE0FF",
                  marginRight: "1.5rem",
                }}
              >
                측정 위치
              </div>

              <input
                style={{
                  width: "40%",
                  height: "2rem",
                  borderRadius: "0.625rem",
                  background: "#fff",
                  border: "1px solid #d2d2d2",
                  outline: "none",
                  fontSize: "1.25rem",
                  padding: "0 1rem",
                  marginRight: "1rem",
                }}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/*메모*/}
            <div style={{ display: "flex", marginTop: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.25rem",
                  width: "11rem",
                  height: " 2rem",
                  borderRadius: "1.25rem",
                  background: "#CBE0FF",
                  marginRight: "1.5rem",
                }}
                onChange={(e) => setMemo(e.target.value)}
              >
                메모
              </div>

              <input
                style={{
                  width: "40%",
                  height: "2rem",
                  borderRadius: "0.625rem",
                  background: "#fff",
                  border: "1px solid #d2d2d2",
                  outline: "none",
                  fontSize: "1.25rem",
                  padding: "0 1rem",
                  marginRight: "1rem",
                }}
                onChange={(e) => (memoTest = e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <Button
                style={{
                  width: "10rem",
                  borderRadius: "1.25rem",
                  background: "#d9dcff",
                  border: "none",
                  color: "#000",
                  fontSize: "1.25rem",
                }}
                onClick={() => {
                  if (selectedTypes.length === 0) {
                    alert("저장할 센서를 한 개 이상 선택해주세요.");
                  } else {
                    // setSave(true);
                    saveTest = true;
                  }
                  setShow(false);
                }}
              >
                확인
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {saveTest && selectedTypes.length !== 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 1.5rem",
              width: "10rem",
              height: "2rem",
              borderRadius: "0.625rem",
              background: "#666666",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={() => {
              isFinished = true;
            }}
          >
            <FaPause size="20" style={{ marginRight: "0.5rem" }} />
            기록 중지
          </div>
        )}
      </div>

      <div style={{ padding: "0 2rem 0.5rem 2rem" }}>
        {dataTypes.map((elem) => (
          <div key={elem}>
            <SingleDataContainer
              type={elem}
              data={receivedDataView}
              current={receivedDataView[receivedDataView.length - 1]}
              stomp={stompClient}
              sendFunction={sendCalibrationMsg}
              toggleSelection={toggleSelectedType}
              selectedTypes={selectedTypes}
            />
          </div>
        ))}

        <div
          style={{
            marginTop: "2.5rem",
          }}
        ></div>
      </div>
    </div>
  );
}
