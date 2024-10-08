import React from "react";
import styled from "@emotion/styled";
import { TeacherClassroomPage } from "./TeacherClassroomPage";
import { StudentClassroomPage } from "./StudentClassroomPage";

const StyledDiv = styled.div`
  display: flex;
  margin: 0 0 0 10px;
  width: 100%;
`;

// E-Class 화면 공유 페이지
function EClassLivePage() {
  const role = localStorage.getItem("role");

  console.log(" 권한 : " + role);

  return (
    <StyledDiv>
      {role === "ROLE_EDUCATOR" && <TeacherClassroomPage />}
      {role === "ROLE_STUDENT" && <StudentClassroomPage />}
    </StyledDiv>
  );
}

export default EClassLivePage;
