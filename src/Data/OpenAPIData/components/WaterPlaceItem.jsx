import React, { useState } from 'react';
import { AiFillFolderAdd } from 'react-icons/ai';

function WaterPlaceItem({
  location,
  setLocations,
  locationIndex,
  searchLocation,
  setSearchLocation,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div style={{}}>
      {/* 드롭다운 버튼 */}
      <div
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <AiFillFolderAdd
          style={{ marginRight: '0px', fontSize: '1.2rem', color: '#4CAF50' }}
        />
        <button
          style={{
            padding: '5px 5px',
            backgroundColor: 'transparent', // 배경색 없애기
            color: 'black', // 글자 색상
            border: 'none', // 테두리 없애기
            borderRadius: '5px',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'color 0.3s, background-color 0.3s', // 배경색 변화 추가
            fontSize: '0.9rem', // 글자 크기 작게
            fontWeight: 'bold',
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#66BB6A'; // 글자 색상 변화
            e.target.style.backgroundColor = 'rgba(102, 187, 106, 0.2)'; // 배경색 변화
          }}
          onMouseOut={(e) => {
            e.target.style.color = 'black'; // 기본 글자 색상
            e.target.style.backgroundColor = 'transparent'; // 기본 배경색
          }}
        >
          {location.name}
        </button>
      </div>

      {/* 드롭다운 하위 아이템 */}
      {isDropdownOpen && (
        <div style={{ paddingLeft: '20px', marginTop: '1px' }}>
          {location.subItems.map((subLocation, subLocationIndex) => (
            <div
              key={subLocation.name}
              style={{
                display: 'flex', // 체크박스와 텍스트를 가로로 정렬
                alignItems: 'center', // 세로 중앙 정렬
                padding: '3px 8px',
                fontSize: '0.8rem', // 하위 아이템 글자 크기 작게
                color: '#4CAF50', // 원하는 색상으로 변경 (예: 초록색)
                fontWeight: 'bold', // 글자 굵게
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '4px', // 체크박스와 텍스트 간의 간격
                }}
                onChange={() => {
                  setLocations((prev) => {
                    const copiedLocation = prev.map((location) => ({
                      name: location.name,
                      subItems: [...location.subItems],
                    }));
                    copiedLocation[locationIndex].subItems[
                      subLocationIndex
                    ].isChecked =
                      !copiedLocation[locationIndex].subItems[subLocationIndex]
                        .isChecked;
                    if (
                      copiedLocation[locationIndex].subItems[subLocationIndex]
                        .isChecked === true
                    ) {
                      setSearchLocation((prev) => [...prev, subLocation.code]);
                    } else {
                      setSearchLocation((prev) => {
                        const copiedSearchLocation = [...prev];
                        return copiedSearchLocation.filter(
                          (value) => value !== subLocation.code,
                        );
                      });
                    }
                    return copiedLocation;
                  });
                }}
                checked={subLocation.isChecked}
              />
              <span
                style={{
                  lineHeight: '14px', // 줄 간격 설정
                }}
              >
                {subLocation.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WaterPlaceItem;
