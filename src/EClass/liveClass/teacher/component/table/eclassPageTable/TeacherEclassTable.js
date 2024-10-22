import React, { useState, useEffect, useCallback } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { customAxios } from '../../../../../../Common/CustomAxios';
import { useNavigate } from 'react-router-dom';

const columns = [
  { label: '번호', dataKey: 'Num', width: '8%' },
  { label: '이름', dataKey: 'Name', width: '10%' },
  { label: '강사', dataKey: 'Teacher', width: '15%' },
  { label: '개설일', dataKey: 'CreateEclassDate', width: '15%' },
  { label: '수업자료', dataKey: 'LectureDataName', width: '15%' },
  { label: '', dataKey: 'Action', width: '20%' },
];

const createData = (index, item) => ({
  Num: index + 1,
  eClassUuid: item.eClassUuid,
  Status: item.eclassAssginSubmitNum,
  LectureData: item.lectureDataUuid,
  LectureDataName: item.lectureDataName,
  Name: item.lectureName,
  CreateEclassDate: item.startDate,
  Teacher: item.username,
});

const deleteData = async (row, handleDelete) => {
  const confirmation = window.confirm('정말 삭제하시겠습니까?');
  if (!confirmation) return;

  try {
    const respDeleteEclass = await customAxios.delete(
      `/api/eclass/delete?eClassUuid=${row.eClassUuid}`,
    );
    console.log(respDeleteEclass.data);

    try {
      const respDeleteEclassStudent = await customAxios.delete(
        `/api/eclass/student/joined/delete?eClassUuid=${row.eClassUuid}`,
      );
      console.log(respDeleteEclassStudent.data);
    } catch (error) {
      console.error('Eclass 학생 삭제 에러:', error);
    }

    handleDelete(row);
    window.location.reload();
  } catch (error) {
    console.error('Eclass 리스트 삭제 에러:', error);
  }
};

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }}
    />
  ),
  TableHead: (props) => <TableHead {...props} />,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const fixedHeaderContent = () => (
  <TableHead>
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align="center"
          style={{
            width: column.width,
            backgroundColor: '#dcdcdc',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: '600',
            fontSize: '1rem',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default function TeacherEclassTable({ setSelectedEClassUuid }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();

  const handleRowClick = useCallback(
    (id, row) => {
      setSelectedRow(id);
      setSelectedEClassUuid(row.eClassUuid);
    },
    [setSelectedEClassUuid],
  );

  const handleDelete = useCallback((row) => {
    setRowData((prevRowData) =>
      prevRowData.filter((prevRow) => prevRow.Num !== row.Num),
    );
    console.log(`Row with id ${row.Num} deleted`);
  }, []);

  const handleClickOutside = useCallback(
    (event) => {
      if (!event.target.closest('.virtuoso-table')) {
        setSelectedRow(null);
        // setSelectedEClassUuid(null);
      }
    },
    [setSelectedEClassUuid],
  );

  const joinEclass = async (row) => {
    console.log(
      'Navigating to eClassPage with row:',
      JSON.stringify(row, null, 2),
    );

    const { eClassUuid, LectureData: lectureDataUuid, Name: eClassName } = row;

    try {
      const response = await customAxios.patch(
        `/api/eclass/eclass-start?uuid=${eClassUuid}`,
      );
      console.log('Eclass started:', response.data);

      navigate(`/LiveTeacherPage/${eClassUuid}`, {
        state: {
          lectureDataUuid,
          eClassName,
          eClassUuid,
        },
      });
    } catch (error) {
      console.error('Eclass 시작 에러:', error);
    }
  };

  const rowContent = (index, row) => (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{
            width: column.width,
            backgroundColor: selectedRow === row.Num ? '#f0f0f0' : 'inherit',
            cursor: 'pointer',
            fontFamily: "'Asap', sans-serif",
            fontSize: '0.9rem',
          }}
          onClick={() =>
            column.dataKey !== 'Action' && handleRowClick(row.Num, row)
          }
        >
          {column.dataKey === 'Action' ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => joinEclass(row)}
                sx={{
                  marginRight: 1,
                  fontFamily: "'Asap', sans-serif",
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'grey',
                  backgroundColor: '#feecfe',
                  borderRadius: '2.469rem',
                  border: 'none',
                }}
              >
                들어가기
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => deleteData(row, handleDelete)}
                sx={{
                  fontFamily: "'Asap', sans-serif",
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  borderRadius: '2.469rem',
                }}
              >
                삭제
              </Button>
            </div>
          ) : (
            <span>{row[column.dataKey]}</span>
          )}
        </TableCell>
      ))}
    </React.Fragment>
  );

  useEffect(() => {
    const fetchData = async () => {
      const name = localStorage.getItem('username');
      try {
        const response = await customAxios.get('/api/eclass/list');
        const list = response.data;

        console.log('Eclass list:', list);

        const filteredList = list.filter((item) => item.username === name);
        const rows = filteredList.map((item, index) => createData(index, item));

        setRowData(rows);
      } catch (error) {
        console.error('Eclass 리스트 조회 에러:', error);
      }
    };

    fetchData();
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div>
      <Paper
        style={{ height: '100%', minWidth: '50rem' }}
        className="virtuoso-table"
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={rowData}
          components={VirtuosoTableComponents}
          itemContent={(index, row) => rowContent(index, row)}
          style={{ height: '580px' }}
        />
      </Paper>
    </div>
  );
}
