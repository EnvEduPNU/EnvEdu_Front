import {
  ChartDataConverter,
  DiscussDataConverter,
  H1DataConverter,
  H2DataConverter,
  MatrixDataConverter,
  QnaDataConverter,
  SeedDataConverter,
  YoutubeUrlDataConverter,
} from "./classRoomDataConverter";

class ActivityMappingHandler {
  converters = [
    new H1DataConverter(),
    new H2DataConverter(),
    new SeedDataConverter(),
    new DiscussDataConverter(),
    new QnaDataConverter(),
    new YoutubeUrlDataConverter(),
    new MatrixDataConverter(),
    new ChartDataConverter(),
  ];

  convertersForSubmit = [
    new DiscussDataConverter(),
    new QnaDataConverter(),
    new ChartDataConverter(),
  ];

  convertForAssignment(data, pageIndex, activityIndex) {
    const dataConvert = this.converters.filter(convert =>
      convert.isSupport(data.classroomSequenceType)
    );

    if (dataConvert.length !== 1) {
      throw new Error(
        `${data.classroomSequenceType} 타입의 컨버터가 없습니다.`
      );
    }

    return dataConvert[0].convertActivityForAssignment(
      data,
      pageIndex,
      activityIndex
    );
  }

  convertForSubmit(data) {
    const dataConvert = this.convertersForSubmit.filter(convert =>
      convert.isSupport(data.answerType)
    );

    if (dataConvert.length !== 1) {
      throw new Error(`${data.answerType} 타입의 컨버터가 없습니다.`);
    }

    return dataConvert[0].convertActivityForSubmit(data);
  }
}

export default ActivityMappingHandler;
