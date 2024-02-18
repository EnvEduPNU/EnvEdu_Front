import ArgumentForStudent from "../Component/Argument/ArgumentForStudent";
import H1ForStudent from "../Component/H1/H1ForStudent";
import H2ForStudent from "../Component/H2/H2ForStudent";
import QuestionForAssignment from "../Component/Question/QuestionForAssignment";
import SeedForStudent from "../Component/Seed/SeedForStudent";
import TableForAssignment from "../Component/Table/TableForAssignment";
import YoutubeToolForAssignment from "../Component/YoutubeTool/YoutubeToolForAssignment";
import ClassroomType from "./classRoomType";

export class ClassRoomDataConverter {
  isSupport() {
    throw new Error("추상 메소드는 꼭 오버라이딩 되어야 합니다.");
  }

  convert() {
    throw new Error("추상 메소드는 꼭 오버라이딩 되어야 합니다.");
  }

  convertActivityForAssignment() {
    throw new Error("추상 메소드는 꼭 오버라이딩 되어야 합니다.");
  }
}

export class H1DataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.H1;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.H1,
      studentVisibleStatus: true,
      title: "",
      canSubmit: false,
      canShare: false,
    };
  }

  convertActivityForAssignment(data, pageIndex, activityIndex) {
    return <H1ForStudent value={data["title"]} />;
  }
}

export class H2DataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.H2;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.H2,
      studentVisibleStatus: true,
      title: "",
      canSubmit: false,
      canShare: false,
    };
  }

  convertActivityForAssignment(data, pageIndex, activityIndex) {
    return <H2ForStudent value={data["title"]} />;
  }
}

export class SeedDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.SEED;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.SEED,
      studentVisibleStatus: true,
      canSubmit: false,
      canShare: false,
    };
  }

  convertActivityForAssignment(data, pageIndex, activityIndex) {
    return <SeedForStudent />;
  }
}

export class DiscussDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.DISCUSS;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.DISCUSS,
      studentVisibleStatus: true,
      title: "",
      content: "",
      canSubmit: false,
      canShare: false,
    };
  }

  convertActivityForAssignment(data, pageIndex, activityIndex) {
    return (
      <ArgumentForStudent
        data={data}
        pageIndex={pageIndex}
        activityIndex={activityIndex}
      />
    );
  }
}

export class QnaDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.QNA;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.QNA,
      studentVisibleStatus: true,
      title: "",
      content: "",
      canSubmit: false,
      canShare: false,
    };
  }

  convertActivityForAssignment(data, pageIndex, activityIndex) {
    return (
      <QuestionForAssignment
        data={data}
        pageIndex={pageIndex}
        activityIndex={activityIndex}
      />
    );
  }
}

export class PictureDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.PIC;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.PIC,
      studentVisibleStatus: true,
      url: "",
      canSubmit: false,
      canShare: false,
    };
  }
}

export class YoutubeUrlDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.YOUTUBEURL;
  }

  convert(data) {
    return {
      classroomSequenceType: ClassroomType.YOUTUBEURL,
      studentVisibleStatus: true,
      url: data,
      canSubmit: false,
      canShare: false,
    };
  }

  convertActivityForAssignment(data, pageIndex, activityIndex) {
    return <YoutubeToolForAssignment data={data} />;
  }
}

export class MatrixDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.MATRIX;
  }

  convert(data) {
    return {
      classroomSequenceType: ClassroomType.MATRIX,
      studentVisibleStatus: true,
      data,
      canSubmit: false,
      canShare: false,
    };
  }

  convertActivityForAssignment(data, pageIndex, activityIndex) {
    return <TableForAssignment data={data["data"]} />;
  }
}

export class ChartDataConverter extends ClassRoomDataConverter {
  isSupport(type) {
    return type === ClassroomType.CHART;
  }

  convert() {
    return {
      classroomSequenceType: ClassroomType.CHART,
      studentVisibleStatus: true,
      title: "",
      canSubmit: false,
      canShare: false,
    };
  }
}
