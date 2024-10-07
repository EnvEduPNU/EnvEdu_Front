import { useState, useEffect } from 'react';
import './Socket.scss';
import { customAxios } from '../../Common/CustomAxios';
import SocketConnect from './SocketConnect';
import React from 'react';
import BackwardButton from './button/BackwardButton';

const disConnectFlag = 99999;

let globalClickCheck = null;

function useBlocker(when = true) {
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // 브라우저에서 경고 메시지를 띄우게 함
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when]);
}

/**
 * 연결된 기기 목록을 관리하는 컴포넌트입니다.
 */
export default function Index() {
  const [clickedIndex, setClickedIndex] = useState();
  const [connectableSocket, setConnectableSocket] = useState([]);

  useBlocker(globalClickCheck !== null);

  useEffect(() => {
    customAxios.get(`/seed/device`).then((response) => {
      setConnectableSocket(response.data.relatedUserDeviceList);
      console.log(
        '소켓 디바이스 내역 :' +
          JSON.stringify(response.data.relatedUserDeviceList),
      );
    });
    globalClickCheck = null;
  }, []);

  const handleShowing = (index) => {
    if (globalClickCheck === index && globalClickCheck !== null) {
      setClickedIndex(disConnectFlag);
    }

    if (globalClickCheck !== index && globalClickCheck !== null) {
      setClickedIndex(disConnectFlag);
    }

    if (globalClickCheck === null) {
      setClickedIndex(index);
    }
  };

  const ErrorhandleShowing = () => {
    setClickedIndex(false);
    globalClickCheck = null;
  };

  return (
    <div className="sample">
      {/* 연결된 기기 목록 제목과 뒤로가기 버튼 */}
      <div className="notification_container">
        <div className="notification_list" style={{ display: 'flex' }}>
          <div className="title">연결된 기기 목록</div>

          <BackwardButton buttonName={'뒤로가기'} />
        </div>
      </div>

      {/* 연결된 기기 목록 */}
      <div className="notification_container">
        {connectableSocket.map((item, index) => (
          <div key={index}>
            <div>
              {item.elements.map((element, elementIndex) => (
                <div
                  key={elementIndex}
                  className={`notification_list ${
                    clickedIndex === index ? 'opened' : ''
                  }`}
                >
                  <div className="notification_element">
                    <div className="device-name">{element.deviceName}</div>

                    <div style={{ display: 'flex' }}>
                      <div className="username-box">{item.username}</div>

                      <button
                        className="showBtn"
                        onClick={() => {
                          const clickCheck = index + elementIndex;

                          if (
                            globalClickCheck !== null &&
                            globalClickCheck !== clickCheck
                          ) {
                            handleShowing(clickCheck);
                          }

                          if (globalClickCheck === null) {
                            handleShowing(clickCheck);
                            globalClickCheck = clickCheck;
                            setClickedIndex(clickCheck);
                          }

                          if (globalClickCheck === clickedIndex) {
                            handleShowing(clickCheck);
                            globalClickCheck = null;
                          }
                        }}
                      >
                        {clickedIndex === index + elementIndex
                          ? '닫기'
                          : '데이터 보기'}
                      </button>
                    </div>
                  </div>

                  {clickedIndex === index + elementIndex && (
                    <SocketConnect
                      mac={element.mac}
                      name={element.deviceName}
                      username={item.username}
                      clickedIndex={clickedIndex}
                      ErrorhandleShowing={ErrorhandleShowing}
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
  );
}
