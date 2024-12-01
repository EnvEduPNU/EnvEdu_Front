import React, { useState, useEffect } from 'react';
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
  Divider,
} from '@mui/material';
import { customAxios } from '../../../../Common/CustomAxios';
import { v4 as uuidv4 } from 'uuid';

const CreateLectureModal = ({ open, onClose, onCreate, eClassUuid }) => {
  const [lectureName, setLectureName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [lectureDataUuid, setLectureDataUuid] = useState(null);
  const [lectureDataName, setLectureDataName] = useState(null);
  const [username, setUsername] = useState('');
  const [lectureSummary, setLectureSummary] = useState([]);
  const [eClassAssginSubmitNum, setEClassAssginSubmitNum] = useState(0);

  const [localEclassName, setLocalEclassName] = useState();

  const [localEclass, setLocalEclass] = useState();

  useEffect(() => {
    if (eClassUuid) {
      console.log('유유아이디 나오나 : ' + eClassUuid);

      const fetchEclass = async () => {
        try {
          // 해당 Eclass 가져오기
          const getResponse = await customAxios.get(
            `/api/eclass/get?eClassUuid=${eClassUuid}`,
          );
          console.log('Eclass fetched successfully:', getResponse.data);

          // 상태 업데이트
          setLocalEclass(getResponse.data);
          setLectureName(getResponse.data.lectureDataName);
        } catch (error) {
          console.error('There was an error fetching the Eclass:', error);
        }
      };

      // 비동기 함수 호출
      fetchEclass();
    }
  }, [eClassUuid]);

  const handleCreate = async () => {
    if (!lectureName) {
      alert('E-Class 실행 이름을 입력해 주세요.');
      return;
    }

    if (lectureName == localEclass.lectureDataName) {
      alert('E-Class 실행 이름을 바꿔 입력해주세요.');
      return;
    }

    try {
      // Lecture 생성에 필요한 데이터 생성
      const eClassUuids = uuidv4();
      const lectureData = {
        eClassUuid: eClassUuids,
        lectureDataUuid: localEclass.lectureDataUuid,
        lectureDataName: localEclass.lectureDataName,
        username: localEclass.username,
        lectureName: lectureName,
        startDate: localEclass.startDate,
        eClassAssginSubmitNum,
      };

      console.log('Body 확인 : ' + JSON.stringify(lectureData, null, 2));

      // Lecture 생성 요청
      const createResponse = await customAxios.post(
        '/api/eclass/create',
        lectureData,
      );
      console.log('Lecture created successfully:', createResponse.data);

      // 성공 시 후속 작업 수행
      onCreate(createResponse.data);
      onClose();
    } catch (error) {
      console.error('There was an error:', error);
    }
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
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 450,
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
          E-Class 실행 복제
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 3,
            alignItems: 'left',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginBottom: 2,
              fontWeight: 'bold',
            }}
          >
            {startDate}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              marginBottom: 2,
              fontWeight: 'bold',
            }}
          >
            {username}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
          }}
        >
          E-Class 실행 이름
        </Typography>
        <TextField
          value={lectureName}
          onChange={(e) => setLectureName(e.target.value)}
          fullWidth
          margin="normal"
          sx={{
            marginBottom: 3,
            '.MuiInputBase-root': {
              borderRadius: 2,
            },
          }}
        />

        <Box sx={{ marginBottom: ' 30px' }}>
          <Typography variant="h7">
            같은 Eclass로 다른 반을 생성할 수 있습니다.
          </Typography>
          <br />
          <Typography variant="h7">
            Eclass 실행하는 반 이름은 다르게 해주세요.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
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
