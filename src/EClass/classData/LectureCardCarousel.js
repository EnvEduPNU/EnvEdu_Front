import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageIcon from '@mui/icons-material/Image'; // 이미지가 없을 때 사용할 기본 아이콘
import CloseIcon from '@mui/icons-material/Close'; // X 표시 아이콘 추가
import './LectureCardCarousel.scss';

function LectureCardCarousel({
  lectureSummary,
  getLectureDataTable,
  handleDeleteLecture,
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // timestamp를 기준으로 최신순으로 lectureSummary를 정렬
  const sortedLectureSummary = [...lectureSummary].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  const nextCard = () => {
    if (currentIndex < sortedLectureSummary.length - 4) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

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
        {sortedLectureSummary
          .slice(currentIndex, currentIndex + 4)
          .map((lecture, index) => {
            // 이미지가 있는지 확인
            const imgContent = lecture.contents
              .flatMap((content) => content.contents) // 중첩된 contents 배열 탐색
              .find((innerContent) => innerContent.type === 'img');

            return (
              <div key={index} className="lecture-card">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 이벤트가 트리거되지 않도록
                    handleDeleteLecture(index, lecture.uuid, lecture.timestamp);
                  }}
                  className="delete-icon"
                  aria-label="delete"
                  sx={{
                    color: 'gray',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                  }} // X 아이콘을 상단 오른쪽에 고정
                >
                  <CloseIcon />
                </IconButton>
                <div
                  className="lecture-content"
                  onClick={() =>
                    getLectureDataTable(
                      lecture.stepName,
                      lecture.stepCount,
                      lecture.contents,
                      lecture.uuid,
                      lecture.timestamp,
                    )
                  }
                >
                  {imgContent ? (
                    <img
                      src={imgContent.content}
                      alt={lecture.stepName}
                      className="lecture-image"
                    />
                  ) : (
                    <ImageIcon
                      style={{
                        fontSize: 180, // 이미지와 비슷한 크기 설정
                        width: '100%', // 이미지와 동일한 너비 설정
                        height: '200px', // 실제 이미지 크기와 동일하게 설정
                        objectFit: 'cover', // 이미지 비율 유지
                        color: '#ccc',
                        display: 'block',
                        margin: 'auto',
                        border: '0px solid #ddd',
                        borderRadius: '8px', // 이미지와 일관된 둥근 모서리
                      }}
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
          disabled={currentIndex >= sortedLectureSummary.length - 4}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default LectureCardCarousel;
