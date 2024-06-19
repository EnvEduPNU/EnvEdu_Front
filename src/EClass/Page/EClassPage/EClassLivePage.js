import React from "react";
import { useNavigate } from "react-router-dom";

function EClassLivePage() {
  const role = localStorage.getItem("role");
  const newSessionId = 1234567890;

  const navigator = useNavigate();

  console.log(" 권한 : " + role);
  console.log(" 세션아이디 : " + newSessionId);

  return (
    <>
      {role === "ROLE_EDUCATOR" && navigator(`/teacher/${newSessionId}`)}
      {role === "ROLE_STUDENT" && navigator(`/student/${newSessionId}`)}
    </>
  );
}

export default EClassLivePage;
