import React from 'react';
import { TeacherClassroomPage } from './TeacherClassroomPage';
import { StudentClassroomPage } from './StudentClassroomPage';

// E-Class 화면 공유 페이지
function EClassLivePage() {
  const role = localStorage.getItem('role');

  if (!role) {
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
    window.location.href = '/login'; // 로그인 페이지로 이동
  }

  console.log(' 권한 : ' + role);

  return (
    <div style={{ margin: '0 20vh 0 20vh' }}>
      {role === 'ROLE_EDUCATOR' && <TeacherClassroomPage />}
      {role === 'ROLE_STUDENT' && <StudentClassroomPage />}
    </div>
  );
}

export default EClassLivePage;
