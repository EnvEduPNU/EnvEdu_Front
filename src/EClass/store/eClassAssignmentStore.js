import { create } from "zustand";
import { ChartApiConverter, MatrixApiConverter } from "../api/apiConverters";

const originData = {
  id: 44,
  title: "진짜 마지막 테스트",
  subtitle: null,
  description: "테이트 마지막..\n",
  createTime: "2024-03-16T13:22:56.986859",
  gradeLabel: "고등 공통",
  subjectLabel: "통합과학2",
  dataTypeLabel: "OPEN API",
  thumbnail: null,
  classroomChapters: [
    {
      id: 44,
      title: null,
      subtitle: null,
      description: null,
      createTime: "2024-03-16T13:22:56.986834",
      classroomSequences: [
        {
          id: 50,
          title: null,
          subtitle: null,
          description: null,
          createTime: "2024-03-16T13:22:56.991983",
          sequenceChunks: [
            {
              id: 83,
              classroomSequenceType: "MATRIX",
              studentVisibleStatus: true,
              canSubmit: false,
              canShare: true,
              title: null,
              content: null,
              url: null,
              properties: '["test1","test","test2"]',
              data: '[["1","2","3"],["4","5","6"],["7","8","9"]]',
              customDataChart: null,
              legendPosition: null,
              labelPosition: null,
              chartType: null,
              uuid: null,
              axisProperties: [],
            },
            {
              id: 84,
              classroomSequenceType: "H1",
              studentVisibleStatus: true,
              canSubmit: false,
              canShare: false,
              title: "제목입니다. ",
              content: null,
              url: null,
              properties: null,
              data: null,
              customDataChart: null,
              legendPosition: null,
              labelPosition: null,
              chartType: null,
              uuid: null,
              axisProperties: [],
            },
            {
              id: 85,
              classroomSequenceType: "H2",
              studentVisibleStatus: true,
              canSubmit: false,
              canShare: false,
              title: "글입니다. ",
              content: null,
              url: null,
              properties: null,
              data: null,
              customDataChart: null,
              legendPosition: null,
              labelPosition: null,
              chartType: null,
              uuid: null,
              axisProperties: [],
            },
            {
              id: 86,
              classroomSequenceType: "DISCUSS",
              studentVisibleStatus: true,
              canSubmit: true,
              canShare: false,
              title: "",
              content: "",
              url: null,
              properties: null,
              data: null,
              customDataChart: null,
              legendPosition: null,
              labelPosition: null,
              chartType: null,
              uuid: null,
              axisProperties: [],
            },
          ],
        },
        {
          id: 51,
          title: null,
          subtitle: null,
          description: null,
          createTime: "2024-03-16T13:22:56.992081",
          sequenceChunks: [
            {
              id: 87,
              classroomSequenceType: "H1",
              studentVisibleStatus: true,
              canSubmit: false,
              canShare: false,
              title: "2번째 페이지입니다. ",
              content: null,
              url: null,
              properties: null,
              data: null,
              customDataChart: null,
              legendPosition: null,
              labelPosition: null,
              chartType: null,
              uuid: null,
              axisProperties: [],
            },
            {
              id: 88,
              classroomSequenceType: "QNA",
              studentVisibleStatus: true,
              canSubmit: false,
              canShare: false,
              title: "질문입니다. ",
              content: "",
              url: null,
              properties: null,
              data: null,
              customDataChart: null,
              legendPosition: null,
              labelPosition: null,
              chartType: null,
              uuid: null,
              axisProperties: [],
            },
            {
              id: 89,
              classroomSequenceType: "CHART",
              studentVisibleStatus: true,
              canSubmit: false,
              canShare: false,
              title: "",
              content: null,
              url: null,
              data: '[["1","2","3"],["4","5","6"],["7","8","9"]]',
              properties: '["test1","test","test2"]',
              customDataChart: null,
              legendPosition: "NO",
              labelPosition: "NO",
              chartType: "BUBBLE",
              uuid: null,
              axisProperties: [
                {
                  axis: "X",
                  axisName: "test1",
                  axisType: "NUMERIC",
                  minimumValue: 0,
                  maximumValue: 100,
                  stepSize: 10,
                },
                {
                  axis: "Y1",
                  axisName: "test",
                  axisType: "NUMERIC",
                  minimumValue: 0,
                  maximumValue: 100,
                  stepSize: 10,
                },
                {
                  axis: "Z",
                  axisName: "test2",
                  axisType: "NUMERIC",
                  minimumValue: 0,
                  maximumValue: 100,
                  stepSize: 10,
                },
              ],
            },
          ],
        },
        {
          id: 52,
          title: null,
          subtitle: null,
          description: null,
          createTime: "2024-03-16T13:22:56.992128",
          sequenceChunks: [
            {
              id: 90,
              classroomSequenceType: "YOUTUBEURL",
              studentVisibleStatus: true,
              canSubmit: false,
              canShare: false,
              title: null,
              content: null,
              url: "https://www.youtube-nocookie.com/embed/FGNqdazP7Ns",
              properties: null,
              data: null,
              customDataChart: null,
              legendPosition: null,
              labelPosition: null,
              chartType: null,
              uuid: null,
              axisProperties: [],
            },
          ],
        },
      ],
    },
  ],
};

const convertEclassData = originData => {
  const {
    id,
    title,
    description,
    gradeLabel,
    subjectLabel,
    dataTypeLabel,
    classroomChapters,
  } = originData;
  console.log(classroomChapters[0].classroomSequences);
  return {
    id,
    title,
    description,
    gradeLabel,
    subjectLabel,
    dataTypeLabel,
    eClassData: classroomChapters[0].classroomSequences.map(page =>
      page.sequenceChunks.map(chunk => {
        if (chunk.classroomSequenceType === "MATRIX") {
          return new MatrixApiConverter().convertApiToAssignmentData(chunk);
        }
        if (chunk.classroomSequenceType === "CHART") {
          return new ChartApiConverter().convertApiToAssignmentData(chunk);
        }
        return chunk;
      })
    ),
  };
};

// TODO: 나중에 api로 변경해야함
let eClassData = JSON.parse(localStorage.getItem("eclass")) || {
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
        title: "2. 토론해보기awdwa ",
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

eClassData = convertEclassData(originData);

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
