import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { MdSignalWifiStatusbarConnectedNoInternet } from "react-icons/md";
import { ImConnection } from "react-icons/im";

import DataRecordModal from "./modal/DataRecordModal";
import DataSubscriber from "./message/DataSubscriber";

/**
 * 전역 변수 관리
 * 작성자: 김선규
 */
const stomp = require("stompjs"); //웹 소켓 연결을 위한 stompClient
//let stompClient = null;
const disConnectFlag = 99999;
const noDeviceConnectFlag = 88888;

let globalStompClient = null;

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
  const [connected, setConnected] = useState(false); //현재 웹 소켓 연결 여부
  const [receivedDataView, setReceivedDataView] = useState([]);
  const [isConnectionDropped, setIsConnectionDropped] = useState(false); //연결 끊김 여부

  const [connectTest, setConnectTest] = useState(false);
  const [saveTest, setSaveTest] = useState(false);

  const [isFinished, setIsFinished] = useState(false);

  const [stompClientItem, setStompClientItem] = useState();

  useEffect(() => {
    if (props.clickedIndex == disConnectFlag) {
      console.log("커넥션 닫기 됨");
      setIsConnectionDropped(true);
      return disconnect();
    }
    if (
      props.clickedIndex != disConnectFlag &&
      props.clickedIndex != noDeviceConnectFlag
    ) {
      register();
    }
  }, []);

  useEffect(() => {
    console.log("재랜더링 커넥션 테스트 : " + connectTest);
    console.log("커넥션에서 세이브 테스트 : " + saveTest);
  }, [saveTest, selectedTypes, isFinished, connectTest, stompClientItem]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("이 메시지는 5초마다 출력됩니다!");
  //   }, 5000); // 5000ms = 5초

  //   // 컴포넌트가 언마운트될 때 인터벌을 정리합니다
  //   return () => clearInterval(interval);
  // }, []);

  /**
   * [Method] 소켓을 등록하는 메서드
   * 작성자: 김선규
   */
  function register() {
    let sock;
    try {
      console.log("프롭스의 이름 : " + props.name);

      sock = new SockJS(
        `${
          process.env.REACT_APP_API_URL
        }/client/socket?deviceName=${encodeURIComponent(props.name)}`
      );
    } catch (error) {
      console.error("SockJS 인스턴스 생성 실패:", error);
      alert("서버 연결에 실패했습니다. 서버 설정을 확인해주세요.");
      props.ErrorhandleShowing();
      setIsConnectionDropped(true);
      return;
    }

    const stompClient = stomp.over(sock);

    // 헤더 객체 생성
    const headers = {
      "Connection-Path": "/client/socket", // 이 위치에 필요한 헤더를 추가
    };

    if (stompClient && !stompClient.connected) {
      stompClient.connect(
        headers,
        () => {
          setConnectTest(true); // 연결 성공 시 상태 업데이트
          setStompClientItem(stompClient);
          globalStompClient = stompClient;
          console.log("커넥션 생성 디바이스 이름: " + props.name);
          console.log("스톰프 존재하는지 : " + stompClient);
        },
        onError
      );
    } else {
      console.log("커넥션이 이미 있습니다.");
    }

    // 에러 이벤트 핸들러를 등록
    sock.onclose = function (event) {
      console.error("WebSocket 연결이 닫혔습니다:", event);
      if (event.wasClean === false) {
        alert("디바이스의 연결을 확인해 주세요!");
        props.ErrorhandleShowing();
        setIsConnectionDropped(true);
      }
    };

    sock.onerror = function (event) {
      console.error("WebSocket 에러 발생:", event);
      alert("연결 중 에러가 발생했습니다. 콘솔 로그를 확인해주세요.");
      props.ErrorhandleShowing();
      setIsConnectionDropped(true);
    };
  }

  function onError(error) {
    console.error("STOMP 연결 에러:", error);
    alert(
      "웹소켓 연결에 실패했습니다. 네트워크 설정을 확인하거나 관리자에게 문의하세요."
    );
    props.ErrorhandleShowing();
    setIsConnectionDropped(true);
  }

  function disconnect() {
    globalStompClient.disconnect();
    setConnected(false);
  }

  //modal
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => {
    if (
      selectedTypes == "" ||
      selectedTypes == undefined ||
      selectedTypes == null
    ) {
      alert("저장할 데이터를 선택해주세요!");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div>
      {!isConnectionDropped && (
        <div
          style={{
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            {connected && (
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

            {/* {!connected && (
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
            )} */}
          </div>

          {/* 기록 시작 버튼 */}
          {(!saveTest || (saveTest && selectedTypes.length === 0)) &&
            connected && (
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

          {/* 기록 중단 버튼 */}
          {saveTest && selectedTypes.length !== 0 && connected && (
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
                setIsFinished(true);
              }}
            >
              <FaPause size="20" style={{ marginRight: "0.5rem" }} />
              기록 중지
            </div>
          )}

          {/* 기록 시작하면 데이터 저장하기 위한 모달창 뜸 */}
          {showModal && (
            <DataRecordModal
              show={showModal}
              onHide={() => setShowModal(false)}
              period={period}
              setPeriod={setPeriod}
              location={location}
              setLocation={setLocation}
              memo={memo}
              setMemo={setMemo}
              setSaveTest={setSaveTest}
            />
          )}
        </div>
      )}

      {connectTest && (
        <DataSubscriber
          connection={connectTest}
          setConnected={setConnected}
          location={props.location}
          memo={memo}
          mac={props.mac}
          deviceName={props.name}
          username={props.username}
          selectedTypes={selectedTypes}
          saveTest={saveTest}
          isFinished={isFinished}
          receivedDataView={receivedDataView}
          setReceivedDataView={setReceivedDataView}
          setSelectedTypes={setSelectedTypes}
          setIsFinished={setIsFinished}
          stompClient={stompClientItem}
          setSaveTest={setSaveTest}
          period={period}
        />
      )}
    </div>
  );
}
