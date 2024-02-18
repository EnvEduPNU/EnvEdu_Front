import { create } from "zustand";
import { ClassRoomDataConverterAdapter } from "../utils/ClassRoomDataConverterAdapter";

export const useEClassStore = create((set, get) => ({
  title: "",
  description: "",
  gradeLabel: "초등학생",
  subjectLabel: "기타",
  dataTypeLabel: "기타",
  eClass: [[]],
  eClassData: [[]],

  appendActivity: (pageNumber, activity, classroomType, data = null) =>
    set(state => {
      const newEclass = get().eClass.map(page => [...page]);
      newEclass[pageNumber].push(activity);

      const dataAdapter = new ClassRoomDataConverterAdapter();
      const eclassData = dataAdapter.convert(classroomType, data);

      const newEclassData = get().eClassData.map(a => [...a]);
      newEclassData[pageNumber].push(eclassData);

      return {
        ...state,
        eClass: newEclass,
        eClassData: newEclassData,
      };
    }),

  appendPage: () =>
    set(state => {
      const newEclass = get().eClass.map(page => [...page]);
      newEclass.push([]);

      const newEclassData = get().eClassData.map(a => [...a]);
      newEclassData.push([]);

      return {
        ...state,
        eClass: newEclass,
        eClassData: newEclassData,
      };
    }),

  changeClassroomData: (pageIndex, dataIndex, field, newData) =>
    set(state => {
      const newEclassData = get().eClassData.map(d => [...d]);

      const copyData = {
        ...newEclassData[pageIndex][dataIndex],
      };
      copyData[field] = newData;
      newEclassData[pageIndex][dataIndex] = copyData;

      return {
        ...state,
        eClassData: newEclassData,
      };
    }),

  toggleSelected: (pageIndex, dataIndex) =>
    set(state => {
      const newEclassData = get().eClassData.map(d => [...d]);

      const copyData = {
        ...newEclassData[pageIndex][dataIndex],
      };

      if ("studentVisibleStatus" in copyData) {
        copyData["studentVisibleStatus"] = !copyData["studentVisibleStatus"];
        newEclassData[pageIndex][dataIndex] = copyData;
      }

      return {
        ...state,
        eClassData: newEclassData,
      };
    }),

  changeFieldValue: (key, newValue) =>
    set(state => {
      return {
        ...state,
        [key]: newValue,
      };
    }),

  deleteActivity: (pageIndex, activityIndex) =>
    set(state => {
      const newEclass = get().eClass.map(page => [...page]);
      newEclass[pageIndex][activityIndex] = <></>;

      const newEclassData = get().eClassData.map(a => [...a]);
      newEclassData[pageIndex][activityIndex]["isRemove"] = true;
      return {
        ...state,
        eClass: newEclass,
        eClassData: newEclassData,
      };
    }),

  getActiveNextIndex: pageNum => {
    return get().eClass[pageNum].length;
  },
}));
