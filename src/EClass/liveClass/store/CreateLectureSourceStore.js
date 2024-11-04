import { create } from 'zustand';

export const useCreateLectureSourceStore = create((set, get) => ({
  contents: [],
  thumbImgUrl: '', // thumbImgUrl 초기값 설정

  // contents 관련 메서드
  addContent: (newContent) =>
    set((state) => ({ contents: [...state.contents, newContent] })),
  removeContent: (index) =>
    set((state) => ({
      contents: state.contents.filter((_, i) => i !== index),
    })),
  updateContent: (index, updatedContent) =>
    set((state) => {
      const newContents = [...state.contents];
      newContents[index] = updatedContent;
      return { contents: newContents };
    }),
  clearContents: () => set({ contents: [] }),
  setContents: (newContents) => set({ contents: newContents }), // 전체 contents 배열 업데이트

  // thumbImgUrl 관련 메서드
  setThumbImgUrl: (url) => set({ thumbImgUrl: url }), // thumbImgUrl 설정 메서드 추가

  // thumbImgUrl 가져오는 메서드
  getThumbImgUrl: () => get().thumbImgUrl, // 현재 thumbImgUrl 값을 반환하는 메서드 추가
}));
