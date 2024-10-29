import React, { useEffect, useState } from 'react';
import TeacherReportTable from '../teacher/component/table/eclassPageTable/TeacherReportTable';
import { Divider, Typography, Button } from '@mui/material';
import TeacherStudentList from '../teacher/component/table/eclassPageTable/TeacherStudentList';
import SearchLectureModal from '../student/modal/SearchLectureModal';
import StudentEclassTable from '../teacher/component/table/eclassPageTable/StudentEclassTable';
import StudentStudentList from '../teacher/component/table/eclassPageTable/StudentStudentList';

export function StudentClassroomPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEClassUuid, setSelectedEClassUuid] = useState(null);
  const [studentListUuid, setStudentListUuid] = useState([]);
  const [isStudentListVisible, setIsStudentListVisible] = useState(true); // Toggle state for student list and report view

  // 강의 생성 후 리랜더링
  const handleCreateLecture = () => {
    window.location.reload();
  };

  useEffect(() => {
    setStudentListUuid(selectedEClassUuid ? [selectedEClassUuid] : []);
  }, [selectedEClassUuid]);

  return (
    <div style={{ display: 'flex' }}>
      {/* [왼쪽 블럭] E-Class 테이블 */}
      <div style={{ width: '100%', height: '700px' }}>
        <Typography
          variant="h4"
          sx={{
            margin: '10px 0 10px 0',
            fontWeight: 600,
            fontSize: '3rem',
            letterSpacing: '0.013rem',
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {' E-Class '}
        </Typography>
        <div>
          <StudentEclassTable setSelectedEClassUuid={setSelectedEClassUuid} />
        </div>

        <button
          variant="contained"
          onClick={() => setModalOpen(true)}
          style={{
            margin: '10px 0',
            width: '20%',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '0.9rem',
            fontWeight: 600,
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
            height: '1.75rem',
            fontFamily: "'Asap', sans-serif",
          }}
        >
          {' '}
          E-Class 찾기
        </button>
        <SearchLectureModal
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateLecture}
        />
      </div>

      {/* [오른쪽 블럭] 학생 리스트와 보고서 토글 */}
      <div style={{ margin: '47px 30px ', height: '40rem', width: '35%' }}>
        {isStudentListVisible ? (
          <>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: '600',
                fontSize: '1.5rem',
              }}
            >
              {' 학생 리스트 '}
            </Typography>
            <StudentStudentList eclassUuid={studentListUuid} />
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: '600',
                fontSize: '1.5rem',
              }}
            >
              {' 보고서 제출 '}
            </Typography>
            <TeacherReportTable selectedEClassUuid={selectedEClassUuid} />
          </>
        )}

        <Button
          onClick={() => setIsStudentListVisible((prev) => !prev)}
          style={{
            width: '100%',
            fontFamily: "'Asap', sans-serif",
            fontWeight: 600,
            fontSize: '0.9rem',
            color: 'grey',
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
          }}
        >
          {isStudentListVisible ? '보고서 리스트' : '학생 리스트'}
        </Button>
      </div>
    </div>
  );
}
