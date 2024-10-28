import React, { useState } from 'react';
import PlaceWater from './components/PlaceWater';
import PlaceAir from './components/PlaceAir';
import CityAir from './components/CityAir';

function OpenApi2() {
  const [selected, setSelected] = useState('측정소별 수질 정보'); // 선택 상태 저장

  const handleSelect = (option) => {
    setSelected(option); // 선택한 옵션으로 상태 업데이트
  };

  const buttonStyle = (option) => ({
    padding: '0.6rem 1.2rem',
    borderRadius: '0.75rem',
    fontWeight: '600',
    fontSize: '1rem',
    backgroundColor: selected === option ? '#1E90FF' : '#F0F4F8',
    color: selected === option ? '#FFFFFF' : '#4A5568',
    boxShadow:
      selected === option
        ? '0px 5px 15px rgba(30, 144, 255, 0.3)'
        : '0px 3px 8px rgba(0, 0, 0, 0.1)',
    transition:
      'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
    transform: selected === option ? 'scale(1.05)' : 'scale(1)',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
  });

  return (
    <div
      style={{
        minWidth: '1200px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          padding: '1rem 0',
        }}
      >
        <button
          onClick={() => handleSelect('측정소별 수질 정보')}
          style={buttonStyle('측정소별 수질 정보')}
        >
          측정소별 수질 정보
        </button>
        <button
          onClick={() => handleSelect('측정소별 대기질 정보')}
          style={buttonStyle('측정소별 대기질 정보')}
        >
          측정소별 대기질 정보
        </button>
        <button
          onClick={() => handleSelect('시도별 대기질 정보')}
          style={buttonStyle('시도별 대기질 정보')}
        >
          시도별 대기질 정보
        </button>
      </div>
      {selected === '측정소별 수질 정보' && <PlaceWater />}
      {selected === '측정소별 대기질 정보' && <PlaceAir />}
      {selected === '시도별 대기질 정보' && <CityAir />}
    </div>
  );
}

export default OpenApi2;
