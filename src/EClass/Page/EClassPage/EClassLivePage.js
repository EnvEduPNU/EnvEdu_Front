import React, { useEffect, useState } from "react";
import LiveStudentPage from "./LiveStudentPage";
import LiveTeacherPage from "./LiveTeacherPage";

function EClassLivePage() {
  const role = localStorage.getItem("role");

  console.log(" 권한 : " + role);

  return (
    <>
      {role === "ROLE_EDUCATOR" && <LiveTeacherPage />}
      {role === "ROLE_STUDENT" && <LiveStudentPage />}
    </>
  );
}

export default EClassLivePage;
