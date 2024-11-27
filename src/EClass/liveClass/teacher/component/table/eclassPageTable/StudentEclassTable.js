import React, { useState, useEffect, useRef } from 'react';
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
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const columns = [
  { label: '번호', dataKey: 'Num', width: '10%' },
  { label: '이름', dataKey: 'Name', width: '15%' },
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

export default function StudentEclassTable({ setSelectedEClassUuid }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowData, setRowData] = useState([]);
  const stompClientRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!stompClientRef.current) {
      const token = localStorage.getItem('access_token').replace('Bearer ', '');
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`,
      );
      stompClientRef.current = new Client({ webSocketFactory: () => sock });

      stompClientRef.current.onConnect = () => {
        console.log('STOMP 연결 성공');
      };

      stompClientRef.current.activate();
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate(() => {
          console.log('STOMP 연결 해제');
        });
      }
    };
  }, []);

  useEffect(() => {
    const fetchEclassData = async () => {
      try {
        const StudentName = localStorage.getItem('username');
        const eclassListResponse = await customAxios.get('/api/eclass/list');
        const eclassList = eclassListResponse.data;

        const studentEclassResponse = await customAxios.get(
          `/api/eclass/student/eclassUuids?studentName=${StudentName}`,
        );
        const uuidList = studentEclassResponse.data;

        const filteredList = eclassList.filter((item) =>
          uuidList.includes(item.eClassUuid),
        );

        const rows = filteredList.map((item, index) => createData(index, item));

        setRowData(rows);
      } catch (error) {
        console.error('Eclass 리스트 조회 에러:', error);
      }
    };

    fetchEclassData();
  }, []);

  const handleRowClick = (id, row) => {
    setSelectedRow(id);
    setSelectedEClassUuid(row.eClassUuid);
  };

  const joinEclass = async (row) => {
    try {
      const response = await customAxios.get(
        `/api/eclass/status-check?uuid=${row.eClassUuid}`,
      );
      const eClassStatus = response.data;

      if (eClassStatus) {
        navigate(`/LiveStudentPage/${row.eClassUuid}`, {
          state: {
            lectureDataUuid: row.LectureData,
            row,
            eClassUuid: row.eClassUuid,
          },
        });
      } else {
        alert('수업 시작을 기다려주세요!');
      }
    } catch (error) {
      console.error('Eclass 수업 존재 체크 에러:', error);
    }
  };

  const deleteEclass = async (row) => {
    const confirmation = window.confirm(
      `정말 "${row.Name}" 수업을 삭제하시겠습니까?`,
    );
    if (!confirmation) return;

    try {
      const response = await customAxios.delete(
        `/api/eclass/student/delete?eClassUuid=${
          row.eClassUuid
        }&studentName=${localStorage.getItem('username')}`,
      );

      if (response.status === 200) {
        alert('E-Class 삭제 성공!');
        setRowData((prevRowData) =>
          prevRowData.filter((item) => item.eClassUuid !== row.eClassUuid),
        );
      } else {
        alert(`E-Class 삭제 실패! 상태 코드: ${response.status}`);
      }
    } catch (error) {
      console.error('Eclass 삭제 에러:', error);
      alert('E-Class 삭제 실패!');
    }
  };

  const rowContent = (index, row) => (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{ width: column.width }}
          sx={{
            backgroundColor: selectedRow === row.Num ? '#f0f0f0' : 'inherit',
            cursor: column.dataKey !== 'Action' ? 'pointer' : 'default',
          }}
          onClick={() =>
            column.dataKey !== 'Action' && handleRowClick(row.Num, row)
          }
        >
          {column.dataKey === 'Action' ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => joinEclass(row)}
                sx={{
                  marginRight: 1,
                  fontFamily: "'Asap', sans-serif",
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'gray',
                  backgroundColor: '#feecfe',
                  borderRadius: '1rem',
                }}
              >
                들어가기
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteEclass(row)}
                sx={{
                  fontFamily: "'Asap', sans-serif",
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  borderRadius: '1rem',
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
          style={{ height: '400px' }}
        />
      </Paper>
    </div>
  );
}
