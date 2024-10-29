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
  Typography,
  Button,
} from '@mui/material';
import { customAxios } from '../../../../../../Common/CustomAxios';
import ReportViewModal from '../../../modal/ReportViewModal';

const columns = [
  { label: '번호', dataKey: 'Num', width: '15%' },
  { label: '이름', dataKey: 'Name', width: '25%' },
  { label: '상태', dataKey: 'Status', width: '25%' },
  { label: '보고서', dataKey: 'Action', width: '25%' },
];

function createData(index, Num, Name, Status, LectureData) {
  return { id: index, Num, Name, Status, LectureData };
}

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer
      component={Paper}
      {...props}
      ref={ref}
      sx={{ maxHeight: '100%', overflowY: 'auto' }}
    />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: 'separate', tableLayout: 'fixed', width: '400px' }}
    />
  ),
  TableHead: (props) => <TableHead {...props} />,
  TableRow: ({ item: _item, ...props }) => (
    <TableRow {...props} sx={{ height: '36px' }} />
  ),
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
            sx={{
              backgroundColor: '#dcdcdc',
              padding: '13px 8px',
              overflow: 'auto',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function rowContent(index, row, handleClick, selectedRow, handleOpenModal) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{ width: column.width }}
          sx={{
            backgroundColor: selectedRow === row.id ? '#f0f0f0' : 'inherit',
            padding: '6px 8px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {column.dataKey === 'Action' ? (
            <Button onClick={() => handleOpenModal(row)} sx={{ width: '50px' }}>
              확인
            </Button>
          ) : (
            row[column.dataKey]
          )}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function TeacherReportTable({ selectedEClassUuid }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedReport = useRef();

  const handleRowClick = (id, row) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.virtuoso-table')) {
      setSelectedRow(null);
    }
  };

  const handleOpenModal = async (row) => {
    selectedReport.current = row.Name;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(
          `/api/eclass/student/assignment/report/get/${selectedEClassUuid}`,
        );
        const reportInfoMap = response.data;

        const newRows = Object.entries(reportInfoMap).map(
          ([reportData, username], index) => {
            const status = username && reportData ? '제출됨' : '미제출';
            return createData(
              index + 1,
              index + 1,
              username,
              status,
              reportData,
            );
          },
        );

        setRows(newRows);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setRows([]);
      }
    };

    if (selectedEClassUuid) {
      fetchData();
    } else {
      setRows([]);
    }
  }, [selectedEClassUuid]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const uuidList = rows?.map((contents) => contents.LectureData);

    if (uuidList.length > 0) {
      const fetchData = async () => {
        try {
          const response = await customAxios.post(
            '/api/report/getstep',
            uuidList,
          );
          setReportData(response.data);
        } catch (error) {
          console.error('Error fetching report data:', error);
        }
      };

      fetchData();
    }
  }, [rows]);

  return (
    <div style={{ height: '460px', width: '410px', overflowY: 'auto' }}>
      <Paper
        style={{ height: '450px', width: '400px' }}
        className="virtuoso-table"
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        {!selectedEClassUuid ? (
          <Typography style={{ padding: '6rem', textAlign: 'center' }}>
            E-Class를 선택해 주세요.
          </Typography>
        ) : rows.length === 0 ? (
          <Typography style={{ padding: '6rem', textAlign: 'center' }}>
            제출한 보고서가 없습니다.
          </Typography>
        ) : (
          <TableVirtuoso
            style={{ height: '400px', overflowY: 'auto' }}
            data={rows}
            components={VirtuosoTableComponents}
            itemContent={(index, row) =>
              rowContent(
                index,
                row,
                handleRowClick,
                selectedRow,
                handleOpenModal,
              )
            }
          />
        )}
      </Paper>

      {isModalOpen && (
        <ReportViewModal
          open={isModalOpen}
          onClose={handleCloseModal}
          tableData={reportData?.filter(
            (data) => data.username === selectedReport.current,
          )}
        />
      )}
    </div>
  );
}
