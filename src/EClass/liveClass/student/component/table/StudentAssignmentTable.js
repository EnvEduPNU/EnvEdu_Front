import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import { Button, Typography } from "@mui/material";
import { customAxios } from "../../../../../Common/CustomAxios";
import StudentReportModal from "../../modal/StudentReportModal";

const columns = [
  {
    width: "10%",
    label: "Step",
    dataKey: "stepNum",
  },
  {
    width: "90%",
    label: "단계이름",
    dataKey: "contentName",
  },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
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
              backgroundColor: "#dcdcdc",
              textAlign: "center", // 가운데 정렬 추가
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
              backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
              cursor: "pointer",
              textAlign: "left",
              color: "inherit",
              pointerEvents: "auto",
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
  const [isDataAvailable, setIsDataAvailable] = useState(false); // 데이터가 들어왔는지 여부를 확인하는 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("테이블에서 disable 제외 카운트 : " + props.stepCount);
        console.log("들어갈때 lectureDataUuid ?? : " + props.lectureDataUuid);

        // 진행 중인 스텝 과제 테이블이 존재하면 가져오기
        const assignmentResponse = await customAxios.get(
          `/api/assignment/getstep?uuid=${props.lectureDataUuid}`
        );

        console.log(
          "예전 작성한 과제 있음 : " +
            JSON.stringify(assignmentResponse.data, null, 2)
        );

        if (assignmentResponse.data.length > 0) {
          // 첫 번째 요청의 데이터를 저장
          const assignmentData = assignmentResponse.data;

          // 두 번째 요청 실행
          const lectureResponse = await customAxios.get(
            "/api/steps/getLectureContent"
          );

          const filteredData = lectureResponse.data.filter(
            (data) => data.uuid === props.lectureDataUuid
          );

          // 첫 번째 요청 데이터와 두 번째 요청 데이터 비교 및 교체
          const updatedData = filteredData.flatMap((data) =>
            data.contents.map((content) => {
              // 첫 번째 요청 데이터 중 일치하는 stepNum 찾기
              const matchingAssignment = assignmentData
                .flatMap((assignment) => assignment.contents)
                .find(
                  (assignmentContent) =>
                    assignmentContent.stepNum === content.stepNum
                );

              // 리스트에 올려줄수 있게 정제하기
              return matchingAssignment
                ? {
                    stepNum: content.stepNum,
                    contentName: matchingAssignment.contentName, // 교체된 contentName
                    id: `${data.uuid}-${content.stepNum}`, // 고유한 id 사용
                    Step: data.stepName,
                    contents: matchingAssignment.contents, // 교체된 contents
                  }
                : {
                    stepNum: content.stepNum,
                    contentName: content.contentName,
                    id: `${data.uuid}-${content.stepNum}`, // 고유한 id 사용
                    Step: data.stepName,
                    contents: content.contents,
                  };
            })
          );

          // 정제되지 않은 matchingAssignment 객체들을 추출
          const allMatchingAssignments = filteredData.flatMap((data) =>
            data.contents.map((content) =>
              assignmentData
                .flatMap((assignment) => assignment.contents)
                .find(
                  (assignmentContent) =>
                    assignmentContent.stepNum === content.stepNum
                )
            )
          );

          // 2. matchingAssignment와 filteredData의 contents 배열 교체
          const updatedFilteredData = filteredData.map((data) => {
            // 각 data의 contents 배열을 allMatchingAssignments와 비교하여 교체
            const updatedContents = data.contents.map((content) => {
              const matchingAssignment = allMatchingAssignments.find(
                (assignmentContent) =>
                  assignmentContent &&
                  assignmentContent.stepNum === content.stepNum
              );

              // matchingAssignment가 있으면 교체, 없으면 기존 content 유지
              return matchingAssignment ? matchingAssignment : content;
            });

            return {
              ...data, // 기존 data 객체의 다른 속성들 유지
              contents: updatedContents, // contents 배열 교체
            };
          });

          console.log(
            "[있는]테이블 데이터 : " + JSON.stringify(updatedData, null, 2)
          );

          console.log(
            "[있는]올테이블 데이터 : " +
              JSON.stringify(updatedFilteredData, null, 2)
          );

          setTableData(updatedData);
          setAllTableData(updatedFilteredData);
          setIsDataAvailable(true); // 데이터가 들어왔음을 표시

          return;
        }
      } catch (err) {
        console.error("첫 번째 요청에서 에러 발생:", err);
      }

      // 첫 번째 요청이 실패하거나 데이터가 없을 경우 두 번째 요청 실행
      try {
        // 진행중인 과제 테이블 없으면 수업자료 가져오기
        const lectureResponse = await customAxios.get(
          "/api/steps/getLectureContent"
        );

        const filteredData = lectureResponse.data.filter(
          (data) => data.uuid === props.lectureDataUuid
        );

        // lectureSummary의 contents 배열을 펼쳐서 테이블에 표시할 수 있도록 변환
        const formattedLectureData = filteredData.flatMap((data) =>
          data.contents.map((content) => ({
            stepNum: content.stepNum,
            contentName: content.contentName,
            id: `${data.uuid}-${content.stepNum}`, // 고유한 id 사용
            Step: data.stepName,
            contents: content.contents,
          }))
        );

        console.log(
          "[없는]테이블 데이터 : " +
            JSON.stringify(formattedLectureData, null, 2)
        );

        console.log(
          "[없는]올테이블 데이터 : " + JSON.stringify(filteredData, null, 2)
        );
        setTableData(formattedLectureData);
        setAllTableData(filteredData);
      } catch (err) {
        console.error("두 번째 요청에서 에러 발생:", err);
      }
    };

    fetchData();
  }, [props.stepCount, props.lectureDataUuid]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleRowClick = (id, Step, stepNum) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    props.setCourseStep(Step);
    props.setStepCount(stepNum);
    // 스텝 클릭하면 상위 컴포넌트로 해당 스텝 정보 올려주기
    props.setTableData(allTableData);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".virtuoso-table")) {
      setSelectedRow(null);
    }
  };

  const [openModal, setOpenModal] = useState(false); // 모달 열림 상태 관리

  const handleAssignmentReport = () => {
    console.log("과제 전부 확인 : " + JSON.stringify(allTableData, null, 2));
    setOpenModal(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setOpenModal(false); // 모달 닫기
  };

  return (
    <div>
      <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
        {`${tableData[0]?.Step || "No Data"}`}
      </Typography>
      <Paper
        style={{ height: "60vh", width: "100%" }}
        className="virtuoso-table"
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={tableData}
          components={VirtuosoTableComponents}
          itemContent={
            (index, row) =>
              rowContent(
                index,
                row,
                handleRowClick,
                selectedRow,
                props.stepCount,
                isDataAvailable
              ) // stepCount를 rowContent에 전달
          }
          style={{ height: "55vh" }}
        />
      </Paper>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAssignmentReport}
        style={{ width: "100%", margin: "20px 0 0 0" }}
      >
        보고서
      </Button>
      {/* 모달 컴포넌트 렌더링 */}
      <StudentReportModal
        open={openModal}
        onClose={handleCloseModal}
        tableData={allTableData}
        latestTableData={props.latestTableData}
        assginmentCheck={props.assginmentCheck}
        stepCount={props.stepCount}
      />
    </div>
  );
}
