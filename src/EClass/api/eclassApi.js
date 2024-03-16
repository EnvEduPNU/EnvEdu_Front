import { customAxios } from "../../Common/CustomAxios";
import { ApiConverter } from "./apiConverters";

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

export const getEclassDetail = async () => {
  return customAxios.get("/dataLiteracy/classroom?id=43");
};

export const getEclassList = async () => {
  return customAxios.get("/dataLiteracy/classroom/mine");
};
