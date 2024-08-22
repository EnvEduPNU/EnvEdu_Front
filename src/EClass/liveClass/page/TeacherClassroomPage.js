import React, { useEffect, useState } from "react";
import TeacherReportTable from "../teacher/component/table/eclassPageTable/TeacherReportTable";
import { Divider, Typography } from "@mui/material";
import TeacherStudentList from "../teacher/component/table/eclassPageTable/TeacherStudentList";
import CreateLectureModal from "../teacher/modal/CreateLectureModal";
import TeacherEclassTable from "../teacher/component/table/eclassPageTable/TeacherEclassTable";

// Teacher E-Class 페이지
export function TeacherClassroomPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEClassUuid, setSelectedEClassUuid] = useState(null);
  const [studentListUuid, setStudentListUuid] = useState([]);

  // 강의 생성 후 리랜더링
  const handleCreateLecture = () => {
    window.location.reload();
  };

  useEffect(() => {
    setStudentListUuid([selectedEClassUuid]);
  }, [selectedEClassUuid]);

  return (
    <div style={{ display: "flex", width: "100%", margin: "0 20vh" }}>
      <>
        {/* [왼쪽 블럭] E-Class 테이블 */}
        <div style={{ width: "80%", height: "100%" }}>
          <Typography variant="h4" sx={{ margin: "10px 0 10px 0" }}>
            {`[ E-Class ]`}
          </Typography>
          <div style={{ minHeight: "40rem" }}>
            <TeacherEclassTable setSelectedEClassUuid={setSelectedEClassUuid} />
          </div>

          <button
            variant="contained"
            onClick={() => setModalOpen(true)}
            style={{ margin: "10px 0 ", width: "20%" }}
          >
            {" "}
            E-Class 생성
          </button>
          <CreateLectureModal
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            onCreate={handleCreateLecture}
          />
        </div>

        {/* [오른쪽 블럭] 수업 Step 테이블, 수업 상태 테이블 */}
        <div style={{ margin: "0 30px ", height: "40rem", width: "35%" }}>
          <TeacherStudentList
            eclassUuid={studentListUuid}
            selectedEClassUuid={selectedEClassUuid}
          />

          <Divider sx={{ margin: "20px 0" }} />

          <TeacherReportTable setCourseStep={3} />
        </div>
      </>
    </div>
  );
}

// 박스 중앙 정렬 예시
/*{
   <div
style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "40rem",
  minHeight: "40rem", // 부모 요소의 높이를 설정해야 전체 높이에 대해 중앙 정렬이 가능
  border: "1px solid grey",
}}
>

</div> 
}*/
