import { useState, useEffect, useContext } from "react";
import {
  useNavigate,
  UNSAFE_NavigationContext as NavigationContext,
} from "react-router-dom";
import "./Socket.scss";
import { customAxios } from "../../Common/CustomAxios";
import SocketConnect from "./SocketConnect";
import React from "react";
import BackwardButton from "./button/BackwardButton";

const disConnectFlag = 99999;
const noDeviceConnectFlag = 88888;

let globalClickCheck = null;

function useBlocker(blocker, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

/**
 * 연결된 기기 목록을 관리하는 컴포넌트입니다.
 * @author 김선규
 */
export default function Index() {
  const [clickedIndex, setClickedIndex] = useState();
  const [connectableSocket, setConnectableSocket] = useState([]);

  useBlocker((tx) => {
    if (globalClickCheck) {
      console.log("뒤로가기 감지 및 소켓 커넥션 종료");
      setClickedIndex(disConnectFlag);
    }

    tx.retry();
  });

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
    globalClickCheck = null;
  }, []);

  /**
   * 데이터 보기의 열고 닫는 버튼을 처리하는 메서드
   * @author 김선규
   */
  const handleShowing = (index) => {
    console.log("핸들쇼우 : " + globalClickCheck);
    console.log("인덱스 : " + index);

    // 같은 버튼 다시 누르면 닫기 버튼으로 연결 해제 해야함
    if (globalClickCheck === index && globalClickCheck !== null) {
      setClickedIndex(disConnectFlag);
      console.log("닫는 디바이스 인덱스1 : " + clickedIndex);
    }

    // 다른 버튼 누르면 이전에 버튼 연결 해제 시켜줘야함
    if (globalClickCheck !== index && globalClickCheck !== null) {
      setClickedIndex(disConnectFlag);
      console.log("닫는 디바이스 인덱스2 : " + clickedIndex);
    }

    // 전역 변수들 연결 해제할때마다 초기화 시켜주기 때문에 연결 버튼은 항상 초기화 상태에서 진행
    if (globalClickCheck === null) {
      console.log("데이터보기 누름 : " + index);
      setClickedIndex(index);
    }
  };

  const ErrorhandleShowing = () => {
    setClickedIndex(false);
    globalClickCheck = null;
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
                      clickedIndex === index ? "opened" : ""
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
                            // 디바이스 데이터 보는 중에 다른 디바이스 보기 누르면 소켓 연결 종료
                            const clickCheck = index + elementIndex;

                            console.log("뭔데이거 : " + clickCheck);
                            console.log("그럼이거는 : " + globalClickCheck);

                            // 맨처음 누르는 것이 아니고 현재 버튼과 다르다면 현재 버튼을 연결 해제해야함
                            if (
                              globalClickCheck !== null &&
                              globalClickCheck !== clickCheck
                            ) {
                              console.log("여기들어옴?");
                              handleShowing(clickCheck);
                            }

                            // 맨처음 누르는 것이면 현재 버튼을 연결해야함
                            if (globalClickCheck === null) {
                              console.log("여기들어옴?2");

                              handleShowing(clickCheck);
                              globalClickCheck = clickCheck;
                              console.log("디바이스 선택");
                              setClickedIndex(clickCheck);
                            }

                            // 같은 버튼 또 다시 들어오면 닫기 버튼 누르는거라 연결 해제해야함
                            if (globalClickCheck === clickedIndex) {
                              console.log("여기들어옴?3");

                              handleShowing(clickCheck);
                              globalClickCheck = null;
                              console.log("디바이스 해제");
                            }
                          }}
                        >
                          {clickedIndex === index + elementIndex
                            ? "닫기"
                            : "데이터 보기"}
                        </div>
                      </div>
                    </div>
                    {/* 소켓 연결하고 메시지 받는 곳으로 넘김 */}
                    {clickedIndex === index + elementIndex && (
                      <SocketConnect
                        mac={element.mac}
                        name={element.deviceName}
                        username={item.username}
                        clickedIndex={clickedIndex}
                        ErrorhandleShowing={ErrorhandleShowing}
                      />
                    )}

                    {/*  */}
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
          <BackwardButton buttonName={"뒤로가기"} />
        </div>
      </div>
    </div>
  );
}
