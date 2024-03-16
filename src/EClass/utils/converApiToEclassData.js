import { ChartApiConverter, MatrixApiConverter } from "../api/apiConverters";

export const convertApiToEclassData = originData => {
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
