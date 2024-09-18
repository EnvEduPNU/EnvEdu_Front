import React, { useState, useEffect, useRef } from "react";
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
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';

const columns = [
  { label: "번호", dataKey: "Num", width: "10%" },
  { label: "이름", dataKey: "Name", width: "15%" },
  { label: "강사", dataKey: "Teacher", width: "15%" },
  { label: "개설일", dataKey: "CreateEclassDate", width: "15%" },
  { label: "수업자료", dataKey: "LectureDataName", width: "15%" },
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
  const stompClientRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!stompClientRef.current) {
      const token = localStorage.getItem("access_token").replace("Bearer ", "");
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`
      );
      stompClientRef.current = new Client({ webSocketFactory: () => sock });

      stompClientRef.current.connect(
        {},
        () => {
          console.log("STOMP 연결 성공");
        },
        onError
      );
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log("STOMP 연결 해제");
        });
      }
    };

    function onError(error) {
      console.error("STOMP 연결 에러:", error);
      alert(
        "웹소켓 연결에 실패했습니다. 네트워크 설정을 확인하거나 관리자에게 문의하세요."
      );
    }
  }, []);

  // E-Class 조회 훅
  useEffect(() => {
    const fetchEclassData = async () => {
      try {
        const StudentName = localStorage.getItem("username");

        const eclassListResponse = await customAxios.get("/api/eclass/list");
        const eclassList = eclassListResponse.data;

        const studentEclassResponse = await customAxios.get(
          `/api/eclass/student/eclassUuids?studentName=${StudentName}`
        );
        const uuidList = studentEclassResponse.data;

        console.log("Eclass list :", eclassList);
        console.log("uuid 리스트 : " + JSON.stringify(uuidList, null, 2));

        const filteredList = eclassList.filter((item) =>
          uuidList.includes(item.eClassUuid)
        );

        const rows = await filteredList.map((item, index) =>
          createData(index, item)
        );

        setRowData(rows);
      } catch (error) {
        console.error("Eclass 리스트 조회 에러:", error);
      }
    };

    fetchEclassData();
  }, []);

  const handleRowClick = (id, row) => {
    setSelectedRow(id);
    setSelectedEClassUuid(row.eClassUuid);
    console.log("Selected eClassUuid:", row.eClassUuid);
  };

  const joinEclass = async (row) => {
    console.log(
      "[studentEclassTable] row 값 : " + JSON.stringify(row, null, 2)
    );

    // 수업이 교사에 의해서 열렸는지 닫혔는지 확인
    try {
      const response = await customAxios.get(
        `/api/eclass/status-check?uuid=${row.eClassUuid}`
      );
      const eClassStatus = response.data;

      if (eClassStatus) {
        console.log("[studentEclassTable] eclassUuid : " + row.eClassUuid);

        navigate(`/LiveStudentPage/${row.eClassUuid}`, {
          state: {
            lectureDataUuid: row.LectureData,
            row,
            eClassUuid: row.eClassUuid,
          },
        });
      } else {
        alert("수업 시작을 기다려주세요!");
      }
    } catch (error) {
      console.error("Eclass 수업 존재 체크 에러:", error);
    }
  };

  const rowContent = (index, row) => {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align="center"
            style={{ width: column.width }}
            sx={{
              backgroundColor: selectedRow === row.Num ? "#f0f0f0" : "inherit",
              cursor: column.dataKey !== "Action" ? "pointer" : "default",
            }}
            onClick={() =>
              column.dataKey !== "Action" && handleRowClick(row.Num, row)
            }
          >
            {column.dataKey === "Action" ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => joinEclass(row)}
                  sx={{
                    marginRight: 1,
                    fontFamily: "'Asap', sans-serif",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "grey",
                    backgroundColor: "#feecfe",
                    borderRadius: "2.469rem",
                    border: "none",
                  }}
                >
                  들어가기
                </Button>
              </div>
            ) : (
              <span>{row[column.dataKey]}</span>
            )}
          </TableCell>
        ))}
      </React.Fragment>
    );
  };

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
          itemContent={(index, row) => rowContent(index, row)}
          style={{ height: "580px" }}
        />
      </Paper>
    </div>
  );
}
