import React from "react";
import TeacherReportTable from "../teacher/component/table/eclassPageTable/TeacherReportTable";
import { Divider, Typography } from "@mui/material";
import TeacherStudentList from "../teacher/component/table/eclassPageTable/TeacherStudentList";
import EClassTable from "../teacher/component/table/eclassPageTable/EClassTable";

// Teacher E-Class 페이지
export function TeacherClassroomPage() {
  return (
    <div style={{ display: "flex", width: "100%", margin: "0 25vh" }}>
      <>
        {/* [왼쪽 블럭] E-Class 테이블 */}
        <div style={{ width: "80%", height: "100%" }}>
          <Typography variant="h4" sx={{ margin: "10px 0 10px 0" }}>
            {`[ E-Class ]`}
          </Typography>
          <div style={{ minHeight: "40rem" }}>
            <EClassTable />
          </div>
          <button
            //   onClick={}
            style={{ margin: "10px 0 ", width: "20%" }}
          >
            E-Class 생성
          </button>
        </div>

        {/* [오른쪽 블럭] 수업 Step 테이블, 수업 상태 테이블 */}
        <div style={{ margin: "0 30px ", height: "40rem", width: "35%" }}>
          <TeacherStudentList />

          <Divider sx={{ margin: "20px 0" }} />

          <TeacherReportTable setCourseStep={3} />
        </div>
      </>
    </div>
  );
}

// 박스 중앙 정렬 예시
{
  /* <div
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

</div> */
}