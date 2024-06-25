import React, { useState } from "react";
import LiveTeacherComponent from "../compnent/LiveTeacherComponent";
import LiveStudentComponent from "../compnent/LiveStudentComponent";
import styled from "@emotion/styled";

const StyledDiv = styled.div`
  display: flex;
  margin: 30px;
  width: 90%;
`;

// E-Class 화면 공유 페이지
function EClassLivePage() {
  const role = localStorage.getItem("role");

  console.log(" 권한 : " + role);

  return (
    <StyledDiv>
      {role === "ROLE_EDUCATOR" && <LiveTeacherComponent />}
      {role === "ROLE_STUDENT" && <LiveStudentComponent />}
    </StyledDiv>
  );
}

export default EClassLivePage;
