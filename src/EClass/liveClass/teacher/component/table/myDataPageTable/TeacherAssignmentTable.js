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
    width: "100%",
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
            align="left"
            style={{ width: column.width }}
            sx={{
              backgroundColor: "#dcdcdc",
              textAlign: "left",
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function rowContent(index, row, handleClick, selectedRow) {
  return columns.map((column) => (
    <TableCell
      key={`${row.id}-${column.dataKey}`} // 고유한 key 설정
      align="left"
      onClick={() => handleClick(row.id, row.Step, row.stepNum)}
      sx={{
        backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {row[column.dataKey]}
    </TableCell>
  ));
}

export default function TeacherAssignmentTable(props) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [allTableData, setAllTableData] = useState([]);

  useEffect(() => {
    customAxios
      .get("/api/steps/getLectureContent")
      .then((res) => {
        const filteredData = res.data.filter(
          (data) => data.uuid === props.lectureDataUuid
        );

        const formattedData = filteredData.flatMap((data) =>
          data.contents.map((content) => ({
            contentName: content.contentName,
            id: `${data.uuid}-${content.stepNum}`,
            Step: data.stepName,
            stepNum: content.stepNum,
          }))
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
      .filter((data) => data.contents.length > 0);

    props.setTableData(filteredTableData);
    props.setAssginmentShareCheck(null);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".virtuoso-table")) {
      setSelectedRow(null);
    }
  };

  return (
    <div>
      <Typography variant="h5" sx={{ margin: "20px 0 10px 0" }}>
        {`${tableData[0]?.Step || "수업자료가 없어요"}`}
      </Typography>
      <Paper style={{ height: 230, width: "100%" }} className="virtuoso-table">
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={tableData}
          components={VirtuosoTableComponents}
          itemContent={(index, row) =>
            rowContent(index, row, handleRowClick, selectedRow)
          }
          style={{ height: 180 }}
        />
      </Paper>
    </div>
  );
}
