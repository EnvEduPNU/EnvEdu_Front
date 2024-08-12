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

function rowContent(
  _index,
  row,
  handleClick,
  selectedRow,
  stepCount,
  isDataAvailable
) {
  const parseStepCount = parseInt(stepCount);
  const isDisabled = row.stepNum !== parseStepCount;

  // console.log("디스에이블드 표시 : " + isDataAvailable);

  // if (isDataAvailable) {
  //   isDisabled = isDataAvailable;
  // }

  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="left"
          onClick={() =>
            !isDisabled && handleClick(row.id, row.Step, row.stepNum)
          } // 비활성화된 셀은 클릭 무시
          sx={{
            backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
            cursor: isDisabled ? "not-allowed" : "pointer",
            textAlign: "left",
            color: isDisabled ? "gray" : "inherit", // 비활성화된 셀은 회색으로 표시
            pointerEvents: isDisabled ? "none" : "auto", // 비활성화된 셀은 클릭 불가능
          }}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function StudentAssignmentTable(props) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [allTableData, setAllTableData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false); // 데이터가 들어왔는지 여부를 확인하는 상태

  useEffect(() => {
    console.log("테이블에서 disable 제외 카운트 : " + props.stepCount);

    customAxios
      .get(`/api/assignment/get?uuid=${props.lectureDataUuid}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          console.log(
            "오른쪽 리스트 가져온거 확인하기 : " +
              JSON.stringify(res.data, null, 2)
          );

          // lectureSummary의 contents 배열을 펼쳐서 테이블에 표시할 수 있도록 변환
          const formattedData = res.data.flatMap((data) =>
            data.contents.map((content) => ({
              stepNum: content.stepNum,
              contentName: content.contentName,
              id: `${data.uuid}-${content.stepNum}`, // unique id 생성
              Step: data.stepName,
            }))
          );

          setTableData(formattedData);
          setAllTableData(res.data);
          setIsDataAvailable(true); // 데이터가 들어왔음을 표시

          // 첫 번째 요청의 데이터가 존재하면, 두 번째 요청은 실행하지 않음
          return;
        }

        // 첫 번째 요청의 데이터가 존재하지 않으면, 두 번째 요청을 실행
        customAxios
          .get("/api/steps/getLectureContent")
          .then((res) => {
            const filteredData = res.data.filter(
              (data) => data.uuid === props.lectureDataUuid
            );

            // lectureSummary의 contents 배열을 펼쳐서 테이블에 표시할 수 있도록 변환
            const formattedData = filteredData.flatMap((data) =>
              data.contents.map((content) => ({
                stepNum: content.stepNum,
                contentName: content.contentName,
                id: `${data.uuid}-${content.stepNum}`, // unique id 생성
                Step: data.stepName,
              }))
            );

            // console.log(
            //   "Formatted Data for Table: " +
            //     JSON.stringify(formattedData, null, 2)
            // );

            setTableData(formattedData);
            setAllTableData(filteredData);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleRowClick = (id, Step, stepNum) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    props.setCourseStep(Step);

    // console.log("몇번째 스텝? : " + JSON.stringify(stepNum, null, 2));
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
          // onClick={}
          style={{ width: "100%", margin: "20px 0 0 0" }}
        >
          보고서
        </Button>
      )}
    </div>
  );
}
