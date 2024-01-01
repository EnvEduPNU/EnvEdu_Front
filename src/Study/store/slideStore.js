import { create } from "zustand";

export const useSlideStore = create((set, get) => ({
  isShowTop: false,
  isShowRight: false,
  isShowLeft: false,
  isShowBottom: false,
  showTop: () => set(state => ({ ...state, isShowTop: true })),
  showBottom: () => set(state => ({ ...state, isShowBottom: true })),
  showRight: () => set(state => ({ ...state, isShowRight: true })),
  showLeft: () => set(state => ({ ...state, isShowLeft: true })),

  closeTop: () => set(state => ({ ...state, isShowTop: false })),
  closeBottom: () => set(state => ({ ...state, isShowBottom: false })),
  closeRight: () => set(state => ({ ...state, isShowRight: false })),
  closeLeft: () => set(state => ({ ...state, isShowLeft: false })),
}));
