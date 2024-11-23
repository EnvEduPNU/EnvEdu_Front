import { create } from 'zustand';

export const useCreateLectureSourceStore = create((set, get) => ({
  lectureName: '',
  stepCount: 0,
  contents: [],
  thumbImgUrl: '', // thumbImgUrl 초기값 설정

  // contents 관련 메서드
  addContent: (newContent) =>
    set((state) =>
      set((state) => ({ ...state, contents: [...state.contents, newContent] })),
    ),
  removeContent: (index) =>
    set((state) => ({
      ...state,
      contents: state.contents.filter((_, i) => i !== index),
    })),
  updateContent: (index, updatedContent) =>
    set((state) => {
      const newContents = [...state.contents];
      newContents[index] = updatedContent;
      return { ...state, contents: newContents };
    }),
  clearContents: () => set((state) => ({ ...state, contents: [] })),
  setContents: (newContents) =>
    set((state) => ({ ...state, contents: newContents })),

  // thumbImgUrl 관련 메서드
  setThumbImgUrl: (url) => set((state) => ({ ...state, thumbImgUrl: url })), // thumbImgUrl 설정 메서드 추가

  // thumbImgUrl 가져오는 메서드
  getThumbImgUrl: () => get().thumbImgUrl, // 현재 thumbImgUrl 값을 반환하는 메서드 추가

  // stepCount 관련 메서드
  addStepCount: () =>
    set((state) =>
      set((state) => ({ ...state, stepCount: state.stepCount + 1 })),
    ),

  deleteStepCount: () =>
    set((state) =>
      set((state) => ({ ...state, stepCount: state.stepCount - 1 })),
    ),
}));
