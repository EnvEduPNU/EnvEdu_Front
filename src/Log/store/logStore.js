import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; // v4 방식의 UUID 생성

export const useLogStore = create((set, get) => ({
  logUuid: '',
  username: '',
  logCollectionStartTime: '',
  logCollectionEndTime: '',
  graphImage: '',
  dataUUID: null,
  content: [],

  startLog: (username, dataUUID) =>
    set((state) => {
      const copiedLogData = {
        logUuid: '',
        username: '',
        logCollectionStartTime: '',
        logCollectionEndTime: '',
        graphImage: '',
        dataUUID: null,
        content: [],
      };
      copiedLogData.logUuid = uuidv4();
      copiedLogData.username = username;
      copiedLogData.logCollectionStartTime = new Date().toISOString();
      copiedLogData.content.push({
        logTime: new Date().toISOString(),
        buttonName: '데이터 선택',
        memo: dataUUID,
      });
      //    copiedLogData.dataUUID = dataUUID;
      return copiedLogData;
    }),

  addContent: (content) =>
    set((state) => {
      const copiedLogData = {
        ...state,
        content: state.content.map((item) => ({
          logTime: item.logTime,
          buttonName: item.buttonName,
          memo: item.memo,
        })),
      };
      copiedLogData.content.push(content);
      return copiedLogData;
    }),
}));
