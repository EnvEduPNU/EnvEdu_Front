import React, { useEffect, useState } from "react";
import { customAxios } from "../../../Common/CustomAxios";
import SingleDataContainer from "../SingleDataContainer";

import moment from "moment-timezone";

let receiveObject = null; //받은 데이터를 객체로 관리하기 위한 용도
let periodTest = "";
let saveTest = false;

let saveData = [];

let saveProps = [];

let firstTimeFlag = true;

function DataSubscriber(props) {
  const [stompClient, setStompClient] = useState(null);

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

  useEffect(() => {
    console.log("DataSubscriber 작동 확인");

    // 초기화
    props.setIsFinished(false);
    props.setSaveTest(false);
    saveData = [];

    if (props.connection === true && !stompClient) {
      console.log("스톰프 세팅");
      setStompClient(props.stompClient);
    }
  }, []);

  useEffect(() => {
    if (props.connection === true && stompClient) {
      console.log("커넥션 실행");
      onConnected();
    }
  }, [stompClient]);

  useEffect(() => {
    if (props.saveTest === true) {
      console.log("세이브 테스트 점검");
      saveTest = true;
      saveProps = props;
    }
  }, [props]);

  const onConnected = () => {
    const subscribePath = "/topic/user/" + props.mac;
    console.log("구독 주소 : " + subscribePath);

    console.log("스톰프 클라이언트 존재 : " + stompClient);

    setTimeout(() => {
      const subscription = stompClient?.subscribe(subscribePath, (message) => {
        const messageData = JSON.parse(message.body);
        console.log("들어오는 메시지:", messageData);
        onMessageReceived(messageData);
      });

      if (subscription) {
        console.log("구독 성공!");
        sendMessage();
        props.setConnected(true);
      }
    }, 1000);
  };

  /**
   * [Method] OnConnected메서드 안의 메시지 받아 처리하는 메서드
   * 작성자: 김선규
   */
  function onMessageReceived(payload) {
    console.log("커넥션 상태 : " + props.connection);
    console.log("기기 정보 : " + props.deviceName);
    console.log("세이브 테스트 여부 : " + saveTest);

    receiveObject = payload;

    // 저장을 누르는 순간 재랜더링이 되어야 하기 때문에 상태가 사라진다
    if (saveTest) {
      console.log("저장 시작후 데이터 넣음 ");
      console.log("데이터 타입 종류 :" + dataTypes);
      console.log("저장할 데이터 타입 :" + saveProps.selectedTypes);

      // receiveObject를 복제
      const updatedReceiveObject = { ...receiveObject };

      updatedReceiveObject.username = saveProps.username;

      if (periodTest !== "") {
        updatedReceiveObject.period = periodTest;
      }
      if (props.location !== "") {
        updatedReceiveObject.location = saveProps.location;
      }

      const currentTime = moment().tz("Asia/Seoul");

      const lastSavedDate =
        saveData.length > 0 ? saveData[saveData.length - 1] : (() => {})();

      if (saveData.length === 0) {
        console.log("맨처음 시간 저장");
        updatedReceiveObject.dateString = currentTime.format(
          "YYYY-MM-DDTHH:mm:ss"
        ); // Moment 객체를 ISO 문자열로 저장
        saveData.push(JSON.stringify(updatedReceiveObject));
      } else {
        let dataObject = JSON.parse(lastSavedDate);
        const lastSavedDateTime = new Date(dataObject.dateString); // 문자열을 Date 객체로 변환

        console.log("이전 날짜 시간 : " + lastSavedDateTime);
        console.log("현재 날짜 시간 : " + currentTime.toISOString());

        // 두 날짜의 차이를 계산한다 (밀리초 단위)
        const timeDifference =
          currentTime.valueOf() - lastSavedDateTime.getTime();
        console.log("두 날짜의 차이: " + timeDifference);

        const periodSetting = saveProps.period;

        console.log("시간간격 : " + periodSetting);

        // 저장할 시간 간격(초)에 한번씩 저장하도록
        if (timeDifference >= periodSetting * 1000) {
          console.log(`${periodSetting}초에 한번씩 저장!!`);
          updatedReceiveObject.dateString = currentTime.format(
            "YYYY-MM-DDTHH:mm:ss"
          );
          saveData.push(JSON.stringify(updatedReceiveObject));
        } else {
          console.log("차이 안나 저장 안함");
        }
      }

      console.log(
        "updatedReceiveObject 정체를 밝혀라 : " +
          JSON.stringify(updatedReceiveObject)
      );

      console.log("saveData 정체를 밝혀라 : " + JSON.stringify(saveData));

      // 기록 중지 버튼 누르면 지금까지 저장한 데이터들 저장 요청
      if (saveProps.isFinished) {
        console.log("저장할 객체 : " + JSON.stringify(updatedReceiveObject));
        customAxios
          .post("/seed/save/continuous", {
            data: saveData,
            memo: saveProps.memo,
          })
          .then(() => {
            console.log(saveData); //location, period 확인
          })
          .catch((err) => console.log(err));

        //초기화
        saveTest = false;
        props.setIsFinished(false);
        props.setSaveTest(false);
        saveData = [];
        firstTimeFlag = false;
      }
    } else {
      // 저장하기 위해서 재 랜더링이 안된 상태이기 때문에 props를 바로 써도 가능하다
      console.log("저장 시작전 데이터 넣음");
      props.receivedDataView.push(receiveObject);

      props.setReceivedDataView([...props.receivedDataView]);
    }
  }

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

  /**
   * [Method] 선택된 데이터 타입을 토글하는 메서드
   * 작성자: 김선규
   */
  const toggleSelectedType = (type) => {
    console.log("타입 데이터 리프팅 확인 : " + type);

    props.setSelectedTypes((prev) => {
      return prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
    });
  };

  /**
   * 몇몇 센서의 보정 메세지 전송 함수
   */
  function sendCalibrationMsg(message) {
    stompClient.send("/topic/" + props.mac, {}, message);
  }

  return (
    <div style={{ padding: "0 2rem 0.5rem 2rem" }}>
      {dataTypes.map((elem) => (
        <div key={elem}>
          <SingleDataContainer
            type={elem}
            data={props.receivedDataView}
            current={props.receivedDataView[props.receivedDataView.length - 1]}
            stomp={stompClient}
            sendFunction={sendCalibrationMsg}
            toggleSelection={toggleSelectedType}
            selectedTypes={props.selectedTypes}
            saveTest={saveTest}
          />
        </div>
      ))}
    </div>
  );
}

export default DataSubscriber;
