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
import { Typography } from "@mui/material";
import { customAxios } from "../../../../../../Common/CustomAxios";

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
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="left" // 가운데 정렬 추가
          onClick={() => handleClick(row.id, row.Step, row.stepNum)}
          sx={{
            backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
            cursor: "pointer",
            textAlign: "left", // 가운데 정렬 추가
          }}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function TeacherAssignmentTable(props) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [allTableData, setAllTableData] = useState([]);

  useEffect(() => {
    console.log("비교 : " + props.eClassUuid);

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

        console.log(
          "Formatted Data for Table: " + JSON.stringify(formattedData, null, 2)
        );

        setTableData(formattedData);
        setAllTableData(filteredData);
        props.setTableData(filteredData);
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

    console.log("스텝 데이터 : " + JSON.stringify(filteredTableData, null, 2));

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
      <Typography variant="h5" sx={{ margin: "20px 0 10px 0" }}>
        {`${tableData[0]?.Step || "No Data"}`}
      </Typography>
      <Paper style={{ height: 300, width: "100%" }} className="virtuoso-table">
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={tableData}
          components={VirtuosoTableComponents}
          itemContent={(index, row) =>
            rowContent(index, row, handleRowClick, selectedRow)
          }
          style={{ height: 250 }}
        />
      </Paper>
    </div>
  );
}
