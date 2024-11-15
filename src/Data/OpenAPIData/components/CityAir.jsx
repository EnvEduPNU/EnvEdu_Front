import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import CityAirList from './CityAirList';
import { getAirByCity } from '../apis/air';
const measurements = ['SO2', 'CO', 'O3', 'NO2', 'PM10']; //PM2.5 에러로 빠짐
const averages = ['일평균', '시간평균'];
const periods = ['한달', '일주일'];

function CityAir() {
  const [selectedMeasurement, setSelectedMeasurement] = useState('SO2');
  const [selectedAverage, setSelectedAverage] = useState('일평균');
  const [selectedPeriod, setSelectedPeriod] = useState('한달');
  const [cityAirDataList, setCityAirDataList] = useState([]);

  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'end',
          margin: '10px 0px 30px 0px',
        }}
      >
        <div
          style={{
            marginRight: '90px',
          }}
        >
          {/* Title */}
          <h3
            style={{
              marginBottom: '20px',
              fontSize: '20px',
              color: '#2F4F4F',
              fontWeight: 'bold',
            }}
          >
            측정 항목 선택
          </h3>

          {/* Measurement Selection */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {measurements.map((measurement) => (
              <button
                key={measurement}
                onClick={() => setSelectedMeasurement(measurement)}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor:
                    selectedMeasurement === measurement ? '#3B82F6' : '#E5E7EB',
                  color:
                    selectedMeasurement === measurement ? '#FFFFFF' : '#374151',
                  fontSize: '16px',
                  fontWeight:
                    selectedMeasurement === measurement ? 'bold' : 'normal',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow:
                    selectedMeasurement === measurement
                      ? '0px 4px 12px rgba(59, 130, 246, 0.4)'
                      : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                  transition:
                    'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.backgroundColor =
                    selectedMeasurement === measurement ? '#2563EB' : '#D1D5DB';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor =
                    selectedMeasurement === measurement ? '#3B82F6' : '#E5E7EB';
                }}
              >
                {measurement}
              </button>
            ))}
          </div>
        </div>

        {/* Average Selection */}
        <div
          style={{
            marginRight: '20px',
          }}
        >
          <h3
            style={{
              marginBottom: '20px',
              fontSize: '20px',
              color: '#2F4F4F',
              fontWeight: 'bold',
            }}
          >
            평균 기준 선택
          </h3>
          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
          >
            {averages.map((average) => (
              <button
                key={average}
                onClick={() => setSelectedAverage(average)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor:
                    selectedAverage === average ? '#10B981' : '#F3F4F6',
                  color: selectedAverage === average ? '#FFFFFF' : '#374151',
                  fontSize: '15px',
                  fontWeight: selectedAverage === average ? 'bold' : 'normal',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow:
                    selectedAverage === average
                      ? '0px 4px 10px rgba(16, 185, 129, 0.3)'
                      : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                {average}
              </button>
            ))}
          </div>
        </div>

        {/* Period Selection */}
        <div
          style={{
            marginRight: '30px',
          }}
        >
          <h3
            style={{
              marginBottom: '20px',
              fontSize: '20px',
              color: '#2F4F4F',
              fontWeight: 'bold',
            }}
          >
            데이터 기간 선택
          </h3>
          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
          >
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor:
                    selectedPeriod === period ? '#F59E0B' : '#FDF2E9',
                  color: selectedPeriod === period ? '#FFFFFF' : '#874D0A',
                  fontSize: '15px',
                  fontWeight: selectedPeriod === period ? 'bold' : 'normal',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow:
                    selectedPeriod === period
                      ? '0px 4px 10px rgba(245, 158, 11, 0.3)'
                      : '0px 2px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        {/* 검색 버튼 */}
        <div>
          <button
            onClick={async () => {
              const { data } = await getAirByCity(
                selectedMeasurement,
                selectedAverage,
                selectedPeriod,
              );
              console.log(data.response.body.items);
              const tempAirDataList = data.response.body.items.map((item) => ({
                daegu: item.daegu,
                chungnam: item.chungnam,
                incheon: item.incheon,
                daejeon: item.daejeon,
                gyeongbuk: item.gyeongbuk,
                sejong: item.sejong,
                gwangju: item.gwangju,
                jeonbuk: item.jeonbuk,
                gangwon: item.gangwon,
                ulsan: item.ulsan,
                jeonnam: item.jeonnam,
                seoul: item.seoul,
                busan: item.busan,
                jeju: item.jeju,
                chungbuk: item.chungbuk,
                gyeongnam: item.gyeongnam,
                gyeonggi: item.gyeonggi,
                dataTime: item.dataTime,
                itemCode: item.itemCode,
              }));
              setCityAirDataList(tempAirDataList);
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
      <CityAirList cityAirDataList={cityAirDataList} />
    </div>
  );
}

export default CityAir;
