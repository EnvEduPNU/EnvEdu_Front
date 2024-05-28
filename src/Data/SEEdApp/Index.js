import { useState, useEffect } from "react";
import "./Socket.scss";
import { customAxios } from "../../Common/CustomAxios";
import SocketConnect from "./SocketConnect";
import React from "react";

const disConnectFlag = 99999;
/**
 * 연결된 기기 목록을 관리하는 컴포넌트입니다.
 * @author 김선규
 */
export default function Index() {
  const [clickedIndex, setClickedIndex] = useState();
  const [connectableSocket, setConnectableSocket] = useState([]);

  // 서버쪽 device폴더->컨트롤러 -> UserDeviceController
  // 관련 디바이스 리스트를 가져온다.
  // 들어와서 한번만 실행돼야 한다
  useEffect(() => {
    customAxios.get(`/seed/device`).then((response) => {
      setConnectableSocket(response.data.relatedUserDeviceList);
      console.log(
        "소켓 디바이스 내역 :" +
          JSON.stringify(response.data.relatedUserDeviceList)
      );
    });
  }, []);

  /**
   * 데이터 보기의 열고 닫는 버튼을 처리하는 메서드
   * @author 김선규
   */
  const handleShowing = (index) => {
    if (clickedIndex == index) {
      setClickedIndex(disConnectFlag);
      console.log("닫는 디바이스 인덱스 : " + clickedIndex);
    } else {
      console.log("데이터보기 누름 : " + clickedIndex);
      setClickedIndex(index);
    }
  };

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
                      clickedIndex == index ? "opened" : ""
                    }`}
                  >
                    <div
                      className="notification_element"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTopRightRadius: "1.875rem",
                        borderTopLeftRadius: "1.875rem",
                        borderBottomRightRadius: "1.875rem",
                        borderBottomLeftRadius: "1.875rem",
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
                            handleShowing(index + elementIndex);
                          }}
                        >
                          {clickedIndex === index + elementIndex
                            ? "닫기"
                            : "데이터 보기"}
                        </div>
                      </div>
                    </div>

                    {console.log("유저의 인덱스 : " + (index + elementIndex))}

                    {/* 소켓 연결하고 메시지 받는 곳으로 넘김 */}
                    {clickedIndex === index + elementIndex && (
                      <SocketConnect
                        mac={element.mac}
                        name={element.deviceName}
                        username={item.username}
                        clickedIndex={clickedIndex}
                      />
                    )}

                    {clickedIndex === disConnectFlag && (
                      <SocketConnect
                        mac={null}
                        name={null}
                        username={null}
                        clickedIndex={clickedIndex}
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
