import { create } from "zustand";

export const useCreateLectureSourceStore = create((set) => ({
  contents: [],
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
}));
