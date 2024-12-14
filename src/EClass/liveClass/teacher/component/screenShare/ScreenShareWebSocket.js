import React, { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const ScreenShareWebSocket = ({
  sessionIds,
  sendMessage,
  sharedScreenState,
}) => {
  const ScreanSharestompClients = useRef();

  useEffect(() => {
    console.log('sessionIds 는? : ' + sessionIds);

    const initializeSocketClient = (url, onConnectCallback) => {
      const token = localStorage
        .getItem('access_token')
        ?.replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}${url}?token=${token}`,
      );
      const client = new Client({ webSocketFactory: () => sock });

      client.onConnect = onConnectCallback;
      client.activate();

      return client;
    };

    ScreanSharestompClients.current = initializeSocketClient('/ws', (frame) => {
      console.log('커넥션 생성 완료 : ' + frame);

      sendMessageToServer(sharedScreenState);
    });

    return () => {
      if (ScreanSharestompClients.current)
        ScreanSharestompClients.current.deactivate();
    };
  }, [sessionIds, sharedScreenState]);

  const sendMessageToServer = async (state) => {
    if (sessionIds.length === 0) {
      console.error('세션 ID가 설정되지 않았습니다.');
      return;
    }

    for (const sessionId of sessionIds) {
      const message = { screenShared: state, sessionId };

      if (ScreanSharestompClients.current?.connected) {
        try {
          console.log('소켓 보내기', state, sessionId);
          await ScreanSharestompClients.current.publish({
            destination: '/app/screen-share-flag',
            body: JSON.stringify(message),
          });
          sendMessage(state); // 화면 공유 상태 변경
        } catch (error) {
          console.error('메시지 전송 오류:', error);
        }
      } else {
        console.error('STOMP 클라이언트가 연결되지 않았습니다.');
      }
    }
  };
};
