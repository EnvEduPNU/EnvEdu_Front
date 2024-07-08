import React from "react";
import { LiveTeacherPage } from "./LiveTeacherPage";
import LiveStudentComponent from "../student/component/LiveStudentComponent";
import styled from "@emotion/styled";

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
      {role === "ROLE_EDUCATOR" && <LiveTeacherPage />}
      {role === "ROLE_STUDENT" && <LiveStudentComponent />}
    </StyledDiv>
  );
}

export default EClassLivePage;
