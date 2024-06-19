import React, { useState } from "react";
import LiveTeacherComponent from "../../liveClass/compnent/LiveTeacherComponent";
import LiveStudentComponent from "../../liveClass/compnent/LiveStudentComponent";

function EClassLivePage() {
  const role = localStorage.getItem("role");
  const [teacherSessionId] = useState(1234567890);
  const [studentSessionId] = useState(987654321);

  console.log(" 권한 : " + role);
  console.log(" 세션아이디 : " + newSessionId);

  return (
    <>
      {role === "ROLE_EDUCATOR" && (
        <LiveTeacherComponent
          teacherSessionId={teacherSessionId}
          studentSessionId={studentSessionId}
        />
      )}
      {role === "ROLE_STUDENT" && (
        <LiveStudentComponent
          teacherSessionId={teacherSessionId}
          studentSessionId={studentSessionId}
        />
      )}
    </>
  );
}

export default EClassLivePage;
