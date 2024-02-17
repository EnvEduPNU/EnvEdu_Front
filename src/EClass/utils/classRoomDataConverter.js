import ClassroomType from "./classRoomType";

export class ClassRoomDataConverter {
  isSupport() {
    throw new Error("추상 메소드는 꼭 오버라이딩 되어야 합니다.");
  }

  convert() {
    throw new Error("추상 메소드는 꼭 오버라이딩 되어야 합니다.");
  }
}

export class H1DataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.H1;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.H1,
      studentVisibleStatus: true,
      title: "",
    };
  }
}

export class H2DataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.H2;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.H1,
      studentVisibleStatus: true,
      title: "",
    };
  }
}

export class SeedDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.SEED;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.SEED,
      studentVisibleStatus: true,
    };
  }
}

export class DiscussDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.DISCUSS;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.DISCUSS,
      studentVisibleStatus: true,
      title: "",
      content: "",
    };
  }
}

export class QnaDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.QNA;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.QNA,
      studentVisibleStatus: true,
      title: "",
      content: "",
    };
  }
}

export class PictureDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.PIC;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.PIC,
      studentVisibleStatus: true,
      url: "",
    };
  }
}

export class YoutubeUrlDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.YOUTUBEURL;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.YOUTUBEURL,
      studentVisibleStatus: true,
      url: "",
    };
  }
}

export class MatrixDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.MATRIX;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.MATRIX,
      studentVisibleStatus: true,
      properties: [],
      data: [[]],
    };
  }
}

export class ChartDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type == ClassroomType.CHART;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.CHART,
      studentVisibleStatus: true,
      title: "",
    };
  }
}
