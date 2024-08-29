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
import { customAxios } from "../../../../../../Common/CustomAxios";
import ReportViewModal from "../../../modal/ReportViewModal";

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
    label: "상태",
    dataKey: "Status",
    width: "25%",
  },
  {
    label: "보고서",
    dataKey: "Action",
    width: "25%",
  },
];

function createData(index, Num, Name, Status, LectureData) {
  return { id: index, Num, Name, Status, LectureData };
}

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
  TableRow: ({ item: _item, ...props }) => (
    <TableRow
      {...props}
      sx={{
        height: "36px", // 각 행의 높이 설정
      }}
    />
  ),
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
              padding: "13px 8px", // 헤더 셀의 패딩 조정
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function rowContent(index, row, handleClick, selectedRow, handleOpenModal) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="center"
          style={{ width: column.width }}
          sx={{
            backgroundColor: selectedRow === row.id ? "#f0f0f0" : "inherit",
            padding: "6px 8px", // 데이터 셀의 패딩 조정
          }}
        >
          {column.dataKey === "Action" ? (
            <Button
              onClick={() => handleOpenModal(row.LectureData)}
              sx={{ width: "30%" }}
            >
              확인
            </Button>
          ) : (
            row[column.dataKey]
          )}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function TeacherReportTable({ selectedEClassUuid }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (id, row) => {
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === id ? null : id));
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".virtuoso-table")) {
      setSelectedRow(null);
    }
  };

  const handleOpenModal = async (lectureData) => {
    console.log("확인한번 : " + JSON.stringify(lectureData, null, 2));

    try {
      const response = await customAxios.get(
        `/api/report/getstep?uuid=${lectureData}`
      );

      setReportData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReportData(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(
          `/api/eclass/student/assignment/report/get/${selectedEClassUuid}`
        );
        const reportInfoMap = response.data;

        console.log(
          "레포트 데이터 : " + JSON.stringify(reportInfoMap, null, 2)
        );

        const newRows = Object.entries(reportInfoMap).map(
          ([reportData, username], index) => {
            const status = username && reportData ? "제출됨" : "미제출";
            return createData(
              index + 1,
              index + 1,
              username,
              status,
              reportData // LectureData로 저장 (액션 버튼에서 사용)
            );
          }
        );

        if (newRows.length === 0) {
          setRows([]);
        } else {
          setRows(newRows);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
        setRows([]);
      }
    };

    if (selectedEClassUuid) {
      fetchData();
    } else {
      setRows([]);
    }
  }, [selectedEClassUuid]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Typography
        variant="h5"
        sx={{
          margin: "20px 0 10px 0",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "600",
          fontSize: "1.5rem",
        }}
      >
        {" 보고서 제출 "}
      </Typography>
      <Paper style={{ height: 200, width: "100%" }} className="virtuoso-table">
        <TableContainer component={Paper}>
          <Table stickyHeader>{fixedHeaderContent()}</Table>
        </TableContainer>
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          itemContent={(index, row) =>
            rowContent(index, row, handleRowClick, selectedRow, handleOpenModal)
          }
        />
      </Paper>

      {isModalOpen && (
        <ReportViewModal
          open={isModalOpen}
          onClose={handleCloseModal}
          tableData={reportData}
        />
      )}
    </div>
  );
}
