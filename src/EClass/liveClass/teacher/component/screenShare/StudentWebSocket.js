import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { customAxios } from '../../../../../Common/CustomAxios';
export const StudentWebSocket = ({ setSessionIds }) => {
  const stompClients = useRef();

  const initializeSocketClient = (url, onConnectCallback) => {
    const token = localStorage.getItem('access_token')?.replace('Bearer ', '');
    const sock = new SockJS(
      `${process.env.REACT_APP_API_URL}${url}?token=${token}`,
    );
    const client = new Client({ webSocketFactory: () => sock });

    client.onConnect = onConnectCallback;
    client.activate();

    return client;
  };

  useEffect(() => {
    const fetchSessionIds = async () => {
      const response = await customAxios.get('/api/sessions/get-session-ids');
      setSessionIds(response.data);
      console.log('참여한 학생 : ', JSON.stringify(response.data, null, 2));
    };

    fetchSessionIds();

    // 학생 소켓 연결
    stompClients.current = initializeSocketClient('/ws', (frame) => {
      console.log('학생 입장 소켓 연결 성공 : ', frame);
      stompClients.current.subscribe('/topic/student-entered', (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log('학생 상태 : ' + JSON.stringify(parsedMessage, null, 2));
        setTimeout(() => fetchSessionIds(), 1000);
      });
    });

    return () => {
      if (stompClients.current) stompClients.current.deactivate();
    };
  }, [setSessionIds]);

  return null;
};
