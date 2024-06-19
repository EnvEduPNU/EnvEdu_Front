import React from "react";
import LiveTeacherComponent from "../../liveClass/compnent/LiveTeacherComponent";
import LiveStudentComponent from "../../liveClass/compnent/LiveStudentComponent";

function EClassLivePage() {
  const role = localStorage.getItem("role");
  const newSessionId = 1234567890;

  console.log(" 권한 : " + role);
  console.log(" 세션아이디 : " + newSessionId);

  return (
    <>
      {role === "ROLE_EDUCATOR" && (
        <LiveTeacherComponent newSessionId={newSessionId} />
      )}
      {role === "ROLE_STUDENT" && (
        <LiveStudentComponent newSessionId={newSessionId} />
      )}
    </>
  );
}

export default EClassLivePage;
