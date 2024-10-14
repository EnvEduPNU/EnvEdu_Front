import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';

const LectureCard = ({ card, handleOpenModal }) => {
  return (
    <Card
      onClick={() => handleOpenModal(card)}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        height: '300px', // 카드 높이를 약간 늘림
        overflow: 'hidden',
        display: 'flex', // 카드 전체를 flex 컨테이너로 설정
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          console.log('카드 삭제 기능 추가 필요'); // 카드 삭제 기능을 구현할 수 있습니다.
        }}
        sx={{
          color: 'gray',
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1, // X 버튼을 가장 상위에 유지
        }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '16px', // CardContent에 패딩을 추가하여 내부 요소 간 간격 유지
          boxSizing: 'border-box', // 패딩을 포함한 크기 계산
        }}
      >
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            style={{
              width: '100%',
              height: '180px', // 이미지 높이를 줄임
              objectFit: 'cover',
              borderRadius: '8px',
              border: 'none',
            }}
          />
        ) : (
          <ImageIcon
            style={{
              fontSize: 100, // 아이콘 크기 조절
              width: '100%',
              height: '150px', // 이미지가 없을 때 아이콘 높이도 조절
              objectFit: 'cover',
              color: '#ccc',
              display: 'block',
              margin: 'auto',
              borderRadius: '8px',
            }}
          />
        )}
        <Typography
          variant="h6"
          sx={{
            mt: 1,
            whiteSpace: 'nowrap', // 긴 텍스트를 한 줄로 유지
            overflow: 'hidden', // 넘치는 텍스트를 숨김
            textOverflow: 'ellipsis', // 말줄임 처리
            maxWidth: '100%', // 최대 너비 설정
          }}
        >
          {card.title}
        </Typography>
        <Typography variant="body2">{card.date}</Typography>

        {/* 태그를 표시하는 부분 */}
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            gap: 1, // 태그 사이의 간격
            overflowX: 'auto', // 수평 스크롤 활성화
            flexWrap: 'nowrap', // 줄 바꿈을 하지 않고 한 줄로 유지
            justifyContent: 'flex-start', // 태그를 왼쪽으로 정렬
            width: '100%', // 태그가 가득 차면 스크롤 발생
            paddingBottom: '8px', // 스크롤 영역에서 태그와의 간격을 위해 추가
            '&::-webkit-scrollbar': {
              height: '6px', // 스크롤바 높이 조절 (선택 사항)
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888', // 스크롤바 색상 (선택 사항)
              borderRadius: '8px', // 스크롤바 모서리 둥글게
            },
          }}
        >
          {/* 교과서 태그 */}
          <Chip
            label={card.dataTypeLabel}
            sx={{
              backgroundColor: '#FFCDD2', // 교과서 태그 색상
              color: '#B71C1C',
              flexShrink: 0, // 태그가 수평 스크롤시 줄어들지 않도록 설정
            }}
          />
          {/* 중등1 태그 */}
          <Chip
            label={card.gradeLabel}
            sx={{
              backgroundColor: '#C5E1A5', // 중등1 태그 색상
              color: '#33691E',
              flexShrink: 0, // 태그가 수평 스크롤시 줄어들지 않도록 설정
            }}
          />
          {/* 공통 태그 */}
          <Chip
            label={card.subjectLabel}
            sx={{
              backgroundColor: '#BBDEFB', // 공통 태그 색상
              color: '#0D47A1',
              flexShrink: 0, // 태그가 수평 스크롤시 줄어들지 않도록 설정
            }}
          />
          {/* 추가적으로 태그가 더 있을 경우 */}
          {/* 예: <Chip label="추가 태그" sx={{ ... }} /> */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LectureCard;
