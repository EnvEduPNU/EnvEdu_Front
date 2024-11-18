import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { getAirByPlace, getPlaceByAddress } from '../apis/air';
import PlaceList from './PlaceList';
import AirPlaceList from './AirPlaceList';

function PlaceAir() {
  const [searchAddress, setSearchAddress] = useState('');
  const [placeList, setPlaceList] = useState([]);
  const [searchStationName, setSearchStationName] = useState('');
  const [searchData, setSearchDate] = useState({
    startYear: '년',
    startMonth: '월',
    endYear: '년',
    endMonth: '월',
    startDay: '일',
    endDay: '일',
  });
  const [airDataList, setAirDataList] = useState([]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#F5F5F5', // 연한 회색 배경색
          borderRadius: '0.2rem', // 모서리를 둥글게
          padding: '1rem 0px',
        }}
      >
        <span
          style={{
            fontSize: '1.2em',
            fontWeight: '600',
            color: '#333',
          }}
        >
          지역명 검색
        </span>
        <input
          type="text"
          placeholder="도로명 또는 동을 입력하세여. 예) 금정구"
          style={{
            width: '400px',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #CCCCCC',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#FF5722';
            e.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#CCCCCC';
            e.target.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.1)';
          }}
          onChange={(e) => {
            setSearchAddress(e.target.value);
          }}
        />

        <button
          onClick={async () => {
            const { data } = await getPlaceByAddress(searchAddress);
            console.log(data.response.body.items);
            setPlaceList(
              data.response.body.items.map((item) => ({
                addr: item.addr,
                stationName: item.stationName,
                dmX: item.dmX,
                dmY: item.dmY,
              })),
            );
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
          측정소 검색
        </button>
      </div>
      {placeList.length !== 0 && (
        <PlaceList
          places={placeList}
          searchStationName={searchStationName}
          setSearchStationName={setSearchStationName}
        />
      )}

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
                  startDay: e.target.value,
                }));
              }}
            >
              <option>일</option>
              {[...Array(31)].map((_, i) => (
                <option key={i} value={i + 1}>{`${i + 1}일`}</option>
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
                  endDay: e.target.value,
                }));
              }}
            >
              <option>일</option>
              {[...Array(31)].map((_, i) => (
                <option key={i} value={i + 1}>{`${i + 1}일`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 검색 버튼 */}
        <button
          onClick={async () => {
            if (searchStationName === '') {
              alert('측정 장소를 선택해주세요');
              return;
            }
            if (
              searchData.startYear === '년' ||
              searchData.startMonth === '월' ||
              searchData.startDay === '일' ||
              searchData.endYear === '년' ||
              searchData.endMonth === '월' ||
              searchData.endDay === '일'
            ) {
              alert('측정 날짜 범위를 선택해주세요.');
              return;
            }

            const { data } = await getAirByPlace(
              searchStationName,
              searchData.startYear,
              searchData.startMonth,
              searchData.startDay,
              searchData.endYear,
              searchData.endMonth,
              searchData.endDay,
            );
            if (data.response.header.resultMsg === '데이터베이스 에러') {
              setAirDataList([]);
              return;
            }
            console.log(data.response.body.items);
            if (data.response.body.items.length === 0) {
              setAirDataList([]);
              return;
            }

            const tempAirDataList = data.response.body.items.map((item) => ({
              stationName:
                item.msrstnName === null ? '측정 안됨' : item.msrstnName,
              date: item.msurDt === null ? '측정 안됨' : item.msurDt,
              no2: item.no2Value === null ? '측정 안됨' : item.no2Value, //이산화 질소
              o3: item.o3Value === null ? '측정 안됨' : item.o3Value,
              pm10: item.pm10Value === null ? '측정 안됨' : item.pm10Value,
              pm25: item.pm25Value === null ? '측정 안됨' : item.pm25Value,
              so2Value: item.so2Value === null ? '측정 안됨' : item.so2Value, //아황산
            }));
            console.log(tempAirDataList[0].stationName, searchStationName);

            setAirDataList(
              tempAirDataList.filter(
                (airData) => airData.stationName === searchStationName,
              ),
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

      <AirPlaceList airDataList={airDataList} />
    </div>
  );
}

export default PlaceAir;
