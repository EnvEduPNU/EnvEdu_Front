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
} from '@mui/material';
import moment from 'moment';

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

export default function StudentStudentList({ eclassUuid, setRowDatatop }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowData, setRowData] = useState([]);

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

            setRowData((prevRowData) => [...prevRowData, ...newStudents]);
            setRowDatatop(newStudents);
          })
          .catch((error) => {
            console.error('Error fetching student list:', error);
          });
      });
    }
  }, [eclassUuid]);

  const handleRowClick = (id, row) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    console.log(row);
  };

  const handleDelete = (id) => {
    setRowData((prevRowData) => prevRowData.filter((row) => row.id !== id));
    console.log(`Row with id ${id} deleted`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.virtuoso-table') &&
        !event.target.closest('.modal-table')
      ) {
        setSelectedRow(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ height: '460px', width: '400px', overflow: 'auto' }}>
      <Paper
        style={{ height: '450px', width: '400px' }}
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
            style={{ height: 400, overflow: 'auto' }}
          />
        ) : (
          <Typography style={{ padding: '6rem' }}>
            EClass를 선택해주세요.
          </Typography>
        )}
      </Paper>
    </div>
  );
}
