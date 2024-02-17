import {
  ChartDataConverter,
  DiscussDataConverter,
  H1DataConverter,
  H2DataConverter,
  MatrixDataConverter,
  PictureDataConverter,
  QnaDataConverter,
  SeedDataConverter,
  YoutubeUrlDataConverter,
} from "./classRoomDataConverter";

export class ClassRoomDataConverterAdapter {
  converters = [
    new H1DataConverter(),
    new H2DataConverter(),
    new SeedDataConverter(),
    new DiscussDataConverter(),
    new QnaDataConverter(),
    new PictureDataConverter(),
    new YoutubeUrlDataConverter(),
    new MatrixDataConverter(),
    new ChartDataConverter(),
  ];

  convert(classroomType, data = null) {
    const dataConvert = this.converters.filter(convert =>
      convert.isSupport(classroomType)
    );
    if (dataConvert.length !== 1) {
      throw new Error(`${classroomType} 타입의 컨버터가 없습니다.`);
    }

    if (data == null) {
      return dataConvert[0].convert();
    }

    return dataConvert[0].convert(data);
  }
}
