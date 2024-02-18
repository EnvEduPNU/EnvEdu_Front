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
}));

export default useEClassAssignmentStore;
