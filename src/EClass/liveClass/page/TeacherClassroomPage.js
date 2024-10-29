import React, { useEffect, useState } from 'react';
import TeacherReportTable from '../teacher/component/table/eclassPageTable/TeacherReportTable';
import TeacherStudentList from '../teacher/component/table/eclassPageTable/TeacherStudentList';
import CreateLectureModal from '../teacher/modal/CreateLectureModal';
import TeacherEclassTable from '../teacher/component/table/eclassPageTable/TeacherEclassTable';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Modal,
  Box,
} from '@mui/material';
import { customAxios } from '../../../Common/CustomAxios';
import moment from 'moment';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function TeacherClassroomPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [isStudentListVisible, setIsStudentListVisible] = useState(true); // Toggle state
  const [selectedEClassUuid, setSelectedEClassUuid] = useState(null);
  const [studentListUuid, setStudentListUuid] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [rowData, setRowData] = useState([]); // 이미 포함된 학생 리스트
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    setStudentListUuid(selectedEClassUuid ? [selectedEClassUuid] : []);
  }, [selectedEClassUuid]);

  useEffect(() => {
    customAxios
      .get('/api/eclass/student/allList')
      .then((response) => {
        setStudentList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching student list:', error);
      });
  }, []);

  const handleCreateLecture = () => {
    window.location.reload();
  };

  const handleOpenStudentModal = () => setStudentModalOpen(true);
  const handleCloseStudentModal = () => setStudentModalOpen(false);

  // 학생 추가 모달에 표시할 수 있는 학생 리스트 계산
  const availableStudents = studentList.filter(
    (student) => !rowData.some((row) => row.Num === student.id),
  );

  const handleStudentSelect = (event, student) => {
    event.stopPropagation();
    setSelectedStudent((prevSelectedStudent) =>
      prevSelectedStudent?.id === student.id ? null : student,
    );
  };

  const handleAddStudent = () => {
    if (selectedStudent) {
      const newStudent = {
        eclassUuid: selectedEClassUuid,
        studentId: selectedStudent.id,
        studentName: selectedStudent.username,
        studentGroup: selectedStudent.studentGroup,
        joinDate: moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ'),
      };

      customAxios
        .post('/api/eclass/student/enroll', newStudent)
        .then(() => {
          setSelectedStudent(null);
          setRowData((prevRowData) => [...prevRowData, newStudent]);
          handleCloseStudentModal();
        })
        .catch((error) => {
          console.error('Error adding student:', error);
        });
    }
  };

  return (
    <div style={{ display: 'flex' }}>
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
          <TeacherEclassTable setSelectedEClassUuid={setSelectedEClassUuid} />
        </div>

        <button
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
          {' E-Class 실행 생성 '}
        </button>
        <CreateLectureModal
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateLecture}
        />
      </div>

      <div
        style={{
          marginLeft: '20px',
          height: '400px',
          padding: '50px 0 10px 0',
          width: '30rem',
        }}
      >
        {/* Conditionally render TeacherStudentList or TeacherReportTable */}
        {isStudentListVisible ? (
          <div>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: '600',
                fontSize: '1.5rem',
              }}
            >
              {' 참여학생리스트 '}
            </Typography>
            <TeacherStudentList
              eclassUuid={studentListUuid}
              selectedEClassUuid={selectedEClassUuid}
              rowData={rowData}
              setRowDatatop={setRowData}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              {isStudentListVisible && selectedEClassUuid && (
                <>
                  <Button
                    onClick={handleOpenStudentModal}
                    style={{
                      width: '30%',
                      fontFamily: "'Asap', sans-serif",
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: 'grey',
                      backgroundColor: '#feecfe',
                      borderRadius: '2.469rem',
                      border: 'none',
                    }}
                  >
                    학생 추가
                  </Button>

                  <Button
                    onClick={() => setIsStudentListVisible((prev) => !prev)}
                    style={{
                      width: '30%',
                      fontFamily: "'Asap', sans-serif",
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: 'grey',
                      backgroundColor: '#feecfe',
                      borderRadius: '2.469rem',
                      border: 'none',
                    }}
                  >
                    {isStudentListVisible ? '보고서' : '학생 리스트'}
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
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
            <Button
              onClick={() => setIsStudentListVisible((prev) => !prev)}
              style={{
                width: '30%',
                fontFamily: "'Asap', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'grey',
                backgroundColor: '#feecfe',
                borderRadius: '2.469rem',
                border: 'none',
              }}
            >
              {isStudentListVisible ? '보고서' : '학생 리스트'}
            </Button>
          </div>
        )}

        <Modal open={isStudentModalOpen} onClose={handleCloseStudentModal}>
          <Box sx={modalStyle}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                margin: '30px 0 20px 0',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: '1.5rem',
              }}
            >
              학생 리스트
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: '300px', overflowY: 'auto' }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#dcdcdc' }}>
                      번호
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#dcdcdc' }}>
                      이름
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#dcdcdc' }}>
                      소속
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      selected={selectedStudent?.id === student.id}
                      onClick={(event) => handleStudentSelect(event, student)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor:
                          selectedStudent?.id === student.id
                            ? '#e0e0e0'
                            : 'inherit',
                      }}
                    >
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell>{student.studentGroup}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              onClick={handleAddStudent}
              disabled={!selectedStudent}
              variant="contained"
              color="primary"
              style={{
                marginTop: '20px',
                fontFamily: "'Asap', sans-serif",
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'grey',
                backgroundColor: '#feecfe',
                borderRadius: '2.469rem',
                border: 'none',
              }}
            >
              추가
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
