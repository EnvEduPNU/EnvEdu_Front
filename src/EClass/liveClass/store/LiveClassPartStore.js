import { create } from "zustand";

export const useLiveClassPartStore = create((set, get) => ({
  sessionIds: [],
  addSessionId: (sessionId) =>
    set((state) => ({
      sessionIds: [...state.sessionIds, { id: sessionId, shared: false }],
    })),
  removeSessionId: (sessionId) =>
    set((state) => ({
      sessionIds: state.sessionIds.filter(
        (session) => session.id !== sessionId
      ),
    })),
  setSessionIds: (sessionIds) =>
    set({ sessionIds: sessionIds.map((id) => ({ id, shared: false })) }),
  updateShareStatus: (sessionId, shared) =>
    set((state) => ({
      sessionIds: state.sessionIds.map((session) =>
        session.id === sessionId ? { ...session, shared } : session
      ),
    })),
  hasSessionId: (sessionId) =>
    get().sessionIds.some((session) => session.id === sessionId),
}));
