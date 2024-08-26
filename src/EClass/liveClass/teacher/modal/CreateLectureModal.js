import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { customAxios } from "../../../../Common/CustomAxios";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const CreateLectureModal = ({ open, onClose, onCreate }) => {
  const [lectureName, setLectureName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [lectureDataUuid, setLectureDataUuid] = useState(null);
  const [lectureDataName, setLectureDataName] = useState(null);
  const [username, setUsername] = useState("");
  const [lectureSummary, setLectureSummary] = useState([]);
  const [eClassAssginSubmitNum, setEClassAssginSubmitNum] = useState(0);

  useEffect(() => {
    const TeacherName = localStorage.getItem("username");

    customAxios
      .get("/api/steps/getLectureContent")
      .then((res) => {
        const filteredData = res.data.filter(
          (data) => data.username === TeacherName
        );

        const formattedData = filteredData.map((data) => ({
          ...data,
          uuid: data.uuid,
          timestamp: data.timestamp,
          stepName: data.stepName,
          stepCount: data.stepCount,
          contents: data.contents.map((content) => ({
            stepNum: content.stepNum,
            contentName: content.contentName,
            contents: content.contents
              ? content.contents.map((c) => ({
                  type: c.type,
                  content: c.content,
                  x: c.x,
                  y: c.y,
                }))
              : [],
          })),
        }));

        setLectureSummary(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    const getSeoulTime = async () => {
      try {
        const response = await axios.get(
          "http://worldtimeapi.org/api/timezone/Asia/Seoul"
        );
        const seoulDate = new Date(response.data.datetime);
        const formattedDate = seoulDate.toISOString().split("T")[0];
        setStartDate(formattedDate);
      } catch (error) {
        console.error("There was an error fetching the Seoul time:", error);
      }
    };

    getSeoulTime();
  }, [open]);

  const handleCreate = () => {
    if (!lectureName) {
      alert("수업 이름을 입력해 주세요.");
      return;
    }
    if (!selectedMaterial) {
      alert("수업 자료를 선택해 주세요.");
      return;
    }

    const eClassUuids = uuidv4();

    const lectureData = {
      eClassUuid: eClassUuids,
      lectureDataUuid,
      lectureDataName,
      username,
      lectureName,
      startDate,
      eClassAssginSubmitNum,
    };

    console.log("body 확인 : " + JSON.stringify(lectureData, null, 2));

    customAxios
      .post("/api/eclass/create", lectureData)
      .then((response) => {
        console.log("Lecture created successfully:", response.data);
        onCreate(response.data);
        onClose();
      })
      .catch((error) => {
        console.error("There was an error creating the lecture:", error);
      });
  };

  const lectureSelection = (item) => {
    setSelectedMaterial(item);
    setLectureDataUuid(item.uuid);
    setLectureDataName(item.stepName);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, // 크기 키우기
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2, // 모서리 둥글게
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: "center",
            marginBottom: 3,
            fontWeight: "bold",
            fontSize: "2rem",
          }}
        >
          E-Class 생성하기
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h6" component="h3">
            {startDate}
          </Typography>
          <Typography variant="h6" component="h3">
            {username}
          </Typography>
        </div>
        <TextField
          label="E-Class 이름"
          value={lectureName}
          onChange={(e) => setLectureName(e.target.value)}
          fullWidth
          margin="normal"
          sx={{
            marginBottom: 3,
            ".MuiInputBase-root": {
              borderRadius: 2, // 입력 필드 모서리 둥글게
            },
          }}
        />

        <Typography
          variant="h6"
          component="h3"
          sx={{
            marginBottom: 2,
            fontWeight: "bold",
          }}
        >
          수업 자료 선택
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 300, marginBottom: 3 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>수업 자료 이름</TableCell>
                <TableCell align="center">선택</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lectureSummary
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{item.timestamp.split("T")[0]}</TableCell>
                    <TableCell>{item.stepName}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant={
                          selectedMaterial?.stepName === item.stepName
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => lectureSelection(item)}
                        sx={{ width: "60px" }}
                      >
                        선택
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ marginRight: 1 }}>
            취소
          </Button>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            생성하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateLectureModal;
