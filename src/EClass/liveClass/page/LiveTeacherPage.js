import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Button } from '@mui/material';
import { customAxios } from '../../../Common/CustomAxios';
import TeacherAssignmentTable from '../teacher/component/table/myDataPageTable/TeacherAssignmentTable';
import TeacherCourseStatusTable from '../teacher/component/table/myDataPageTable/TeacherCourseStatusTable';
import { TeacherStepShareButton } from '../teacher/component/button/TeacherStepShareButton';
import TeacherRenderAssign from '../teacher/component/TeacherRenderAssign';
import TeacherScreenShareJitsi from '../teacher/component/screenShare/TeacherScreenShareJitsi';
import { StudentWebSocket } from '../teacher/component/screenShare/StudentWebSocket';
import { ScreenShareWebSocket } from '../teacher/component/screenShare/ScreenShareWebSocket';

export const LiveTeacherPage = () => {
  const [sharedScreenState, setSharedScreenState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [courseStep, setCourseStep] = useState();
  const [stepCount, setStepCount] = useState(0);
  const [assginShareFlag, setAssginShareFlag] = useState(false);

  const [sessionIds, setSessionIds] = useState([]);
  const [assginmentShareCheck, setAssginmentShareCheck] = useState([]);
  const [showAssignmentTable, setShowAssignmentTable] = useState(true); // 상태 추가
  const [assginmentShareStop, setAssginmentShareStop] = useState(false);

  const { eClassUuid } = useParams();
  const location = useLocation();
  const { lectureDataUuid, eClassName } = location.state || {};

  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      'assginmentShareCheck 바뀌면 확인 : ' +
        JSON.stringify(assginmentShareCheck, null, 2),
    );
  }, [assginmentShareCheck]);

  const closeEclass = async () => {
    await customAxios
      .patch(`/api/eclass/eclass-close?uuid=${eClassUuid}`)
      .then((response) => {
        console.log('Eclass closed :', response.data);
        alert('수업을 종료하였습니다!');
        navigate(-1);
      })
      .catch((error) => {
        console.error('Eclass 종료 에러:', error);
      });
  };

  const handleScreenShare = useCallback(
    (state) => {
      setSharedScreenState(state);
    },
    [sessionIds],
  );

  const toggleTableView = () => {
    setShowAssignmentTable((prev) => !prev); // 테이블 전환 상태 업데이트
  };

  const spinnerBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
    margin: '20px 10px 0 0',
    border: '1px solid grey',
    zIndex: 1000,
  };

  const buttonStyle = {
    margin: '10px 0',
    width: '18%',
    fontFamily: "'Asap', sans-serif",
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'grey',
    backgroundColor: '#feecfe',
    borderRadius: '2.469rem',
    border: 'none',
  };

  function DefaultPageComponent() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 520,
          margin: '10px 10px 0 0',
          border: '1px solid grey',
        }}
      >
        <Typography variant="h6">수업을 시작해주세요.</Typography>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', margin: '0 10vh', height: '800px' }}>
      <StudentWebSocket setSessionIds={setSessionIds} />

      <ScreenShareWebSocket
        sessionIds={sessionIds}
        sendMessage={handleScreenShare}
        sharedScreenState={sharedScreenState}
      />

      {/* [왼쪽 블럭] 화면 공유 블럭 */}
      <div style={{ display: 'inline-block', width: '60%', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ margin: '0 0 10px 0' }}>
            {eClassName}
          </Typography>

          <button
            onClick={closeEclass}
            style={{ ...buttonStyle, margin: '10px 20px 0 0' }}
          >
            수업 종료
          </button>
        </div>

        <div>
          {stepCount && !sharedScreenState ? (
            <TeacherRenderAssign data={tableData} />
          ) : (
            !sharedScreenState && <DefaultPageComponent />
          )}
        </div>

        {isLoading && (
          <Box sx={spinnerBoxStyle}>
            <CircularProgress />
          </Box>
        )}

        {sharedScreenState && (
          <TeacherScreenShareJitsi
            sharedScreenState={sharedScreenState}
            setSharedScreenState={setSharedScreenState}
            setIsLoading={setIsLoading}
            eClassName={eClassName}
          />
        )}

        {/* 버튼 렌더링 조건 */}
        {!sharedScreenState && (
          <>
            {/* 과제 공유 버튼 */}
            <TeacherStepShareButton
              stepCount={stepCount}
              lectureDataUuid={lectureDataUuid}
              sharedScreenState={sharedScreenState}
              setAssginmentShareCheck={setAssginmentShareCheck}
              setAssginmentShareStop={setAssginmentShareStop}
              setStepCount={setStepCount}
              sessionIds={sessionIds}
              setAssginShareFlag={setAssginShareFlag}
            />
          </>
        )}

        {/* 버튼 렌더링 조건 */}
        {/* {!sharedScreenState ? (
          <>
            {
              <Button
                variant="contained"
                onClick={() => handleScreenShare(true)}
                style={{
                  marginTop: '20px',
                  marginLeft: '20px',
                  width: '200px',
                  height: '30px',
                  fontFamily: "'Asap', sans-serif",
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: 'grey',
                  backgroundColor: '#feecfe',
                  borderRadius: '2.469rem',
                  border: 'none',
                }}
              >
                화면 공유
              </Button>
            }
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => handleScreenShare(false)}
            style={{
              marginTop: '10px',
              width: '200px',
              height: '30px',
              fontFamily: "'Asap', sans-serif",
              fontWeight: '600',
              fontSize: '0.9rem',
              color: 'grey',
              backgroundColor: '#feecfe',
              borderRadius: '2.469rem',
              border: 'none',
            }}
          >
            공유 중지
          </Button>
        )} */}
      </div>

      {/* [오른쪽 블럭] 수업 Step 테이블, 수업 상태 테이블 */}
      <div style={{ width: '30%', marginRight: '30px', height: '100%' }}>
        <div>
          <div
            style={{
              display: showAssignmentTable ? 'block' : 'none', // showAssignmentTable에 따라 표시 여부 조절
            }}
          >
            <TeacherAssignmentTable
              setCourseStep={setCourseStep}
              setTableData={setTableData}
              lectureDataUuid={lectureDataUuid}
              setStepCount={setStepCount}
              setAssginmentShareCheck={setAssginmentShareCheck}
            />
          </div>
          <div
            style={{
              display: showAssignmentTable ? 'none' : 'block', // showAssignmentTable에 따라 표시 여부 조절
            }}
          >
            <TeacherCourseStatusTable
              stepCount={stepCount}
              eclassUuid={eClassUuid}
              sessionIds={sessionIds}
              assginmentShareCheck={assginmentShareCheck}
              assginmentShareStop={assginmentShareStop}
            />
          </div>
        </div>

        <Button
          variant="contained"
          onClick={toggleTableView}
          style={{
            marginTop: '20px',
            width: '30%',
            fontFamily: "'Asap', sans-serif",
            fontWeight: '600',
            fontSize: '0.9rem',
            color: 'grey',
            backgroundColor: '#feecfe',
            borderRadius: '2.469rem',
            border: 'none',
          }}
        >
          {showAssignmentTable ? '수업 상태 보기' : '과제 보기'}
        </Button>
      </div>
    </div>
  );
};
