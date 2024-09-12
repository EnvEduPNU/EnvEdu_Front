import { ChartApiConverter, MatrixApiConverter } from "../api/apiConverters";

export const convertApiToEclassData = async originData => {
  const {
    id,
    title,
    description,
    gradeLabel,
    subjectLabel,
    dataTypeLabel,
    classroomChapters,
  } = originData;

  return {
    id,
    title,
    description,
    gradeLabel,
    subjectLabel,
    dataTypeLabel,
    eClassData: await Promise.all(
      classroomChapters[0].classroomSequences.map(async page => {
        return await Promise.all(
          page.sequenceChunks.map(async chunk => {
            if (chunk.classroomSequenceType === "MATRIX") {
              return new MatrixApiConverter().convertApiToAssignmentData(
                chunk,
                page.id,
                classroomChapters[0].id
              );
            }
            if (chunk.classroomSequenceType === "CHART") {
              return await new ChartApiConverter().convertApiToAssignmentData(
                chunk,
                page.id,
                classroomChapters[0].id
              );
            }
            return {
              ...chunk,
              chapterId: classroomChapters[0].id,
              sequenceId: page.id,
            };
          })
        );
      })
    ),
  };
};
