import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import { Typography } from '@mui/material';

const columns = [
  {
    width: '100%',
    label: 'E-Class 리스트',
    dataKey: 'contentName',
  },
];

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
  TableHead,
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
            sx={{
              backgroundColor: '#dcdcdc',
              textAlign: 'center',
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function rowContent(_index, row, handleClick, selectedRow) {
  return (
    <>
      {columns.map((column) => {
        const cellKey = `${row.stepNum}-${column.dataKey}`; // 고유하고 안정적인 key 생성
        return (
          <TableCell
            key={cellKey}
            align="left"
            // onClick={() =>
            //   handleClick(row.stepNum, row.contentName, row.stepNum)
            // }
            sx={{
              backgroundColor:
                selectedRow === row.stepNum ? '#f0f0f0' : 'inherit',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
              pointerEvents: 'auto',
            }}
          >
            {row[column.dataKey]} {/* contentName 표시 */}
          </TableCell>
        );
      })}
    </>
  );
}

export default function StudentAssignmentTable(props) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (stepNum, contentName, stepNumParam) => {
    console.log('클릭된 StepNum:', stepNum);

    setSelectedRow((prevSelectedRow) =>
      prevSelectedRow === stepNum ? null : stepNum,
    ); // stepNum 기준으로 상태 업데이트
    props.setCourseStep(contentName); // contentName을 CourseStep으로 설정
    props.setStepCount(stepNumParam); // stepNum을 stepCount로 설정
  };

  // 초기 렌더링 시 localStorage에서 stepNum 확인
  useEffect(() => {
    const storedStepNum = localStorage.getItem('stepNum');
    if (storedStepNum) {
      const stepNum = parseInt(storedStepNum, 10);
      const selectedRowData = props.tableData.find(
        (row) => row.stepNum === stepNum,
      );

      if (selectedRowData) {
        // 로컬스토리지 값에 맞는 행을 선택
        setSelectedRow(stepNum);
        props.setCourseStep(selectedRowData.contentName);
        props.setStepCount(stepNum);
      }
    }
  }, [props.tableData, props.setCourseStep, props.setStepCount]);

  return (
    <div style={{ width: '100%', height: '550px', overflow: 'auto' }}>
      <Typography variant="h5" sx={{ margin: '0 0 10px 0' }}>
        {`Eclass Step`}
      </Typography>
      <Paper
        style={{
          width: '100%',
          height: '500px',
          overflow: 'auto',
          pointerEvents: 'none',
        }}
        className="virtuoso-table"
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={props.tableData}
          components={VirtuosoTableComponents}
          itemContent={(index, row) =>
            rowContent(index, row, handleRowClick, selectedRow, props.stepCount)
          }
          style={{ height: '100%' }}
        />
      </Paper>
    </div>
  );
}
