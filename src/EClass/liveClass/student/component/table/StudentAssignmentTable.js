import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import { Typography } from '@mui/material';
import { customAxios } from '../../../../../Common/CustomAxios';

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
    <React.Fragment>
      {columns.map((column) => {
        console.log('현재 selectedRow:', selectedRow);
        console.log('row 확인 :', JSON.stringify(row, null, 2));

        const cellKey = `${row.stepNum}-${column.dataKey}`; // 고유하고 안정적인 key 생성
        return (
          <TableCell
            key={cellKey}
            align="left"
            onClick={() =>
              handleClick(row.stepNum, row.contentName, row.stepNum)
            }
            sx={{
              backgroundColor:
                selectedRow === row.stepNum ? '#f0f0f0' : 'inherit', // stepNum 기준으로 비교
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
    </React.Fragment>
  );
}

export default function StudentAssignmentTable(props) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [allTableData, setAllTableData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const handleRowClick = (stepNum, contentName, stepNumParam) => {
    console.log('클릭된 StepNum:', stepNum);

    setSelectedRow((prevSelectedRow) =>
      prevSelectedRow === stepNum ? null : stepNum,
    ); // stepNum 기준으로 상태 업데이트
    props.setCourseStep(contentName); // contentName을 CourseStep으로 설정
    props.setStepCount(stepNumParam); // stepNum을 stepCount로 설정
  };

  useEffect(() => {
    console.log('테이블 확인 : ' + JSON.stringify(props.tableData, null, 2));
  }, [props]);

  return (
    <div style={{ width: '100%', height: '550px', overflow: 'auto' }}>
      <Typography variant="h5" sx={{ margin: '0 0 10px 0' }}>
        {`${props.tableData[0]?.Step || 'No Data'}`}
      </Typography>
      <Paper
        style={{ width: '100%', height: '500px', overflow: 'auto' }}
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
