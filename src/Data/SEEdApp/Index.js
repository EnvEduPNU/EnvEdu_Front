import { useState, useEffect } from "react";
import "./Socket.scss";
import { customAxios } from "../../Common/CustomAxios";
//import UserMacList from "./UserMacList";
import SocketConnect from "./SocketConnect";

import React, { useRef } from "react";

export default function Index() {
  const [clickedIndexes, setClickedIndexes] = useState([]);

  const handleShowing = (index) => {
    if (clickedIndexes.includes(index)) {
      setClickedIndexes(clickedIndexes.filter((i) => i !== index));
      console.log(
        "닫기 버튼 누름 : " + clickedIndexes.filter((i) => i !== index)
      );
    } else {
      console.log("데이터보기 누름");
      setClickedIndexes([...clickedIndexes, index]);
    }
  };

  const [connectableSocket, setConnectableSocket] = useState([]);

  // 서버쪽 device폴더->컨트롤러 -> UserDeviceController
  // 관련 디바이스 리스트를 가져온다.
  useEffect(() => {
    customAxios.get(`/seed/device`).then((response) => {
      setConnectableSocket(response.data.relatedUserDeviceList);
      console.log(
        "소켓 디바이스 내역 :" +
          JSON.stringify(response.data.relatedUserDeviceList)
      );
    });
  }, []);

  return (
    <div style={{ fontSize: "1.5em" }} className="sample">
      <div className="row d-flex justify-content-center">연결된 기기 목록</div>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <div className="notification_container">
          {connectableSocket.map((item, index) => (
            <div key={index}>
              <div style={{ width: "100%", height: "100%" }}>
                {item.elements.map((element, elementIndex) => (
                  <div
                    key={elementIndex}
                    className={`notification_list ${
                      clickedIndexes.includes(elementIndex) ? "opened" : ""
                    }`}
                  >
                    <div
                      // key={elementIndex}
                      className="notification_element"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTopRightRadius:
                          clickedIndexes.includes(index - 1) || index == 0
                            ? "1.875rem"
                            : 0,
                        borderTopLeftRadius:
                          clickedIndexes.includes(index - 1) || index == 0
                            ? "1.875rem"
                            : 0,
                        borderBottomRightRadius:
                          connectableSocket.length - 1 == index ||
                          clickedIndexes.includes(index)
                            ? "1.875rem"
                            : 0,
                        borderBottomLeftRadius:
                          connectableSocket.length - 1 == index ||
                          clickedIndexes.includes(index)
                            ? "1.875rem"
                            : 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "1.25rem",
                          width: "15rem",
                          height: " 2rem",
                          borderRadius: "1.25rem",
                          background: "#D9DCFF",
                        }}
                      >
                        {element.deviceName}
                      </div>

                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            textAlign: "center",
                            background: "#CBE0FF",
                            width: "10.875rem",
                            height: "2.375rem,",
                            borderRadius: "1.25rem",
                            fontSize: "1.25rem",
                            marginRight: "1rem",
                          }}
                        >
                          {item.username}
                        </div>

                        <div
                          className="showBtn"
                          onClick={() => {
                            handleShowing(index);
                            console.log("버튼 인덱스 : " + clickedIndexes);
                            //handleRegister();

                            /*
                                                    console.log(clickedIndexes.includes(index))
                                                    if (!clickedIndexes.includes(index)) {
                                                        handleRegister();
                                                    }*/
                          }}
                        >
                          {clickedIndexes.includes(index)
                            ? "닫기"
                            : "데이터 보기"}
                        </div>
                      </div>
                    </div>

                    {/* 소켓 연결하고 메시지 받는 곳으로 넘김 */}
                    {clickedIndexes.includes(index) && (
                      <SocketConnect
                        // ref={sampleSocketRef}
                        mac={element.mac}
                        name={element.deviceName}
                        username={item.username}
                        clickedIndexes={clickedIndexes}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
