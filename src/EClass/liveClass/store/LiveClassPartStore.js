import { create } from "zustand";

export const useLiveClassPartStore = create((set, get) => ({
  sessionIds: [],
  addSessionId: (sessionId) =>
    set((state) => ({
      sessionIds: [
        ...state.sessionIds,
        { id: sessionId, shared: false, assginmentShared: false },
      ],
    })),
  removeSessionId: (sessionId) =>
    set((state) => ({
      sessionIds: state.sessionIds.filter(
        (session) => session.id !== sessionId
      ),
    })),
  setSessionIds: (sessionIds) =>
    set({
      sessionIds: sessionIds.map((id) => ({
        id,
        shared: false,
        assginmentShared: false,
      })),
    }),
  updateShareStatus: (sessionId, shared, assginmentShared) =>
    set((state) => ({
      sessionIds: state.sessionIds.map((session) =>
        session.id === sessionId
          ? { ...session, shared, assginmentShared }
          : session
      ),
    })),
  hasSessionId: (sessionId) =>
    get().sessionIds.some((session) => session.id === sessionId),
}));
