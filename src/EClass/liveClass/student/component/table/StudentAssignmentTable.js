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
          "들고올수나 : " + JSON.stringify(assignmentResponse.data, null, 2)
        );

        if (assignmentResponse.data) {
          console.log(
            "예전 작성한 과제 있음 : " +
              JSON.stringify(assignmentResponse.data, null, 2)
          );

          // lectureSummary의 contents 배열을 펼쳐서 테이블에 표시할 수 있도록 변환
          const formattedData = assignmentResponse.data.flatMap((data) =>
            data.contents.map((content) => ({
              stepNum: content.stepNum,
              contentName: content.contentName,
              id: `${data.uuid}-${content.stepNum}`, // unique id 생성
              Step: data.stepName,
              contents: content.contents,
            }))
          );

          setTableData(formattedData);
          setAllTableData(assignmentResponse.data);
          setIsDataAvailable(true); // 데이터가 들어왔음을 표시

          // 첫 번째 요청의 데이터가 존재하면, 두 번째 요청은 실행하지 않음
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

    console.log("몇번째 스텝? : " + JSON.stringify(stepNum, null, 2));
    props.setStepCount(stepNum);

    const filteredTableData = allTableData
      .map((data) => {
        const filteredContents = data.contents.filter(
          (content) => content.stepNum === stepNum
        );
        return {
          ...data,
          contents: filteredContents,
        };
      })
      .filter((data) => data.contents.length > 0); // 필터링 후 빈 contents가 있는 항목 제거

    // console.log("스텝 데이터 : " + JSON.stringify(filteredTableData, null, 2));

    // 스텝 클릭하면 상위 컴포넌트로 해당 스텝 정보 올려주기
    props.setTableData(filteredTableData);
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
      {props.reportTable && props.reportTable.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignmentReport}
          style={{ width: "100%", margin: "20px 0 0 0" }}
        >
          보고서
        </Button>
      )}
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
