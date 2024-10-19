import TeacherWordProcessor from '../teacher/component/TeacherWordProcessor';
import TeacherStepper from '../teacher/component/TeacherStepper';
import { useState, useEffect } from 'react';
import { useCreateLectureSourceStore } from '../store/CreateLectureSourceStore';
import { customAxios } from '../../../Common/CustomAxios';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 함수
import moment from 'moment'; // 날짜 처리 라이브러리
import axios from 'axios';
import { Typography, TextField, Button } from '@mui/material';
import './CreateLectureSourcePage.scss'; // 스타일을 위한 SCSS 파일 임포트

export const CreateLectureSourcePage = (props) => {
  const {
    stepCount: initialStepCount,
    stepContents,
    summary,
    lectureName: initialLectureName,
    lectureSummary,
    lectureUuid,
    timeStamp,
  } = props;

  const [activeStep, setActiveStep] = useState(1);
  const [stepCount, setStepCount] = useState(initialStepCount); // stepCount 상태 관리
  const [lectureName, setLectureName] = useState(initialLectureName || '');
  const [stepperStepName, setStepperStepName] = useState(stepContents || []);
  const [isEditingLectureName, setIsEditingLectureName] = useState(false); // 수정 모드 상태
  const { contents } = useCreateLectureSourceStore();
  const [stepAlert, setStepAlert] = useState(false);

  // const { contents, clearContents, setContents, updateContent } =
  //   useCreateLectureSourceStore();

  // props.lectureName이 변경될 때마다 lectureName 상태를 업데이트
  useEffect(() => {
    // console.log(
    //   "넘어오는 데이터 확인 : " + JSON.stringify(stepContents, null, 2)
    // );

    if (initialLectureName !== undefined) {
      setLectureName(initialLectureName);
    }
  }, [initialLectureName]);

  useEffect(() => {
    console.log(
      '전체 스텝 카운트 확인 : ' + JSON.stringify(stepCount, null, 2),
    );
  }, [stepCount]);

  const handleLectureNameChange = (event) => {
    setLectureName(event.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditingLectureName(true); // 더블 클릭 시 수정 모드 활성화
  };

  const handleBlur = () => {
    setIsEditingLectureName(false); // 포커스가 나가면 수정 모드 비활성화
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setIsEditingLectureName(false); // Enter 키를 누르면 수정 완료
    }
  };

  // 이미지 파일 업로드 메서드
  const handleUpload = async (image, contentUuid) => {
    try {
      const response = await customAxios.get('/api/images/presigned-url', {
        params: { fileName: contentUuid },
      });

      console.log('URL 확인 : ' + JSON.stringify(response.data, null, 2));
      const { preSignedUrl, imageUrl } = response.data;

      const contentType = 'image/jpg';

      console.log('이미지 확인 : ' + image.name);

      await axios.put(preSignedUrl, image, {
        headers: {
          'Content-Type': contentType,
        },
      });

      console.log('이미지 업로드 성공');
      return imageUrl;
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      throw error;
    }
  };

  // 다음 스텝 넘어가는 메서드
  const handleNextStep = async () => {
    const contentUuid = uuidv4();

    if (activeStep <= stepCount) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      try {
        if (stepperStepName) {
          const imageUrlArray = [];

          for (const content of contents) {
            console.log(
              '컨텐츠 안에 들어 있는것 : ' + JSON.stringify(content, null, 2),
            );

            for (let index = content.contents.length - 1; index >= 0; index--) {
              const item = content.contents[index];
              let imageUrl = null;
              let imageX = null;
              let imageY = null;

              if (item.type === 'file') {
                const image = item.content;

                console.log('이미지 name : ' + image.name);

                try {
                  imageUrl = await handleUpload(image, contentUuid);
                  console.log(
                    '이미지 imageUrl : ' + JSON.stringify(imageUrl, null, 2),
                  );

                  imageX = item.x;
                  imageY = item.y;

                  console.log('이미지 x,y 체크 : ' + imageX + ' 과 ' + imageY);

                  imageUrlArray.push({ imageUrl, imageX, imageY });

                  content.contents.splice(index, 1);
                } catch (error) {
                  console.error('Image upload failed for:', image, error);
                }
              }
            }
          }

          // setContents(stepperStepName);

          console.log(
            'Collected Image URLs:',
            JSON.stringify(imageUrlArray, null, 2),
          );

          let changedPayload;
          let payload;

          const teacherName = localStorage.getItem('username');

          if (lectureSummary) {
            console.log(
              'lectureUuid 체크 : ' + JSON.stringify(lectureUuid, null, 2),
            );
            console.log(
              'timestamp 체크 : ' + JSON.stringify(timeStamp, null, 2),
            );
            console.log(
              'stepContents 체크 : ' + JSON.stringify(stepCount, null, 2),
            );

            const deletedImageUrls = contents.flatMap((content) =>
              content.contents
                .filter((item) => item.type === 'deleteImage')
                .map((item) => item.url),
            );

            console.log(
              '삭제 할 url : ' + JSON.stringify(deletedImageUrls, null, 2),
            );

            changedPayload = {
              uuid: contentUuid,
              username: teacherName,
              timestamp: moment()
                .tz('Asia/Seoul')
                .format('YYYY-MM-DDTHH:mm:ssZ'),
              stepName: lectureName + '_copy',
              stepCount: stepCount - 1,
              contents: contents.map((content) => ({
                stepNum: content.stepNum,
                contentName: content.contentName,
                contents: content.contents
                  .filter(
                    (c) =>
                      !(
                        (c.type === 'img' &&
                          deletedImageUrls.includes(c.content)) ||
                        (c.type === 'img' &&
                          (c.content === null || c.content === undefined)) ||
                        (c.type === 'html' && c.content.includes('<p><img')) ||
                        c.type === 'deleteImage'
                      ),
                  )
                  .map((c, index) => ({
                    type: c.type,
                    content: c.content,
                    x: c.type === 'img' ? c.x : null,
                    y: c.type === 'img' ? c.y : null,
                  })),
              })),
            };

            console.log(
              '이미지 어레이 확인 : ' + JSON.stringify(imageUrlArray, null, 2),
            );

            if (imageUrlArray && imageUrlArray.length > 0) {
              imageUrlArray.forEach((image, index) => {
                changedPayload.contents.forEach((content) => {
                  content.contents.push({
                    type: 'img',
                    content: image.imageUrl,
                    x: image.imageX,
                    y: image.imageY,
                  });
                });
              });
            }
          } else {
            console.log('컨텐츠 : ', JSON.stringify(contents, null, 2));

            payload = {
              uuid: contentUuid,
              username: teacherName,
              timestamp: moment()
                .tz('Asia/Seoul')
                .format('YYYY-MM-DDTHH:mm:ssZ'),
              stepName: lectureName,
              stepCount: stepCount - 1,
              contents: contents.map((content) => ({
                stepNum: content.stepNum,
                contentName: content.contentName,
                contents: content.contents
                  .filter(
                    (c) =>
                      !(c.type === 'html' && c.content.includes('<p><img')),
                  )
                  .map((c, index) => ({
                    type: c.type,
                    content:
                      c.type === 'img'
                        ? imageUrlArray[index - 1]?.imageUrl
                        : c.content,
                    x:
                      c.type === 'img'
                        ? imageUrlArray[index - 1]?.imageX
                        : null,
                    y:
                      c.type === 'img'
                        ? imageUrlArray[index - 1]?.imageY
                        : null,
                  })),
              })),
            };
          }

          if (lectureSummary) {
            console.log(
              '복사본 저장 요청 : ' + JSON.stringify(changedPayload, null, 2),
            );

            // confirm을 사용하여 사용자에게 확인을 요청
            if (window.confirm('복사본을 저장하시겠습니까?')) {
              try {
                await customAxios.post(
                  '/api/steps/saveLectureContent',
                  changedPayload,
                );
                alert('복사본이 저장되었습니다.');
              } catch (error) {
                console.error('저장 요청 실패:', error);
                alert('저장 요청에 실패했습니다.');
              }
            } else {
              console.log('사용자가 저장을 취소했습니다.');
            }
          } else {
            console.log('처음 저장 : ' + JSON.stringify(payload, null, 2));

            if (window.confirm('저장하시겠습니까?')) {
              try {
                await customAxios.post(
                  '/api/steps/saveLectureContent',
                  payload,
                );
              } catch (error) {
                console.error('저장 요청 실패:', error);
                alert('저장 요청에 실패했습니다.');
              }
            } else {
              console.log('사용자가 저장을 취소했습니다.');
            }

            alert('저장 요청이 완료되었습니다.');
          }

          window.location.reload();
        }
      } catch (error) {
        console.error('저장 요청 실패:', error);
        alert('저장 요청에 실패했습니다.');
        window.location.reload();
      }
    }
  };

  // useEffect(() => {
  //   if (props.stepContents) {
  //     console.log(
  //       "넘어와서 컨텐츠 확인 : " + JSON.stringify(props.stepContents, null, 2)
  //     );

  //     setContents(props.stepContents);
  //   }

  //   return () => {
  //     clearContents();
  //   };
  // }, [clearContents, setContents, props.stepContents]);

  const handleBackClick = () => {
    console.log('뒤로가기 버튼 클릭됨');
    window.location.reload();
  };

  return (
    <>
      {/* 전체 컨테이너에 flex 스타일 적용 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // 세로 가운데 정렬
          width: '72rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {isEditingLectureName ? (
            <TextField
              label="수업자료 이름"
              value={lectureName}
              onChange={handleLectureNameChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              style={{ margin: ' 0 20px 0 0', width: '55rem' }} // 넓이를 조정하여 가운데 정렬 및 사이즈 맞춤
              margin="normal"
              autoFocus
            />
          ) : (
            <Typography
              variant="h4"
              onDoubleClick={handleDoubleClick}
              style={{
                cursor: 'pointer',
                margin: ' 0 20px 0 0',
              }}
            >
              {lectureName || '더블클릭하여 수업 자료 이름을 입력하세요.'}
            </Typography>
          )}
          {/* 수업자료 버튼 */}
          <Button
            variant="outlined"
            onClick={handleBackClick}
            style={{
              fontWeight: '800',
              fontSize: '1rem',
              background: '#f3b634',
              padding: '0.5rem', // 단위 추가
              borderRadius: '0.3125rem',
              marginBottom: '0.5rem',
              width: '20%',
              height: '3.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              border: 'none',
              color: 'white', // 글자색 설정
            }}
          >
            돌아가기
          </Button>
        </div>
        <div>
          {/* Stepper */}
          <div
            style={{
              margin: '20px 0', // 위아래 여백
              width: '100%', // TeacherWordProcessor와 맞추기 위한 넓이 조정
            }}
          >
            <TeacherStepper
              stepCount={stepCount} // stepCount를 TeacherStepper에 전달
              setStepCount={setStepCount} // stepCount를 업데이트할 수 있도록 함수 전달
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              contents={stepperStepName}
              stepperStepName={stepperStepName}
              setStepperStepName={setStepperStepName}
              lectureName={lectureName}
            />
          </div>

          {/* Word Processor */}
          <div style={{ width: '100%' }}>
            {/* Word Processor와 일치하는 넓이 */}
            <TeacherWordProcessor
              summary={summary}
              lectureName={lectureName}
              activeStep={activeStep}
              stepCount={stepCount} // 업데이트된 stepCount를 전달
              handleNextStep={handleNextStep}
              stepperStepName={stepperStepName}
              setStepperStepName={setStepperStepName}
              setActiveStep={setActiveStep}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateLectureSourcePage;
