import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import PlaceWaterDataList from './PlaceWaterDataList';
import WaterPlaceModal from '../modals/WaterPlaceModal';
import { getWaterByPlace } from '../apis/water';
import { locationsData } from './locationsData';

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
  console.log(waterlistData);

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
              setWaterlistData(
                filteredItemList.map((item) => ({
                  ptnm: item.PT_NM, //측정 장소
                  date: item.WMCYMD, // 년.월.일
                  wmwk: item.WMWK, //회차
                  wmdep: item.WMDEP === null ? '측정 안됨' : Number(item.WMDEP),
                  temp:
                    item.ITEM_TEMP === null
                      ? '측정 안됨'
                      : Number(item.ITEM_TEMP),
                  do:
                    item.ITEM_COD === null
                      ? '측정 안됨'
                      : Number(item.ITEM_COD),
                  bod:
                    item.ITEM_BOD === null
                      ? '측정 안됨'
                      : Number(item.ITEM_BOD),
                  cod:
                    item.ITEM_COD === null
                      ? '측정 안됨'
                      : Number(item.ITEM_COD),
                  ss:
                    item.ITEM_SS === null ? '측정 안됨' : Number(item.ITEM_SS),
                  tn:
                    item.ITEM_TN === null ? '측정 안됨' : Number(item.ITEM_TN),
                  tp:
                    item.ITEM_TP === null ? '측정 안됨' : Number(item.ITEM_TP),
                  toc:
                    item.ITEM_TOC === null
                      ? '측정 안됨'
                      : Number(item.ITEM_TOC),
                })),
              );
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
      <PlaceWaterDataList waterlistData={waterlistData} />
    </div>
  );
}

export default PlaceWater;
