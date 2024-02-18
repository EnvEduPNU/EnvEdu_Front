import { create } from "zustand";

// TODO: 나중에 api로 변경해야함
const eClassData = JSON.parse(localStorage.getItem("eclass"));

export const useEClassAssignmentStore = create((set, get) => ({
  title: eClassData.title,
  description: eClassData.description,
  gradeLabel: eClassData.gradeLabel,
  subjectLabel: eClassData.subjectLabel,
  dataTypeLabel: eClassData.dataTypeLabel,
  eClassDatas: eClassData.eClassData,
  eClassDatasForAssignment: eClassData.eClassData.map(page =>
    page.filter(data => data["studentVisibleStatus"])
  ),

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
}));

export default useEClassAssignmentStore;
