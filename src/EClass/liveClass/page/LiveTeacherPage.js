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
  const [stepCount, setStepCount] = useState();
  const [sessionIds, setSessionIds] = useState([]);
  const [assginmentShareCheck, setAssginmentShareCheck] = useState([]);
  const [showAssignmentTable, setShowAssignmentTable] = useState(true); // 상태 추가

  const { eClassUuid } = useParams();
  const location = useLocation();
  const { lectureDataUuid, eClassName } = location.state || {};

  const navigate = useNavigate();

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
      <StudentWebSocket
        setSessionIds={setSessionIds}
        setAssginmentShareCheck={setAssginmentShareCheck}
      />

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
        {!sharedScreenState ? (
          <>
            <button onClick={() => handleScreenShare(true)} style={buttonStyle}>
              화면 공유
            </button>
            <TeacherStepShareButton
              stepCount={stepCount}
              lectureDataUuid={lectureDataUuid}
              sharedScreenState={sharedScreenState}
              assginmentShareCheck={assginmentShareCheck}
              setAssginmentShareCheck={setAssginmentShareCheck}
            />
          </>
        ) : (
          <button
            onClick={() => handleScreenShare(false)}
            style={{ ...buttonStyle, marginLeft: '10px' }}
          >
            공유 중지
          </button>
        )}
      </div>

      {/* [오른쪽 블럭] 수업 Step 테이블, 수업 상태 테이블 */}
      <div style={{ width: '30%', marginRight: '30px', height: '100%' }}>
        {showAssignmentTable ? (
          <TeacherAssignmentTable
            setCourseStep={setCourseStep}
            setTableData={setTableData}
            lectureDataUuid={lectureDataUuid}
            setStepCount={setStepCount}
            setAssginmentShareCheck={setAssginmentShareCheck}
          />
        ) : (
          <TeacherCourseStatusTable
            stepCount={stepCount}
            eclassUuid={eClassUuid}
            sessionIds={sessionIds}
            assginmentShareCheck={assginmentShareCheck}
          />
        )}

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
