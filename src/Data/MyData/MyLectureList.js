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

    if (selectedSubject) {
      filtered = filtered.filter((card) =>
        card.subjectLabel.toLowerCase().includes(selectedSubject.toLowerCase()),
      );
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
          sx={{ marginBottom: '20px' }}
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
