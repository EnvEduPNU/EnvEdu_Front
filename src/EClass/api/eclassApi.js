import { customAxios } from "../../Common/CustomAxios";
import { ApiConverter, ChartApiConverter } from "./apiConverters";

export const createEclass = async ({
  title,
  description,
  dataTypeLabel,
  gradeLabel,
  eClassData,
  subjectLabel,
}) => {
  const apiConverter = new ApiConverter();
  eClassData = eClassData.map(page =>
    page.map(data => apiConverter.convert(data))
  );

  return customAxios.post("/dataLiteracy/classroom/e-class/new", {
    classroomClass: {
      title,
      description,
      gradeLabel,
      subjectLabel,
      dataTypeLabel,
    },
    sequenceBlocks: eClassData,
  });
};

export const getEclassDetail = async id => {
  return customAxios.get(`/dataLiteracy/classroom?id=${id}`);
};

export const getEclassList = async () => {
  return customAxios.get("/dataLiteracy/classroom/mine");
};

export const getUUIDData = async uuid => {
  return customAxios.get(`/dataLiteracy/customData/download/${uuid}`);
};

export const createSubmit = async (classId, chapterId, sequenceId, data) => {
  return customAxios.post("/dataLiteracy/classroom/answer", {
    classId,
    chapterId,
    sequenceId,
    title: data.title,
    content: data.content,
    canSubmit: true,
    answerType: data.classroomSequenceType,
  });
};

export const createShare = async (classId, chapterId, sequenceId, data) => {
  return customAxios.post("/dataLiteracy/classroom/answer", {
    classId,
    chapterId,
    sequenceId,
    title: data.title,
    content: data.content,
    canShare: true,
    answerType: data.classroomSequenceType,
  });
};

export const createShareChart = async (activityData, classId) => {
  const converter = new ChartApiConverter();
  const data = converter.convertSubmit({
    ...activityData,
    classId,
    canShare: true,
    canSubmit: false,
  });
  return customAxios.post("/dataLiteracy/chart/properties", data);
};

export const createSubmitChart = async (activityData, classId) => {
  const converter = new ChartApiConverter();
  const data = converter.convertSubmit({
    ...activityData,
    classId,
    canShare: false,
    canSubmit: true,
  });
  return customAxios.post("/dataLiteracy/chart/properties", data);
};

export const getEclassShareData = async (classId, chapterId, sequenceId) => {
  return customAxios.get(
    `/dataLiteracy/classroom/answer/share?classId=${classId}&chapterId=${chapterId}&sequenceId=${sequenceId}`
  );
};

export const getEclassSubmitData = async (classId, chapterId, sequenceId) => {
  return customAxios.get(
    `/dataLiteracy/classroom/answer/submit?classId=${classId}&chapterId=${chapterId}&sequenceId=${sequenceId}`
  );
};

export const getEclassShareChartData = async (
  classId,
  chapterId,
  sequenceId
) => {
  return customAxios.get(
    `/dataLiteracy/chart/students/properties?classId=${classId}&chapterId=${chapterId}&sequenceId=${sequenceId}`
  );
};

export const getEclassSubmitChartData = async (
  classId,
  chapterId,
  sequenceId
) => {
  return customAxios.get(
    `/dataLiteracy/chart/students/properties/submit?classId=${classId}&chapterId=${chapterId}&sequenceId=${sequenceId}`
  );
};
