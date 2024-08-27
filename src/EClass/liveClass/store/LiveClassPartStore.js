import { create } from "zustand";

export const useLiveClassPartStore = create((set, get) => ({
  sessionIds: [],
  addSessionId: (sessionId) =>
    set((state) => ({
      sessionIds: [
        ...state.sessionIds,
        {
          id: sessionId,
          shared: false,
          assginmentShared: false,
          assginmentSubmit: false,
          reportSubmit: false,
        },
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
        assginmentSubmit: false,
        reportSubmit: false,
      })),
    }),
  updateShareStatus: (
    sessionId,
    shared,
    assginmentShared,
    assginmentSubmit,
    reportSubmit
  ) =>
    set((state) => ({
      sessionIds: state.sessionIds.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              shared,
              assginmentShared,
              assginmentSubmit,
              reportSubmit,
            }
          : session
      ),
    })),
  hasSessionId: (sessionId) =>
    get().sessionIds.some((session) => session.id === sessionId),
}));
