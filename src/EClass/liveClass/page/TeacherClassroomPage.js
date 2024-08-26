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
      <div style={{ width: "80%", height: "100%" }}>
        <Typography
          variant="h4"
          sx={{
            margin: "10px 0 10px 0",
            fontWeight: 600,
            fontSize: "3rem",
            letterSpacing: "0.013rem",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {` E-Class `}
        </Typography>
        <div style={{ minHeight: "40rem" }}>
          <TeacherEclassTable setSelectedEClassUuid={setSelectedEClassUuid} />
        </div>

        <button
          onClick={() => setModalOpen(true)}
          style={{
            margin: "10px 0",
            width: "20%",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "0.9rem",
            fontWeight: 600,
            backgroundColor: "#feecfe",
            borderRadius: "2.469rem",
            border: "none",
            height: "1.75rem",
            fontFamily: "'Asap', sans-serif",
          }}
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

        <Divider sx={{ margin: "15px 0" }} />

        <TeacherReportTable selectedEClassUuid={selectedEClassUuid} />
      </div>
    </div>
  );
}
