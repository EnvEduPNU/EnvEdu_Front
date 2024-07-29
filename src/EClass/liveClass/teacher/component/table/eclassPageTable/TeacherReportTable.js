import React, { useState, useEffect } from "react";
import { TableVirtuoso } from "react-virtuoso";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const sample = [
  ["1", "홍길동", "A1", "미제출"],
  ["2", "김민우", "A1", "제출"],
];

const columns = [
  {
    label: "번호",
    dataKey: "Num",
    width: "15%",
  },
  {
    label: "이름",
    dataKey: "Name",
    width: "25%",
  },
  {
    label: "수업자료",
    dataKey: "LectureData",
    width: "25%",
  },
  {
    label: "상태",
    dataKey: "Status",
    width: "25%",
  },
];

function createData(index, [Num, Name, LectureData, Status]) {
  return { id: index, Num, Name, LectureData, Status };
}

const rows = sample.map((item, index) => createData(index, item));

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
            sx={{
              backgroundColor: "#dcdcdc",
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
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{ width: column.width }}
          sx={{
            backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
            cursor: column.dataKey !== "Action" ? "pointer" : "default",
            "&:hover": {
              backgroundColor:
                column.dataKey !== "Action" ? "#e0e0e0" : "inherit",
            },
          }}
          onClick={() =>
            column.dataKey !== "Action" && handleClick(row.id, row)
          }
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function TeacherReportTable(props) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (id, row) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    props.setCourseStep(row);
    console.log(row);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".virtuoso-table")) {
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Typography variant="h5" sx={{ margin: "20px 0 10px 0" }}>
        {"[ 보고서 제출 ]"}
      </Typography>
      <Paper style={{ height: 250, width: "100%" }} className="virtuoso-table">
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          itemContent={(index, row) =>
            rowContent(index, row, handleRowClick, selectedRow)
          }
          style={{ height: 200 }}
        />
      </Paper>
    </div>
  );
}
