import React, { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const ScreenShareWebSocket = ({
  sessionIds,
  sendMessage,
  sharedScreenState,
}) => {
  const ScreanSharestompClients = useRef();

  const initializeSocketClient = (url, onConnectCallback) => {
    const token = localStorage.getItem('access_token').replace('Bearer ', '');
    const sock = new SockJS(
      `${process.env.REACT_APP_API_URL}${url}?token=${token}`,
    );
    const client = new Client({ webSocketFactory: () => sock });

    client.onConnect = onConnectCallback;
    client.activate();

    return client;
  };

  useEffect(() => {
    // 화면 공유 소켓 연결
    ScreanSharestompClients.current = initializeSocketClient('/ws', (frame) => {
      console.log('화면 공유 소켓 연결 성공 : ', frame);
    });

    return () => {
      if (ScreanSharestompClients.current)
        ScreanSharestompClients.current.deactivate();
    };
  }, []);

  // 화면 공유 상태 전송 함수
  useEffect(() => {
    console.log('공유 메시지 변경 : ' + sharedScreenState);

    const sendMessageToServer = async (state) => {
      //   if (sessionIds.length === 0) {
      //     console.error('세션 ID가 설정되지 않았습니다.');
      //     return;
      //   }

      //   for (const sessionId of sessionIds) {
      const message = { screen: true, sessionId: '' };

      if (ScreanSharestompClients.current.connected) {
        try {
          console.log('소켓 보내기', state, 'test');
          await ScreanSharestompClients.current.publish({
            destination: '/app/student-entereds',
            body: JSON.stringify(message),
            headers: {}, // 선택적 헤더
          });
          sendMessage(state); // 화면 공유 상태 변경
        } catch (error) {
          console.error('메시지 전송 오류:', error);
        }
      } else {
        console.error('STOMP 클라이언트가 연결되지 않았습니다.');
      }
      //   }
    };
    sendMessageToServer(sharedScreenState);
  }, [sessionIds, sharedScreenState]);

  return null;
};
