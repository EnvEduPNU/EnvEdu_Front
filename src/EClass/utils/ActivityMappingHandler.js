import { H1DataConverter, H2DataConverter } from "./classRoomDataConverter";

class ActivityMappingHandler {
  converters = [new H1DataConverter(), new H2DataConverter()];

  convertForAssignment(data) {
    const dataConvert = this.converters.filter(convert =>
      convert.isSupport(data.classroomSequenceType)
    );

    if (dataConvert.length !== 1) {
      throw new Error(
        `${data.classroomSequenceType} 타입의 컨버터가 없습니다.`
      );
    }

    return dataConvert[0].convertActivityForAssignment(data);
  }
}

export default ActivityMappingHandler;
