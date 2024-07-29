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
  Button,
} from "@mui/material";
import { customAxios } from "../../../../../../Common/CustomAxios";

const columns = [
  {
    label: "번호",
    dataKey: "Num",
    width: "10%",
  },
  {
    label: "이름",
    dataKey: "Name",
    width: "15%",
  },
  {
    label: "강사",
    dataKey: "Teacher",
    width: "15%",
  },
  {
    label: "개설일",
    dataKey: "CreateEclassDate",
    width: "15%",
  },
  {
    label: "수업자료",
    dataKey: "LectureDataName",
    width: "15%",
  },
  {
    label: "상태",
    dataKey: "Status",
    width: "10%",
  },
  {
    label: "",
    dataKey: "Action",
    width: "20%",
  },
];

const createData = (index, item) => {
  if (typeof item !== "object" || item === null) {
    throw new TypeError("item must be an object");
  }

  return {
    Num: index + 1,
    eClassUuid: item.eClassUuid,
    Status: item.eclassAssginSubmitNum,
    LectureData: item.lectureDataUuid,
    LectureDataName: item.lectureDataName,
    Name: item.lectureName,
    CreateEclassDate: item.startDate,
    Teacher: item.username,
  };
};

const deleteData = async (row, handleDelete) => {
  // console.log("row는 : " + JSON.stringify(row, null, 2));

  // E-Class List에서 삭제
  await customAxios
    .delete(`/api/eclass/delete?eClassUuid=${row.eClassUuid}`)
    .then((response) => {
      console.log(response.data);
      handleDelete(row);
    })
    .catch((error) => {
      console.error("Eclass 리스트 삭제 에러:", error);
    });
};

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
            backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
            // cursor: column.dataKey !== "Action" ? "pointer" : "default",
            // "&:hover": {
            //   backgroundColor:
            //     column.dataKey !== "Action" ? "#e0e0e0" : "inherit",
            // },
          }}
        >
          {column.dataKey === "Action" ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleClick(row.id, row)}
                sx={{ marginRight: 1 }}
              >
                들어가기
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => deleteData(row, handleDelete)}
              >
                삭제
              </Button>
            </div>
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

export default function EClassTable(props) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowData, setRowData] = useState([]);

  const handleRowClick = (id, row) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
    props.setCourseStep(row);
    console.log(row);
  };

  const handleDelete = (row) => {
    // console.log("로우데이터 : " + JSON.stringify(row, null, 2));

    setRowData((prevRowData) =>
      prevRowData.filter((prevRow) => prevRow.Num !== row.Num)
    );
    console.log(`Row with id ${row.Num} deleted`);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".virtuoso-table")) {
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    //EClass 리스트 가져오기
    customAxios
      .get("/api/eclass/list")
      .then((response) => {
        const list = response.data;

        const rows = list.map((item, index) => createData(index, item));

        console.log("Eclass list :", rows);

        setRowData(rows);
      })
      .catch((error) => {
        console.error("Eclass 리스트 조회 에러:", error);
      });

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
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
          style={{ height: "580px" }}
        />
      </Paper>
    </div>
  );
}
