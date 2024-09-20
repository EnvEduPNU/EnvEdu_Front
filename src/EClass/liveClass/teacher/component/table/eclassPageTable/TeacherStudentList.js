import React, { useState, useEffect } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { customAxios } from '../../../../../../Common/CustomAxios';
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
import moment from 'moment'; // 날짜 처리 라이브러리

const columns = [
  { label: '번호', dataKey: 'Num', width: '20%' },
  { label: '이름', dataKey: 'Name', width: '20%' },
  { label: '소속', dataKey: 'LectureData', width: '20%' },
  { label: '참여일', dataKey: 'Status', width: '20%' },
  { label: '', dataKey: 'Action', width: '20%' },
];

function createData(index, [Num, Name, LectureData, Status]) {
  return { id: index, Num, Name, LectureData, Status };
}

function fixedHeaderContent() {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align="center"
            style={{ width: column.width }}
            sx={{ backgroundColor: '#dcdcdc' }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function rowContent(index, row, handleClick, handleDelete, selectedRow) {
  const requestDelete = (studentId) => {
    customAxios
      .delete(`/api/eclass/student/delete?studentId=${studentId}`)
      .then((response) => {
        console.log('삭제 결과 : ' + JSON.stringify(response.data, null, 2));
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error fetching student list:', error);
      });
  };

  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{ width: column.width }}
          sx={{
            padding: '8px', // 패딩을 줄이기 위해 추가
            backgroundColor: selectedRow === row.id ? '#f0f0f0' : 'inherit',
          }}
        >
          {column.dataKey === 'Action' ? (
            <Button
              variant="outlined"
              color="secondary"
              style={{ width: column.width }}
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 전파 방지
                console.log(
                  '여기 삭제는 뭐지 : ' + JSON.stringify(row, null, 2),
                );
                requestDelete(row.Num);
                handleDelete(row.id);
              }}
            >
              삭제
            </Button>
          ) : (
            <span
              onClick={() =>
                column.dataKey !== 'Action' && handleClick(row.id, row)
              }
            >
              {row[column.dataKey]}
            </span>
          )}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TeacherStudentList({ eclassUuid, selectedEClassUuid }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  useEffect(() => {
    if (Array.isArray(eclassUuid) && eclassUuid.length > 0) {
      setRowData([]); // 이전 데이터를 지우고 새로운 데이터를 받기 위한 초기화
      console.log('유유아이디 확인 : ' + eclassUuid);

      eclassUuid.forEach((uuid) => {
        customAxios
          .get(`/api/eclass/student/joinList?eclassUuid=${uuid}`)
          .then((response) => {
            const students = response.data;

            console.log(
              `EClass 참여학생 형식변환전 (UUID: ${uuid}) : ` +
                JSON.stringify(students, null, 2),
            );

            // 학생 리스트를 rowData 형식으로 변환
            const newStudents = students.map((student, index) =>
              createData(index, [
                student.studentId,
                student.studentName,
                student.studentGroup,
                moment(student.joinDate).format('YYYY-MM-DD'),
              ]),
            );

            console.log(
              `EClass 참여학생 (UUID: ${uuid}) : ` +
                JSON.stringify(newStudents, null, 2),
            );

            // 기존 rowData에 추가
            setRowData((prevRowData) => [...prevRowData, ...newStudents]);
          })
          .catch((error) => {
            console.error('Error fetching student list:', error);
          });
      });
    }
  }, [eclassUuid]); // eclassUuid가 변경될 때마다 실행

  const handleRowClick = (id, row) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    console.log(row);
  };

  const handleDelete = (id) => {
    setRowData((prevRowData) => prevRowData.filter((row) => row.id !== id));
    console.log(`Row with id ${id} deleted`);
  };

  const handleClickOutside = (event) => {
    if (
      !event.target.closest('.virtuoso-table') &&
      !event.target.closest('.modal-table')
    ) {
      setSelectedRow(null);
      setSelectedStudent(null); // 모달에서도 선택 해제
    }
  };

  const handleOpen = (e) => {
    e.stopPropagation(); // 이벤트 전파 방지
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null); // 모달을 닫을 때 선택 해제
  };

  const handleStudentSelect = (event, student) => {
    event.stopPropagation(); // 이벤트 전파 방지
    setSelectedStudent((prevSelectedStudent) =>
      prevSelectedStudent?.id === student.id ? null : student,
    );
  };

  const handleAddStudent = () => {
    if (selectedStudent) {
      console.log('선택된 학생 : ' + JSON.stringify(selectedStudent, null, 2));

      const newStudent = createData(rowData.length + 1, [
        selectedStudent.id,
        selectedStudent.username,
        selectedStudent.studentGroup,
        moment().tz('Asia/Seoul').format('YYYY-MM-DD'), // 현재 서울 시각을 ISO 8601 포맷으로 추가
      ]);

      const enrollStudent = {
        eclassUuid: eclassUuid,
        studentId: selectedStudent.id,
        studentName: selectedStudent.username,
        studentGroup: selectedStudent.studentGroup,
        joinDate: moment().tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ssZ'), // 현재 서울 시각을 ISO 8601 포맷으로 추가
      };

      console.log(
        '요청보내기전 확인 : ' + JSON.stringify(enrollStudent, null, 2),
      );

      if (!eclassUuid) {
        alert('EClass를 선택하세요!');
        return;
      }

      // customAxios로 POST 요청 보내기
      customAxios
        .post('/api/eclass/student/enroll', enrollStudent)
        .then((response) => {
          console.log('Student added successfully:', response.data);
          setRowData((prevRowData) => [...prevRowData, newStudent]);
          setSelectedStudent(null);
          handleClose();

          window.location.reload();
        })
        .catch((error) => {
          console.error('Error adding student:', error);
        });
    }
  };

  // 이미 rowData에 있는 학생들을 제외한 학생 리스트 필터링
  const availableStudents = studentList.filter(
    (student) => !rowData.some((row) => row.Num === student.id),
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Typography
        variant="h5"
        sx={{
          margin: '38px 0 10px 0',
          fontFamily: "'Montserrat', sans-serif", // 타이틀에 Montserrat 폰트 적용
          fontWeight: '600', // 폰트 두께
          fontSize: '1.5rem', // 폰트 크기
        }}
      >
        {' 참여학생리스트 '}
      </Typography>
      <Paper
        style={{ height: '100%', width: '100%' }}
        className="virtuoso-table"
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        {rowData.length > 0 ? (
          <TableVirtuoso
            data={rowData}
            itemContent={(index, row) =>
              rowContent(index, row, handleRowClick, handleDelete, selectedRow)
            }
            style={{ height: 200 }}
          />
        ) : (
          <Typography style={{ padding: '6rem' }}>
            EClass를 선택해주세요.
          </Typography>
        )}
      </Paper>
      {selectedEClassUuid ? (
        <Button
          onClick={handleOpen}
          style={{
            margin: '10px 0 0 0',
            width: '30%',
            fontFamily: "'Asap', sans-serif", // 버튼에 Asap 폰트 적용
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'grey',
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
          }}
        >
          학생추가
        </Button>
      ) : (
        <div style={{ padding: '18px', width: '30%' }}></div>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle} className="modal-table">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              margin: '30px 0 20px 0',
              fontFamily: "'Montserrat', sans-serif", // 타이틀에 Montserrat 폰트 적용
              fontWeight: '600', // 폰트 두께
              fontSize: '1.5rem', // 폰트 크기
            }}
          >
            학생 리스트
          </Typography>
          <TableContainer component={Paper}>
            <Table>
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
              fontFamily: "'Asap', sans-serif", // 버튼에 Asap 폰트 적용
              fontWeight: '600',
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
  );
}
