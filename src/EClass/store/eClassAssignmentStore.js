import { create } from "zustand";

// TODO: 나중에 api로 변경해야함
const eClassData = JSON.parse(localStorage.getItem("eclass")) || {
  title: "우리 학교의 공기질 측정하기",
  description:
    "1차시: 교실의 공기질 측정하기\n\n2차시 : 학교의 여러장소 공기질 측정하기\n\n3차시 : 교실과 학교의 장소별 공기질 비교하기",
  gradeLabel: "중학생 (1학년)",
  subjectLabel: "과학 (과학탐구실험1)",
  dataTypeLabel: "SEED",
  eClassData: [
    [
      {
        classroomSequenceType: "H1",
        studentVisibleStatus: true,
        title: "활동1: 교실의 공기질 측정하기",
        canSubmit: false,
        canShare: false,
      },
      {
        classroomSequenceType: "H2",
        studentVisibleStatus: true,
        title: "seed를 이용해 공기질을 측정해보세요.",
        canSubmit: false,
        canShare: false,
      },
      {
        classroomSequenceType: "SEED",
        studentVisibleStatus: true,
        canSubmit: false,
        canShare: false,
      },
    ],
    [
      {
        classroomSequenceType: "H1",
        studentVisibleStatus: true,
        title: "활동2: 교실과 학교의 장소별 공기질 비교하기",
        canSubmit: false,
        canShare: false,
      },
      {
        classroomSequenceType: "H2",
        studentVisibleStatus: true,
        title: "1. 교실의 공기질 측정",
        canSubmit: false,
        canShare: false,
      },
      {
        classroomSequenceType: "SEED",
        studentVisibleStatus: true,
        canSubmit: false,
        canShare: false,
      },
      {
        classroomSequenceType: "H2",
        studentVisibleStatus: true,
        title: "2. 토론해보기 ",
        canSubmit: false,
        canShare: false,
      },
      {
        classroomSequenceType: "DISCUSS",
        studentVisibleStatus: true,
        title: "",
        content: "",
        canSubmit: true,
        canShare: true,
      },
    ],
    [
      {
        classroomSequenceType: "H1",
        studentVisibleStatus: true,
        title: "활동3: 표 활용 ",
        canSubmit: false,
        canShare: false,
      },
      {
        classroomSequenceType: "MATRIX",
        studentVisibleStatus: true,
        data: [
          ["농업지대", "평균기온", "강수량", "일조시간"],
          ["태백고냉", 21.9, 181.9, 149.7],
          ["소백간산", 25.3, 675.6, 140],
          ["영남내륙산간", 24.6, 578.3, 137.8],
          ["중부내륙", 25.9, 505.3, 144.5],
          ["소백서부내륙", 26, 699.7, 138.6],
          ["노령동서내륙", 25.6, 570.2, 136.2],
          ["호남내륙", 25.6, 570.2, 136.2],
          ["영남내륙", 26, 477.5, 123.8],
          ["중서부평야", 25.7, 508.1, 157],
          ["남서해안", 25.6, 500.8, 104.9],
          ["남부해안", 25.2, 623.4, 113.6],
          ["동해안남부", 26.2, 235.6, 167.3],
        ],
        canSubmit: false,
        canShare: false,
      },
    ],
    [
      {
        classroomSequenceType: "H1",
        studentVisibleStatus: true,
        title: "4. 질문 ",
        canSubmit: false,
        canShare: false,
      },
      {
        classroomSequenceType: "QNA",
        studentVisibleStatus: true,
        title: "느낀점을 적어주세요.",
        content: "",
        canSubmit: true,
        canShare: true,
      },
    ],
  ],
};

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

export default useEClassAssignmentStore;
