import React, { useState, useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import './myData.scss';
import { CreateLectureSourcePage } from '../liveClass/page/CreateLectureSourcePage';
import LectureCardCarousel from './LectureCardCarousel';
import { Typography, CircularProgress, Box, Button } from '@mui/material';
import LectureList from './LectureList';

function ClassData() {
  const [summary, setSummary] = useState([]);
  const [lectureSummary, setLectureSummary] = useState([]);
  const [lectureUuid, setLectureUuid] = useState();
  const [timeStamp, setTimeStamp] = useState();
  const [showWordProcessor, setShowWordProcessor] = useState(false);
  const [showLectureList, setShowLectureList] = useState(false);
  const [stepName, setStepName] = useState(null);
  const [stepContents, setStepContents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [lectureName, setLectureName] = useState('');
  const [stepCount, setStepCount] = useState(0);
  const [stepCountLoad, setStepCountLoad] = useState();
  const [eClassType, setEClassType] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const TeacherName = localStorage.getItem('username');

    setIsLoading(true); // 로딩 시작
    customAxios
      .get('/api/steps/getLectureContent')
      .then((res) => {
        const filteredData = res.data.filter(
          (data) => data.username === TeacherName,
        );

        const formattedData = filteredData.map((data) => ({
          ...data,
          uuid: data.uuid,
          username: data.username,
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

        console.log('E-Class 들 : ' + JSON.stringify(formattedData, null, 2));

        setLectureSummary(formattedData);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false)); // 로딩 완료
  }, []);

  useEffect(() => {
    const username = localStorage.getItem('username');

    const fetchData = async () => {
      try {
        const myDataResponse = await customAxios.get('/mydata/list');
        const myDataFormatted = myDataResponse.data.map((data) => ({
          ...data,
          saveDate: data.saveDate.split('T')[0],
          dataLabel:
            data.dataLabel === 'AIRQUALITY'
              ? '대기질 데이터'
              : data.dataLabel === 'OCEANQUALITY'
              ? '수질 데이터'
              : data.dataLabel,
        }));

        const customDataResponse = await customAxios.get(
          `/api/custom/list?username=${username}`,
        );

        const customDataFormatted = customDataResponse.data.map((data) => ({
          ...data,
          saveDate: data.saveDate.split('T')[0],
          dataLabel:
            data.dataLabel === 'CUSTOM' ? '커스텀 데이터' : data.dataLabel,
          dynamicFields: data.dynamicFields || {},
        }));

        const combinedData = [...myDataFormatted, ...customDataFormatted];
        setSummary(combinedData);
      } catch (error) {
        console.error('데이터 가져오기 중 오류:', error);
      }
    };

    fetchData();
  }, []);

  const getLectureDataTable = (
    stepName,
    stepCount,
    contents,
    uuid,
    timestamp,
  ) => {
    setShowWordProcessor(false);
    setShowLectureList(true);
    setStepName(stepName);
    setStepCountLoad(stepCount);
    setStepContents(contents);
    setLectureUuid(uuid);
    setTimeStamp(timestamp);
  };

  const handleCreateLecture = () => {
    setOpenModal(true);
    setShowWordProcessor(true);
    setShowLectureList(true);
  };

  const handleDeleteLecture = async (index, uuid, timestamp) => {
    try {
      await customAxios.delete(
        `/api/steps/deleteLectureContent/${uuid}/${timestamp}`,
      );
      const updatedLectures = [...lectureSummary];
      updatedLectures.splice(index, 1);
      setLectureSummary(updatedLectures);
      setLectureUuid(uuid);
      alert('E-Class가 성공적으로 삭제되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting lecture:', error);
      alert('E-Class 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleMainPageClick = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // 배경을 블러 처리하는 느낌 추가
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <div style={{ filter: isLoading ? 'blur(4px)' : 'none' }}>
        <div>
          {!showLectureList && !stepName && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                margin: '20px 0',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  marginBottom: '3rem',
                  textAlign: 'center',
                }}
              >
                E-Class 생성
              </Typography>
              {lectureSummary.length > 0 ? (
                <>
                  <LectureCardCarousel
                    lectureSummary={lectureSummary}
                    getLectureDataTable={getLectureDataTable}
                    handleDeleteLecture={handleDeleteLecture}
                  />
                  <Button
                    sx={{
                      width: '86%',
                      marginTop: '20px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '16px',
                      color: 'black',
                      borderRadius: '0.625rem',
                      padding: '10px 20px',
                      backgroundColor: '#f3b634',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#d9a527', // hover 시 밝은 색상
                      },
                    }}
                    onClick={handleCreateLecture}
                  >
                    E-Class 만들기
                  </Button>
                </>
              ) : (
                <div
                  style={{
                    width: '30rem',
                    borderRadius: '0.625rem',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#f7f7f7',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                    E-Class를 생성해주세요.
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: '1.5rem' }}>
                    E-Class를 생성하면 이곳에 목록이 표시됩니다. 새 E-Class를
                    만들려면 아래 버튼을 클릭하세요.
                  </Typography>
                  <button
                    style={{
                      width: '100%',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '16px',
                      borderRadius: '0.625rem',
                      padding: '10px 20px',
                      backgroundColor: '#f3b634',
                      cursor: 'pointer',
                    }}
                    onClick={handleCreateLecture}
                  >
                    E-Class 만들기
                  </button>
                </div>
              )}
            </div>
          )}

          {showWordProcessor ? (
            <CreateLectureSourcePage
              summary={summary}
              lectureName={lectureName}
              stepCount={stepCount}
              eClassType={eClassType}
            />
          ) : (
            <>
              {stepName && (
                <CreateLectureSourcePage
                  summary={summary}
                  lectureSummary={lectureSummary}
                  lectureName={stepName}
                  stepCount={stepCountLoad}
                  stepContents={stepContents}
                  eClassType={eClassType}
                  lectureUuid={lectureUuid}
                  timeStamp={timeStamp}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassData;
