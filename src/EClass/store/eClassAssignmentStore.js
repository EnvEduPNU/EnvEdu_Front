import { create } from "zustand";

export const useEClassAssignmentStore = create((set, get) => ({
  id: -1,
  title: "",
  description: "",
  gradeLabel: "",
  subjectLabel: "",
  dataTypeLabel: "",
  eClassDatas: [],
  eClassDatasForAssignment: [],
  chapterId: -1,
  eClassSequenceIds: [],

  settingEclass: eClassData => set(state => ({ ...state, ...eClassData })),

  appendEclass: (eClassData, data) =>
    set(state => {
      return {
        ...state,
        id: eClassData.id,
        title: eClassData.title,
        description: eClassData.description,
        gradeLabel: eClassData.gradeLabel,
        subjectLabel: eClassData.subjectLabel,
        dataTypeLabel: eClassData.dataTypeLabel,
        eClassDatas: eClassData.eClassData,
        eClassDatasForAssignment: eClassData.eClassData.map(page =>
          page.filter(data => data["studentVisibleStatus"])
        ),
        chapterId: data.classroomChapters[0]?.id,
        eClassSequenceIds: data.classroomChapters[0]?.classroomSequences.map(
          sequence => sequence.id
        ),
      };
    }),

  changeEclassDataFieldValue: (pageIndex, activityIndex, key, newValue) =>
    set(state => {
      const newEClassDatas = get().eClassDatasForAssignment.map(page => [
        ...page,
      ]);
      const copyData = {
        ...newEClassDatas[pageIndex][activityIndex],
      };

      if (key in copyData) {
        copyData[key] = newValue;
        newEClassDatas[pageIndex][activityIndex] = copyData;
      }

      return {
        ...state,
        eClassDatasForAssignment: newEClassDatas,
      };
    }),

  changeChartDataValue: (pageIndex, activityIndex, newValue) =>
    set(state => {
      const newEClassDatas = get().eClassDatasForAssignment.map(page => [
        ...page,
      ]);
      const copyData = {
        ...newEClassDatas[pageIndex][activityIndex],
      };

      if ("data" in copyData) {
        copyData["data"] = newValue;
        newEClassDatas[pageIndex][activityIndex] = copyData;
      }

      newEClassDatas[pageIndex][activityIndex] = Object.assign(
        newEClassDatas[pageIndex][activityIndex],
        { isMine: true }
      );

      return {
        ...state,
        eClassDatasForAssignment: newEClassDatas,
      };
    }),
}));

useEClassAssignmentStore.subscribe(state => {
  if (state.id == -1) return;
  localStorage.setItem(`eclassDetail-${state.id}`, JSON.stringify(state));
});

export default useEClassAssignmentStore;
