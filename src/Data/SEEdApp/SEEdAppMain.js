import { useState, useEffect, useContext } from 'react';
import {
  useNavigate,
  UNSAFE_NavigationContext as NavigationContext,
} from 'react-router-dom';
import './Socket.scss';
import { customAxios } from '../../Common/CustomAxios';
import SocketConnect from './SocketConnect';
import React from 'react';
import BackwardButton from './button/BackwardButton';

const disConnectFlag = 99999;
const noDeviceConnectFlag = 88888;

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

  // 서버쪽 device폴더->컨트롤러 -> UserDeviceController
  // 관련 디바이스 리스트를 가져온다.
  // 들어와서 한번만 실행돼야 한다
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
    console.log('핸들쇼우 : ' + globalClickCheck);
    console.log('인덱스 : ' + index);

    if (globalClickCheck === index && globalClickCheck !== null) {
      setClickedIndex(disConnectFlag);
      console.log('닫는 디바이스 인덱스1 : ' + clickedIndex);
    }

    if (globalClickCheck !== index && globalClickCheck !== null) {
      setClickedIndex(disConnectFlag);
      console.log('닫는 디바이스 인덱스2 : ' + clickedIndex);
    }

    if (globalClickCheck === null) {
      console.log('데이터보기 누름 : ' + index);
      setClickedIndex(index);
    }
  };

  const ErrorhandleShowing = () => {
    setClickedIndex(false);
    globalClickCheck = null;
  };

  return (
    <div style={{ fontSize: '1.5em' }} className="sample">
      <div className="row d-flex justify-content-center">연결된 기기 목록</div>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
      >
        <div className="notification_container">
          {connectableSocket.map((item, index) => (
            <div key={index}>
              <div style={{ width: '100%', height: '100%' }}>
                {item.elements.map((element, elementIndex) => (
                  <div
                    key={elementIndex}
                    className={`notification_list ${
                      clickedIndex === index ? 'opened' : ''
                    }`}
                  >
                    <div
                      className="notification_element"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '1.875rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '1.25rem',
                          width: '15rem',
                          height: '2rem',
                          borderRadius: '1.25rem',
                          background: '#D9DCFF',
                        }}
                      >
                        {element.deviceName}
                      </div>

                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            textAlign: 'center',
                            background: '#CBE0FF',
                            width: '10.875rem',
                            height: '2.375rem',
                            borderRadius: '1.25rem',
                            fontSize: '1.25rem',
                            marginRight: '1rem',
                          }}
                        >
                          {item.username}
                        </div>

                        <div
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
                              console.log('디바이스 해제');
                            }
                          }}
                        >
                          {clickedIndex === index + elementIndex
                            ? '닫기'
                            : '데이터 보기'}
                        </div>
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
          <BackwardButton buttonName={'뒤로가기'} />
        </div>
      </div>
    </div>
  );
}
