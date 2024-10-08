import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';

const LectureCard = ({ card, handleOpenModal }) => {
  return (
    <Card
      onClick={() => handleOpenModal(card)}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        height: '200px', // 카드의 높이를 줄임
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
          textAlign: 'center', // 텍스트 중앙 정렬
        }}
      >
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            style={{
              width: '100%',
              height: '120px', // 이미지 높이를 줄임
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
              height: '100px', // 이미지가 없을 때 아이콘 높이도 조절
              objectFit: 'cover',
              color: '#ccc',
              display: 'block',
              margin: 'auto',
              borderRadius: '8px',
            }}
          />
        )}
        <Typography variant="h6" sx={{ mt: 1 }}>
          {card.title}
        </Typography>
        <Typography variant="body2">{card.date}</Typography>
      </CardContent>
    </Card>
  );
};

export default LectureCard;
