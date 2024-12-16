import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { customAxios } from '../../../../Common/CustomAxios';
import { v4 as uuidv4 } from 'uuid';

const CreateLectureModal = ({ open, onClose, onCreate }) => {
  const [startDate, setStartDate] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [lectureDataUuid, setLectureDataUuid] = useState(null);
  const [lectureDataName, setLectureDataName] = useState(null);
  const [username, setUsername] = useState('');
  const [lectureSummary, setLectureSummary] = useState([]);
  const [eClassAssginSubmitNum, setEClassAssginSubmitNum] = useState(0);

  useEffect(() => {
    const TeacherName = localStorage.getItem('username');

    customAxios
      .get('/api/steps/getLectureContent')
      .then((res) => {
        const filteredData = res.data.filter(
          (data) => data.username === TeacherName,
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
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);

    // 현재 로컬 시간 기준으로 날짜를 가져옴
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    setStartDate(formattedDate);
  }, [open]);

  const handleCreate = () => {
    if (!selectedMaterial) {
      alert('E-Class를 선택해 주세요.');
      return;
    }

    const eClassUuids = uuidv4();

    const lectureData = {
      eClassUuid: eClassUuids,
      lectureDataUuid,
      lectureDataName,
      username,
      lectureName: lectureDataName, // 선택된 항목의 이름을 설정
      startDate,
      eClassAssginSubmitNum,
    };

    console.log('body 확인 : ' + JSON.stringify(lectureData, null, 2));

    customAxios
      .post('/api/eclass/create', lectureData)
      .then((response) => {
        console.log('Lecture created successfully:', response.data);
        onCreate(response.data);
        onClose();
      })
      .catch((error) => {
        console.error('There was an error creating the lecture:', error);
      });
  };

  const lectureSelection = (item) => {
    setSelectedMaterial(item);
    setLectureDataUuid(item.uuid);
    setLectureDataName(item.stepName); // 선택된 항목의 이름을 lectureDataName에 저장
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            marginBottom: 6,
            fontWeight: 'bold',
            fontSize: '2rem',
          }}
        >
          E-Class 실행 생성
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          sx={{
            marginTop: 2,
            marginBottom: 2,
            fontWeight: 'bold',
          }}
        >
          E-Class 선택
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 300, marginBottom: 3 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'lightgray' }}>
                  날짜
                </TableCell>
                <TableCell sx={{ backgroundColor: 'lightgray' }}>
                  E-Class 실행 이름
                </TableCell>
                <TableCell sx={{ backgroundColor: 'lightgray' }} align="center">
                  선택
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lectureSummary
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{item.timestamp.split('T')[0]}</TableCell>
                    <TableCell>{item.stepName}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant={
                          selectedMaterial?.stepName === item.stepName
                            ? 'contained'
                            : 'outlined'
                        }
                        color="secondary"
                        onClick={() => lectureSelection(item)}
                        sx={{
                          width: '60px',
                          fontFamily: "'Asap', sans-serif",
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          color:
                            selectedMaterial?.stepName === item.stepName
                              ? 'white'
                              : 'black',
                          backgroundColor:
                            selectedMaterial?.stepName === item.stepName
                              ? '#D1C4E9'
                              : 'transparent',
                          borderRadius: '2.469rem',
                          border: 'none',
                        }}
                      >
                        선택
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={onClose}
            sx={{
              marginRight: 1,
              fontFamily: "'Asap', sans-serif",
              fontWeight: '600',
              fontSize: '0.9rem',
              color: 'grey',
              backgroundColor: '#feecfe',
              borderRadius: '2.469rem',
              border: 'none',
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreate}
            sx={{
              marginRight: 1,
              fontFamily: "'Asap', sans-serif",
              fontWeight: '600',
              fontSize: '0.9rem',
              color: 'grey',
              backgroundColor: '#feecfe',
              borderRadius: '2.469rem',
              border: 'none',
            }}
          >
            실행 생성하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateLectureModal;
