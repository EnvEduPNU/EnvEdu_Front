import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageIcon from '@mui/icons-material/Image'; // 이미지가 없을 때 사용할 기본 아이콘
import CloseIcon from '@mui/icons-material/Close'; // X 표시 아이콘 추가
import '../../classData/LectureCardCarousel.scss';
import { getEClassDatas, putEClassThumbnail } from '../api/eclass';
import basicImage from '../../../assets/img/basicImage.png';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { customAxios } from '../../../Common/CustomAxios';
import axios from 'axios';

function LectureCardCarousel({
  lectureSummary,
  getLectureDataTable,
  setClassDatas,
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [moreEditArr, setMoreEditArr] = useState(
    Array(lectureSummary.length).fill(0),
  );

  useEffect(() => {
    setMoreEditArr(Array(lectureSummary.length).fill(false));
  }, [lectureSummary]);

  const nextCard = () => {
    if (currentIndex < lectureSummary.length - 4) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleDeleteLecture = async (uuid, timestamp, index) => {
    // 삭제 확인 대화상자 표시
    const isConfirmed = window.confirm('정말로 이 E-Class를 삭제하시겠습니까?');

    if (!isConfirmed) {
      // 사용자가 삭제를 취소하면 함수 종료
      return;
    }

    try {
      const response = await customAxios.get(
        `/api/eclass/eclass-check?lectureDataUuid=${uuid}`,
      );

      if (response.data) {
        alert('E-Class 실행에서 사용중입니다!');
        return;
      } else {
        await customAxios.delete(
          `/api/steps/deleteLectureContent/${uuid}/${timestamp}`,
        );

        alert('E-Class가 성공적으로 삭제되었습니다.');
        window.location.reload();

        const response = await getEClassDatas();
        setClassDatas(
          response.data.map((item) => ({
            uuid: item.uuid,
            thumgimg: item.thumgimg,
            stepName: item.stepName,
            username: item.username,
            timestamp: item.timestamp,
          })),
        );

        setMoreEditArr((prev) => {
          const copiedMoreEditArr = [...prev];
          copiedMoreEditArr[index] = false;
          return copiedMoreEditArr;
        });
      }
    } catch (error) {
      console.error('Error checking lecture:', error);
      alert('E-Class 검증 중 오류가 발생했습니다.');
    }
  };

  // 이미지 파일 업로드 메서드
  const handleUpload = async (file, contentUuid) => {
    try {
      // Pre-signed URL을 가져오는 요청
      const response = await customAxios.get('/api/images/presigned-url', {
        params: { fileName: contentUuid },
      });

      const { preSignedUrl, imageUrl } = response.data;
      const contentType = file.type; // 파일의 MIME 타입을 사용

      //S3로 이미지 업로드
      await axios.put(preSignedUrl, file, {
        headers: {
          'Content-Type': contentType,
        },
      });
      console.log('이미지 업로드 성공');
      alert('이미지 업로드 성공');

      return imageUrl; // S3에 업로드된 이미지 URL 반환
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      throw error;
    }
  };

  const modifyThumbnail = async (e, uuid, timestamp, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await handleUpload(file, uuid);
      await putEClassThumbnail(uuid, timestamp, imageUrl);
      alert('성공적으로 썸네일이 수정되었습니다.');
      const response = await getEClassDatas();
      setClassDatas(
        response.data.map((item) => ({
          uuid: item.uuid,
          thumgimg: item.thumgimg,
          stepName: item.stepName,
          username: item.username,
          timestamp: item.timestamp,
        })),
      );
      setMoreEditArr((prev) => {
        const copiedMoreEditArr = [...prev];
        copiedMoreEditArr[index] = false;
        return copiedMoreEditArr;
      });
    }
  };
  console.log(lectureSummary);
  console.log(moreEditArr);

  return (
    <div className="carousel-container">
      {/* 카드 목록 */}

      <div className="carousel-cards">
        {/* 왼쪽 화살표 */}
        <IconButton
          onClick={prevCard}
          className="carousel-arrow left-arrow"
          disabled={currentIndex === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>
        {lectureSummary
          .slice(currentIndex, currentIndex + 4)
          .map((lecture, index) => {
            // 이미지가 있는지 확인

            return (
              <div key={index} className="lecture-card">
                <button
                  onClick={(e) => {
                    setMoreEditArr((prev) => {
                      const copiedMoreEditArr = [...prev];
                      copiedMoreEditArr[lecture.index] =
                        !copiedMoreEditArr[lecture.index];
                      return copiedMoreEditArr;
                    });
                    e.stopPropagation(); // 카드 클릭 이벤트가 트리거되지 않도록
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(128, 128, 128, 0.1)'; // 회색 반투명
                    e.target.style.transform = 'scale(1.05)'; // 확대 효과
                    e.target.style.borderRadius = '4px';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white'; // 기본 주황색
                    e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                  }}
                  style={{
                    backgroundColor: '#white', // 기본 배경색
                    color: 'black',
                    position: 'absolute',
                    top: '4px',
                    right: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    transition:
                      'transform 0.2s ease, background-color 0.2s ease', // 부드러운 애니메이션
                  }}
                  aria-label="delete"
                >
                  <AiOutlineEllipsis size="24" />
                </button>
                {moreEditArr[index] && (
                  <div
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      flexDirection: 'column',
                      top: '16px',
                      right: '20px',
                      gap: '8px', // 버튼 간격 추가
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: '#f5f5f5', // 연한 회색 배경
                        color: '#333', // 텍스트 색상
                        border: '1px solid #ccc', // 테두리
                        borderRadius: '4px', // 둥근 모서리
                        fontSize: '14px', // 텍스트 크기
                        cursor: 'pointer', // 포인터 모양
                        transition:
                          'background-color 0.2s ease, transform 0.2s ease', // 부드러운 애니메이션
                        padding: '0 2px',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e0e0e0'; // hover 시 배경색 변경
                        e.target.style.transform = 'scale(1.05)'; // hover 시 확대
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5'; // 기본 배경으로 복구
                        e.target.style.transform = 'scale(1)'; // 크기 복구
                      }}
                      onClick={() => {
                        handleDeleteLecture(
                          lecture.uuid,
                          lecture.timestamp,
                          lecture.index,
                        );
                      }}
                    >
                      삭제
                    </button>

                    <label
                      htmlFor="thumbImageUpload"
                      style={{
                        backgroundColor: '#f5f5f5', // 연한 회색 배경
                        color: '#333', // 텍스트 색상
                        border: '1px solid #ccc', // 테두리
                        borderRadius: '4px', // 둥근 모서리
                        fontSize: '14px', // 텍스트 크기
                        cursor: 'pointer', // 포인터 모양
                        transition:
                          'background-color 0.2s ease, transform 0.2s ease', // 부드러운 애니메이션
                        padding: '0 2px',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e0e0e0'; // hover 시 배경색 변경
                        e.target.style.transform = 'scale(1.05)'; // hover 시 확대
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5'; // 기본 배경으로 복구
                        e.target.style.transform = 'scale(1)'; // 크기 복구
                      }}
                    >
                      썸네일 수정
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="thumbImageUpload"
                      onChange={(e) => {
                        modifyThumbnail(
                          e,
                          lecture.uuid,
                          lecture.timestamp,
                          lecture.index,
                        );
                      }}
                    />
                    <button
                      style={{
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition:
                          'background-color 0.2s ease, transform 0.2s ease',
                        padding: '0 2px',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e0e0e0';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      EClass 복제
                    </button>
                  </div>
                )}
                <div
                  className="lecture-content"
                  onClick={() => getLectureDataTable(lecture.uuid)}
                >
                  {lecture.thumbImg ? (
                    <img
                      style={{
                        height: '160px',
                      }}
                      src={lecture.thumbImg}
                      alt={lecture.stepName}
                      className="lecture-image"
                    />
                  ) : (
                    <img
                      style={{
                        height: '160px',
                      }}
                      src={basicImage}
                      alt={lecture.stepName}
                      className="lecture-image"
                    />
                  )}
                  <h3>{lecture.stepName}</h3>
                  <p>{lecture.timestamp.split('T')[0]}</p>
                </div>
              </div>
            );
          })}
        {/* 오른쪽 화살표 */}
        <IconButton
          onClick={nextCard}
          className="carousel-arrow right-arrow"
          disabled={currentIndex >= lectureSummary.length - 4}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default LectureCardCarousel;
