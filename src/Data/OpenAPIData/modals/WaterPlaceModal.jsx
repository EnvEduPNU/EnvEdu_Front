import React, { useState } from 'react';
import ReactModal from 'react-modal';
import WaterPlaceItem from '../components/WaterPlaceItem';

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: '100%',
    height: '100vh',
    zIndex: '10',
    position: 'fixed',
    top: '0',
    left: '0',
  },
  content: {
    width: '400px',
    height: '630px',
    zIndex: '150',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'white',
    padding: '20px',
    overflow: 'auto',
  },
};

function WaterPlaceModal({
  isOpen,
  setIsOpen,
  locations,
  setLocations,
  searchLocation,
  setSearchLocation,
}) {
  return (
    <ReactModal isOpen={isOpen} style={customModalStyles}>
      <div style={{}}>
        <h2
          style={{
            marginBottom: '0px',
            textAlign: 'center',
            fontSize: '1.5rem', // 글씨 크기 조정
            fontWeight: 'bold', // 글씨 두께 조정
            color: '#333333', // 글씨 색상
            borderBottom: '2px solid #4CAF50', // 하단 테두리 추가
            paddingBottom: '10px', // 하단 여백
            textTransform: 'uppercase', // 대문자로 변환
            letterSpacing: '1px', // 글자 간격 조정
            width: '160px',
          }}
        >
          측정 장소 검색
        </h2>
        <div
          style={{
            display: 'flex',
            height: '425px',
            flexDirection: 'column',
            justifyItems: 'start',
            alignItems: 'start',
            margin: '2rem 0',
            padding: '1rem 1rem',
            backgroundColor: 'rgba(135, 206, 250, 0.2)', // 배경색
            borderRadius: '20px',
            overflowY: 'auto', // 세로 스크롤 추가
          }}
        >
          {locations.map((location, index) => (
            <WaterPlaceItem
              location={location}
              key={location.name}
              setLocations={setLocations}
              locationIndex={index}
              searchLocation={searchLocation}
              setSearchLocation={setSearchLocation}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* 검색 관련 UI 요소 추가 가능 */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#FF5722',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              marginTop: 'auto',
              transition: 'background-color 0.3s',
              marginRight: '0.6rem',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#E64A19')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#FF5722')}
          >
            완료
          </button>

          {/* 검색 관련 UI 요소 추가 가능 */}
          <button
            onClick={() => {
              setIsOpen(false);

              setLocations((prev) => {
                const copiedLocation = prev.map((location) => ({
                  name: location.name,
                  subItems: location.subItems.map((subItem) => ({
                    ...subItem,
                    isChecked: false,
                  })),
                }));

                return copiedLocation;
              });
              setSearchLocation([]);
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#FF5722',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              marginTop: 'auto',
              transition: 'background-color 0.3s',
              marginLeft: '0.6rem',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#E64A19')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#FF5722')}
          >
            닫기
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

export default WaterPlaceModal;
