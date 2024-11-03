import React, { useState, useEffect } from 'react';
import LectureFilter from './LectureFilter';
import LectureCard from './LectureCard';
import { Box, Button, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const MyLectureList = ({ cards, handleOpenModal }) => {
  const [filteredCards, setFilteredCards] = useState(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDataType, setSelectedDataType] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setFilteredCards(cards);
  }, [cards]);

  const applyFilter = () => {
    let filtered = cards;

    if (selectedDataType && selectedDataType !== 'All') {
      filtered = filtered.filter(
        (card) => card.dataTypeLabel === selectedDataType,
      );
    }

    if (selectedGrade && selectedGrade !== 'All') {
      filtered = filtered.filter((card) => card.gradeLabel === selectedGrade);
    }

    // 주제 필터 (입력한 텍스트가 포함된 카드 필터링)
    if (selectedSubject) {
      filtered = filtered.filter((card) => {
        const subjectTitle = card.title.toLowerCase();
        const searchTerm = selectedSubject.toLowerCase();
        return subjectTitle.includes(searchTerm); // 영어 및 한국어 필터링
      });
    }

    setFilteredCards(filtered);
    setCurrentIndex(0);
  };

  const resetFilter = () => {
    setSelectedDataType('All');
    setSelectedGrade('All');
    setSelectedSubject('');
    setFilteredCards(cards);
  };

  const nextCard = () => {
    if (currentIndex < filteredCards.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Button
          variant="contained"
          onClick={() => setShowFilter(!showFilter)}
          sx={{
            margin: '0 0 20px 30px',
            backgroundColor: 'lightgray',
            color: 'black',
          }}
        >
          필터
        </Button>
        {showFilter && (
          <LectureFilter
            dataTypeOptions={Array.from(
              new Set(cards.map((card) => card.dataTypeLabel)),
            )}
            gradeOptions={Array.from(
              new Set(cards.map((card) => card.gradeLabel)),
            )}
            selectedDataType={selectedDataType}
            selectedGrade={selectedGrade}
            selectedSubject={selectedSubject}
            setSelectedDataType={setSelectedDataType}
            setSelectedGrade={setSelectedGrade}
            setSelectedSubject={setSelectedSubject}
            applyFilter={applyFilter}
            resetFilter={resetFilter}
            setShowFilter={setShowFilter}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={prevCard} disabled={currentIndex === 0}>
          <ArrowBackIosIcon />
        </IconButton>

        <Box sx={{ display: 'flex', overflow: 'hidden', width: '100%' }}>
          {filteredCards
            .slice(currentIndex, currentIndex + 3)
            .map((card, index) => (
              <Box
                key={index}
                sx={{ flex: '0 0 33.33%', marginRight: '10px' }}
                onClick={() => handleOpenModal(card)}
              >
                <LectureCard card={card} />
              </Box>
            ))}
        </Box>

        <IconButton
          onClick={nextCard}
          disabled={currentIndex >= filteredCards.length - 3}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MyLectureList;
