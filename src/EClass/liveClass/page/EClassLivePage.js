import React from 'react';
import { TeacherClassroomPage } from './TeacherClassroomPage';
import { StudentClassroomPage } from './StudentClassroomPage';

// E-Class 화면 공유 페이지
function EClassLivePage() {
  const role = localStorage.getItem('role');

  console.log(' 권한 : ' + role);

  return (
    <div style={{ margin: '0 20vh 0 20vh' }}>
      {role === 'ROLE_EDUCATOR' && <TeacherClassroomPage />}
      {role === 'ROLE_STUDENT' && <StudentClassroomPage />}
    </div>
  );
}

export default EClassLivePage;
