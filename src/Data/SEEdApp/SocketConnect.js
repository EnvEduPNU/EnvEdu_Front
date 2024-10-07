import React, { useEffect, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import { ImConnection } from 'react-icons/im';
import DataRecordModal from './modal/DataRecordModal';
import DataSubscriber from './message/DataSubscriber';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const disConnectFlag = 99999;

export default function SocketConnect(props) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');
  const [connected, setConnected] = useState(false);
  const [receivedDataView, setReceivedDataView] = useState([]);
  const [isConnectionDropped, setIsConnectionDropped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stompClientItem, setStompClientItem] = useState(null);
  const [connectTest, setConnectTest] = useState(false);
  const [saveTest, setSaveTest] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (props.clickedIndex === disConnectFlag) {
      setIsConnectionDropped(true);
      return disconnect();
    }
    if (props.clickedIndex !== disConnectFlag) {
      register();
    }
  }, [props]);

  // 소켓 연결 메서드
  function register() {
    let sock;
    try {
      sock = new SockJS(
        `${
          process.env.REACT_APP_API_URL
        }/client/socket?deviceName=${encodeURIComponent(props.name)}`,
      );
    } catch (error) {
      handleSocketError('SockJS 인스턴스 생성 실패:', error);
      return;
    }

    const stompClient = new Client({ webSocketFactory: () => sock });

    stompClient.onConnect = () => {
      setConnectTest(true);
      setStompClientItem(stompClient);
      setConnected(true);
    };

    stompClient.onStompError = (error) =>
      handleSocketError('STOMP 연결 에러:', error);

    stompClient.activate();

    sock.onclose = (event) => handleSocketClose(event);
    sock.onerror = (event) => handleSocketError('WebSocket 에러 발생:', event);
  }

  function handleSocketClose(event) {
    if (!event.wasClean) {
      handleSocketError('WebSocket 연결이 닫혔습니다:', event);
    }
  }

  function handleSocketError(message, error) {
    console.error(message, error);
    alert('연결 중 문제가 발생했습니다. 콘솔 로그를 확인하세요.');
    props.ErrorhandleShowing();
    setIsConnectionDropped(true);
  }

  function disconnect() {
    if (stompClientItem) {
      stompClientItem.deactivate();
      setConnected(false);
    }
  }

  // 모달 열기
  const handleShow = () => {
    if (selectedTypes.length === 0) {
      alert('저장할 데이터를 선택해주세요!');
    } else {
      setShowModal(true);
    }
  };

  // 공통 스타일링
  const buttonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 1.5rem',
    width: '10rem',
    height: '2rem',
    borderRadius: '0.625rem',
    background: '#666666',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <div>
      {!isConnectionDropped && (
        <div
          style={{
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {connected ? (
              <span
                style={{
                  padding: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '0.625rem',
                  color: 'blue',
                }}
              >
                <ImConnection size="20" /> 연결됨
              </span>
            ) : (
              <span
                style={{
                  padding: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '0.625rem',
                  color: 'red',
                }}
              >
                <MdError size="20" /> 연결 해제
              </span>
            )}
          </div>

          {connected && (
            <div
              style={buttonStyle}
              onClick={
                saveTest && selectedTypes.length !== 0
                  ? () => setIsFinished(true)
                  : handleShow
              }
            >
              {saveTest && selectedTypes.length !== 0 ? (
                <>
                  <FaPause size="20" style={{ marginRight: '0.5rem' }} />
                  기록 중지
                </>
              ) : (
                <>
                  <FaPlay style={{ marginRight: '0.5rem' }} />
                  데이터 기록
                </>
              )}
            </div>
          )}

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
          location={location}
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
