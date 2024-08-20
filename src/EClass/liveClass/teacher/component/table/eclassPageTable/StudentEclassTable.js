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
import { useNavigate } from "react-router-dom";

const columns = [
  { label: "번호", dataKey: "Num", width: "10%" },
  { label: "이름", dataKey: "Name", width: "15%" },
  { label: "강사", dataKey: "Teacher", width: "15%" },
  { label: "개설일", dataKey: "CreateEclassDate", width: "15%" },
  { label: "수업자료", dataKey: "LectureDataName", width: "15%" },
  { label: "상태", dataKey: "Status", width: "10%" },
  { label: "", dataKey: "Action", width: "20%" },
];

const createData = (index, item) => ({
  Num: index + 1,
  eClassUuid: item.eClassUuid,
  Status: item.eclassAssginSubmitNum,
  LectureData: item.lectureDataUuid,
  LectureDataName: item.lectureDataName,
  Name: item.lectureName,
  CreateEclassDate: item.startDate,
  Teacher: item.username,
});

const deleteData = async (row, handleDelete) => {
  try {
    const response = await customAxios.delete(
      `/api/eclass/delete?eClassUuid=${row.eClassUuid}`
    );
    console.log("delete data" + response.data);
    handleDelete(row);
  } catch (error) {
    console.error("Eclass 리스트 삭제 에러:", error);
  }
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
            sx={{ backgroundColor: "#dcdcdc" }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function StudentEclassTable({ setSelectedEClassUuid }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    const StudentName = localStorage.getItem("username");
    let list = [];

    // 두 번째 요청: 전체 eclass 리스트 가져오기
    customAxios
      .get("/api/eclass/list")
      .then((response) => {
        list = response.data;
        console.log("Eclass list :", response.data);
      })
      .catch((error) => {
        console.error("Eclass 리스트 조회 에러:", error);
      });

    // 첫 번째 요청: 학생의 eClassUuid 리스트 가져오기
    customAxios
      .get(`/api/eclass/student/eclassUuids?studentName=${StudentName}`)
      .then((response) => {
        const uuidList = response.data;

        console.log("uuid 리스트 : " + JSON.stringify(uuidList, null, 2));

        // uuidList에 있는 eClassUuid와 일치하는 항목만 필터링
        const filteredList = list.filter((item) =>
          uuidList.includes(item.eClassUuid)
        );
        // 필터링된 항목들로 row 데이터 생성
        const rows = filteredList.map((item_1, index) =>
          createData(index, item_1)
        );
        setRowData(rows);
      })
      .catch((error) => {
        console.error("Eclass 리스트 조회 에러:", error);
      });

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleRowClick = (id, row) => {
    setSelectedRow(id);
    setSelectedEClassUuid(row.eClassUuid);
    console.log("Selected eClassUuid:", row.eClassUuid);
  };

  const handleDelete = (row) => {
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

  const joinEclass = (row, navigate) => {
    console.log(
      "Navigating to eClassPage with row:",
      JSON.stringify(row, null, 2)
    );

    const eClassUuid = row.eClassUuid;
    const lectureDataUuid = row.LectureData;
    let eClassStatus = false;

    // E-Class 조회해서 flag가 true인지 확인하기
    customAxios
      .get(`/api/eclass/status-check?uuid=${eClassUuid}`)
      .then((response) => {
        console.log("Eclass Status :", response.data);
        eClassStatus = response.data;

        if (eClassStatus) {
          navigate(`/LiveStudentPage/${eClassUuid}`, {
            state: {
              lectureDataUuid,
              row,
            },
          });
        } else {
          alert("수업 시작을 기다려주세요!");
        }
      })
      .catch((error) => {
        console.error("Eclass 수업 존재 체크 에러:", error);
      });
  };

  function rowContent(
    index,
    row,
    handleClick,
    handleDelete,
    selectedRow,
    navigate
  ) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align="center"
            style={{ width: column.width }}
            sx={{
              backgroundColor: selectedRow === row.Num ? "#f0f0f0" : "inherit",
              cursor: "pointer",
            }}
            onClick={() =>
              column.dataKey !== "Action" && handleClick(row.Num, row)
            }
          >
            {column.dataKey === "Action" ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => joinEclass(row, navigate)}
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
              <span>{row[column.dataKey]}</span>
            )}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }

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
            rowContent(
              index,
              row,
              handleRowClick,
              handleDelete,
              selectedRow,
              navigate
            )
          }
          style={{ height: "580px" }}
        />
      </Paper>
    </div>
  );
}
