import { create } from 'zustand';

// Zustand store 생성
const usePhotoStore = create((set, get) => ({
  photoStore: {},
  localStoragePhotoList: [], // 상태 이름을 일관성 있게 수정

  // photoStore 설정하는 액션
  setPhotoStore: (photoStore) => set({ photoStore }),

  // photoList 설정하는 액션
  setStorePhotoList: (photoList) => set({ localStoragePhotoList: photoList }),

  // photoStore 가져오는 get 함수
  getPhotoStore: () => get().photoStore,

  // photoList 가져오는 get 함수
  getStorePhotoList: () => get().localStoragePhotoList,
}));

export default usePhotoStore;
