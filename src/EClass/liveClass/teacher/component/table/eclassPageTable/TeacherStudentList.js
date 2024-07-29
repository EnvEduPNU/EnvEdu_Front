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
  Button,
} from "@mui/material";

const sample = [
  ["1", "홍길동", "부산중", "2024-07-16"],
  ["2", "김민우", "해운대중", "2024-06-16"],
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
    width: "20%",
  },
  {
    label: "소속",
    dataKey: "LectureData",
    width: "20%",
  },
  {
    label: "참여일",
    dataKey: "Status",
    width: "20%",
  },
  {
    label: "",
    dataKey: "Action",
    width: "20%",
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

function rowContent(index, row, handleClick, handleDelete, selectedRow) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{ width: column.width }}
          sx={{
            padding: "8px", // 패딩을 줄이기 위해 추가
            backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
            cursor: column.dataKey !== "Action" ? "pointer" : "default",
            "&:hover": {
              backgroundColor:
                column.dataKey !== "Action" ? "#e0e0e0" : "inherit",
            },
          }}
        >
          {column.dataKey === "Action" ? (
            <Button
              variant="outlined"
              color="secondary"
              style={{ width: column.width }}
              onClick={() => handleDelete(row.id)}
            >
              삭제
            </Button>
          ) : (
            <span
              onClick={() =>
                column.dataKey !== "Action" && handleClick(row.id, row)
              }
            >
              {row[column.dataKey]}
            </span>
          )}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function TeacherReportTable(props) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowData, setRowData] = useState(rows);

  const handleRowClick = (id, row) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    props.setCourseStep(row);
    console.log(row);
  };

  const handleDelete = (id) => {
    setRowData((prevRowData) => prevRowData.filter((row) => row.id !== id));
    console.log(`Row with id ${id} deleted`);
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
        {"[ 참여학생리스트 ]"}
      </Typography>
      <Paper
        style={{ height: "100%", width: "100%" }}
        className="virtuoso-table"
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={rowData}
          components={VirtuosoTableComponents}
          itemContent={(index, row) =>
            rowContent(index, row, handleRowClick, handleDelete, selectedRow)
          }
          style={{ height: 200 }}
        />
      </Paper>
      <button
        //   onClick={}
        style={{ margin: "10px 0 0 0", width: "30%" }}
      >
        학생추가
      </button>
    </div>
  );
}
