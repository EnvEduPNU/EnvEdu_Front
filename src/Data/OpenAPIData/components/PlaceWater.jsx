import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import PlaceWaterDataList from './PlaceWaterDataList';
import WaterPlaceModal from '../modals/WaterPlaceModal';
import { getWaterByPlace } from '../apis/water';

const locationsData = [
  {
    name: '서울특별시',
    subItems: [
      { name: '고성천', code: '2501A40', isChecked: false },
      { name: '사천천', code: '2501A30', isChecked: false },
      { name: '곤양천', code: '2501A20', isChecked: false },
    ],
  },
  {
    name: '부산광역시',
    subItems: [
      { name: '진전천', code: '2504A35', isChecked: false },
      { name: '산호천', code: '2504A27', isChecked: false },
      { name: '내동천', code: '2504A20', isChecked: false },
    ],
  },
  {
    name: '대구광역시',
    subItems: [
      { name: '보청천1', code: '3007A10', isChecked: false },
      { name: '우산', code: '3006A20', isChecked: false },
      { name: '옥천', code: '3006A10', isChecked: false },
    ],
  },
  {
    name: '인천광역시',
    subItems: [{ name: '덕현', code: '2201A03', isChecked: false }],
  },
  {
    name: '광주광역시',
    subItems: [
      { name: '품곡천', code: '3008A50', isChecked: false },
      { name: '대청댐', code: '3008A40', isChecked: false },
      { name: '주원천', code: '3008A30', isChecked: false },
    ],
  },
  {
    name: '대전광역시',
    subItems: [
      { name: '무주남대천2', code: '3003A20', isChecked: false },
      { name: '무주남대천1', code: '3003A10', isChecked: false },
      { name: '용포', code: '3002A50', isChecked: false },
    ],
  },
  {
    name: '울산광역시',
    subItems: [
      { name: '수영강5', code: '2302A20', isChecked: false },
      { name: '회동댐 상류', code: '2302A10', isChecked: false },
      { name: '회야강3', code: '2301A40', isChecked: false },
    ],
  },
  {
    name: '세종특별자치시',
    subItems: [
      { name: '수영강5', code: '2302A20', isChecked: false },
      { name: '회동댐 상류', code: '2302A10', isChecked: false },
      { name: '회야강2', code: '2301A30', isChecked: false },
    ],
  },
  {
    name: '경기도',
    subItems: [
      { name: '오산천2(경안A1-2)', code: '1016A37', isChecked: false },
      { name: '오산천1(경안A2-1)', code: '1016A35', isChecked: false },
      { name: '경안천4(경안A1-1)', code: '1016A32', isChecked: false },
    ],
  },
  {
    name: '강원도',
    subItems: [
      { name: '유치천1(탐진A2)', code: '5101A15', isChecked: false },
      { name: '탐진강1(탐진A1)', code: '5101A05', isChecked: false },
      { name: '악양(섬본E)', code: '4009A45', isChecked: false },
    ],
  },
  {
    name: '충청북도',
    subItems: [
      { name: '강상', code: '1007A75', isChecked: false },
      { name: '흑천3(흑천A)', code: '1007A70', isChecked: false },
      { name: '흑천1', code: '1007A65', isChecked: false },
    ],
  },
  {
    name: '전라북도',
    subItems: [
      { name: '내성천1', code: '2004A10', isChecked: false },
      { name: '예천2', code: '2003A60', isChecked: false },
      { name: '예천1', code: '2003A50', isChecked: false },
    ],
  },
  {
    name: '전라남도',
    subItems: [
      { name: '칠성천', code: '2101A70', isChecked: false },
      { name: '형산강5', code: '2101A60', isChecked: false },
      { name: '형산강4', code: '2101A50', isChecked: false },
    ],
  },
  {
    name: '경상북도',
    subItems: [
      { name: '금강천1(탐진B1)', code: '5101A45', isChecked: false },
      { name: '옴천천2(탐진A3)', code: '5101A25', isChecked: false },
    ],
  },
  {
    name: '경상남도',
    subItems: [
      { name: '순천동천3', code: '4104A50', isChecked: false },
      { name: '순천동천2', code: '4104A40', isChecked: false },
      { name: '순천동천1', code: '4104A30', isChecked: false },
    ],
  },
  {
    name: '제주특별자치도',
    subItems: [
      { name: '황구지천2(진위A8)', code: '1101A58', isChecked: false },
      { name: '황구지천1(진위A7)', code: '1101A57', isChecked: false },
      { name: '진위천4', code: '1101A55', isChecked: false },
    ],
  },
];

function PlaceWater() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchData, setSearchDate] = useState({
    startYear: '년',
    startMonth: '월',
    endYear: '년',
    endMonth: '월',
  });
  const [locations, setLocations] = useState(locationsData);
  const [searchLocation, setSearchLocation] = useState([]);
  const [waterlistData, setWaterlistData] = useState([]);

  return (
    <div>
      <WaterPlaceModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        locations={locations}
        setLocations={setLocations}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4rem',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {/* 시작 기간 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <label
              style={{
                fontWeight: '600',
                color: '#333',
                marginRight: '0.8rem',
              }}
            >
              시작 기간
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  border: '1px solid #ccc',
                }}
                onChange={(e) => {
                  setSearchDate((prev) => ({
                    ...prev,
                    startYear: e.target.value,
                  }));
                }}
              >
                <option>년</option>
                <option>2020</option>
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
                <option>2024</option>
              </select>
              <select
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  border: '1px solid #ccc',
                }}
                onChange={(e) => {
                  setSearchDate((prev) => ({
                    ...prev,
                    startMonth: e.target.value,
                  }));
                }}
              >
                <option>월</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>{`${i + 1}월`}</option>
                ))}
              </select>
            </div>
          </div>
          {/* 종료 기간 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <label
              style={{
                fontWeight: '600',
                color: '#333',
                marginRight: '0.8rem',
              }}
            >
              종료 기간
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  border: '1px solid #ccc',
                }}
                onChange={(e) => {
                  setSearchDate((prev) => ({
                    ...prev,
                    endYear: e.target.value,
                  }));
                }}
              >
                <option>년</option>
                <option>2020</option>
                <option>2021</option>
                <option>2022</option>
                <option>2023</option>
                <option>2024</option>
              </select>
              <select
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  border: '1px solid #ccc',
                }}
                onChange={(e) => {
                  setSearchDate((prev) => ({
                    ...prev,
                    endMonth: e.target.value,
                  }));
                }}
              >
                <option>월</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>{`${i + 1}월`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4CAF50', // 새로운 색상 (초록)
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              outline: 'none',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#66BB6A'; // 마우스 오버 시 밝은 초록색
              e.target.style.transform = 'scale(1.05)'; // 확대 효과
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#4CAF50'; // 기본 초록색
              e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
            }}
          >
            측정 장소 선택
          </button>

          {/* 검색 버튼 */}
          <button
            onClick={async () => {
              const { data } = await getWaterByPlace(
                searchLocation,
                searchData.startYear,
                searchData.startMonth,
                searchData.endYear,
                searchData.endMonth,
              );
              console.log(data.getWaterMeasuringList.item);

              //startYear, [01~startMonth-1]까지 데이터 + endYear, [endMonth+1 ~ 12] 까지 데이터 필터링

              const filteredItemList = data.getWaterMeasuringList.item.filter(
                (item) => {
                  const year = item.WMCYMD.split('.')[0];
                  const month = item.WMCYMD.split('.')[1];
                  if (
                    year === searchData.startYear &&
                    Number(month) < Number(searchData.startMonth)
                  )
                    return false;
                  else if (
                    year === searchData.endYear &&
                    Number(searchData.endMonth) < Number(month)
                  )
                    return false;
                  return true;
                },
              );
              console.log(filteredItemList);
              setWaterlistData(filteredItemList.map((item) => ({})));
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FF5722',
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              outline: 'none',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#FF7043';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#FF5722';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <AiOutlineSearch size={20} />
            검색
          </button>
        </div>
      </div>
      <PlaceWaterDataList />
    </div>
  );
}

export default PlaceWater;
