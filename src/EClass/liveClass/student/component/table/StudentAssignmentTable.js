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
        const cellKey = `${row.id}-${column.dataKey}`; // 고유하고 안정적인 key 생성
        return (
          <TableCell
            key={cellKey}
            align="left"
            onClick={() => handleClick(row.id, row.Step, row.stepNum)}
            sx={{
              backgroundColor: selectedRow === row.id ? '#f0f0f0' : 'inherit',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
              pointerEvents: 'auto',
            }}
          >
            {row[column.dataKey]}
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          eclassUuid: props.eclassUuid,
          username: localStorage.getItem('username'),
        };

        const assignmentUuidResp = await customAxios.post(
          '/api/eclass/student/assginmentUuid/get',
          requestData,
        );

        // console.log(
        //   'Assignmnet Uuid 잘 나오나 확인 : ' +
        //     JSON.stringify(assignmentUuidResp, null, 2),
        // );

        const assignmentResponse = await customAxios.get(
          `/api/assignment/getstep?uuid=${assignmentUuidResp.data}`,
        );
        // console.log(
        //   '수업 정보 확인 : ' + JSON.stringify(assignmentResponse, null, 2),
        // );

        if (assignmentResponse.data.length > 0) {
          const assignmentData = assignmentResponse.data;

          const lectureResponse = await customAxios.get(
            '/api/steps/getLectureContent',
          );
          // console.log(
          //   '수업 자료 확인 : ' + JSON.stringify(lectureResponse, null, 2),
          // );

          const filteredData = lectureResponse.data.filter(
            (data) => data.uuid === props.lectureDataUuid,
          );

          const updatedData = filteredData.flatMap((data) =>
            data.contents.map((content) => {
              const matchingAssignment = assignmentData
                .flatMap((assignment) => assignment.contents)
                .find(
                  (assignmentContent) =>
                    assignmentContent.stepNum === content.stepNum,
                );

              return matchingAssignment
                ? {
                    stepNum: content.stepNum,
                    contentName: matchingAssignment.contentName,
                    id: `${data.uuid}-${content.stepNum}`,
                    Step: data.stepName,
                    contents: matchingAssignment.contents,
                  }
                : {
                    stepNum: content.stepNum,
                    contentName: content.contentName,
                    id: `${data.uuid}-${content.stepNum}`,
                    Step: data.stepName,
                    contents: content.contents,
                  };
            }),
          );

          const allMatchingAssignments = filteredData.flatMap((data) =>
            data.contents.map((content) =>
              assignmentData
                .flatMap((assignment) => assignment.contents)
                .find(
                  (assignmentContent) =>
                    assignmentContent.stepNum === content.stepNum,
                ),
            ),
          );

          const updatedFilteredData = filteredData.map((data) => {
            const updatedContents = data.contents.map((content) => {
              const matchingAssignment = allMatchingAssignments.find(
                (assignmentContent) =>
                  assignmentContent &&
                  assignmentContent.stepNum === content.stepNum,
              );

              return matchingAssignment ? matchingAssignment : content;
            });

            return {
              ...data,
              contents: updatedContents,
            };
          });

          setTableData(updatedData);
          setAllTableData(updatedFilteredData);
          setIsDataAvailable(true);

          props.setTableData(updatedFilteredData);
          return;
        }
      } catch (err) {
        console.error('Error in first request:', err);
      }

      try {
        const lectureResponse = await customAxios.get(
          '/api/steps/getLectureContent',
        );

        const filteredData = lectureResponse.data.filter(
          (data) => data.uuid === props.lectureDataUuid,
        );

        const formattedLectureData = filteredData.flatMap((data) =>
          data.contents.map((content) => ({
            stepNum: content.stepNum,
            contentName: content.contentName,
            id: `${data.uuid}-${content.stepNum}`,
            Step: data.stepName,
            contents: content.contents,
          })),
        );

        setTableData(formattedLectureData);
        setAllTableData(filteredData);

        props.setTableData(filteredData);
      } catch (err) {
        console.error('Error in second request:', err);
      }
    };

    // if (!isDataAvailable) {
    fetchData();
    // }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleRowClick = (id, Step, stepNum) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    props.setCourseStep(Step);
    props.setStepCount(stepNum);
    props.setTableData(allTableData);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.virtuoso-table')) {
      setSelectedRow(null);
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const handleAssignmentReport = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div style={{ width: '100%', height: '550px', overflow: 'auto' }}>
      <Typography variant="h5" sx={{ margin: '0 0 10px 0' }}>
        {`${tableData[0]?.Step || 'No Data'}`}
      </Typography>
      <Paper
        style={{ width: '100%', height: '500px', overflow: 'auto' }}
        className="virtuoso-table"
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={tableData}
          components={VirtuosoTableComponents}
          itemContent={(index, row) =>
            rowContent(
              index,
              row,
              handleRowClick,
              selectedRow,
              props.stepCount,
              isDataAvailable,
            )
          }
          style={{ height: '100%' }}
        />
      </Paper>
    </div>
  );
}
