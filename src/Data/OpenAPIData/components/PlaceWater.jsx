import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import PlaceWaterDataList from './PlaceWaterDataList';
import WaterPlaceModal from '../modals/WaterPlaceModal';
import { getWaterByPlace } from '../apis/water';

const locationsData = [
  {
    name: '서울특별시',
    subItems: [
      { name: '초이천(한강H1)', code: '1025A57', isChecked: false },
      { name: '망월천(한강H2)', code: '1025A60', isChecked: false },
      { name: '감이천(한강H3)', code: '1018A02', isChecked: false },
    ],
  },
  {
    name: '부산광역시',
    subItems: [
      { name: '낙동강 하구언1(낙본M)', code: '2022A38', isChecked: false },
      { name: '낙동강 하구언2(낙본N)', code: '2022A80', isChecked: false },
      { name: '금곡(낙본L)', code: '2022A30', isChecked: false },
    ],
  },
  {
    name: '대구광역시',
    subItems: [
      { name: '하빈천(낙본G1)', code: '2011A53', isChecked: false },
      { name: '욱수천(금호C1)', code: '2012A35', isChecked: false },
      { name: '금호강4(금호B)', code: '2012A38', isChecked: false },
    ],
  },
  {
    name: '인천광역시',
    subItems: [
      { name: '굴포천2', code: '1019A35', isChecked: false },
      { name: '굴포천4(굴포A)', code: '1019A40', isChecked: false },
      { name: '선행천', code: '1201A10', isChecked: false },
    ],
  },
  {
    name: '광주광역시',
    subItems: [
      { name: '산동', code: '5001A27', isChecked: false },
      { name: '풍영정천2', code: '5001A30', isChecked: false },
      { name: '광주1', code: '5001A40', isChecked: false },
    ],
  },
  {
    name: '대전광역시',
    subItems: [
      { name: '용호천(금본G1)', code: '3008A55', isChecked: false },
      { name: '주원천', code: '3008A30', isChecked: false },
      { name: '금곡천', code: '3009A10', isChecked: false },
    ],
  },
  {
    name: '울산광역시',
    subItems: [
      { name: '덕현', code: '2201A03', isChecked: false },
      { name: '지헌', code: '2201A06', isChecked: false },
      { name: '신화', code: '2201A12', isChecked: false },
    ],
  },
  {
    name: '세종특별자치시',
    subItems: [
      { name: '조천1', code: '3011A85', isChecked: false },
      { name: '대교천1', code: '3012A15', isChecked: false },
    ],
  },
  {
    name: '경기도',
    subItems: [
      { name: '오갑천(청미A1-1)', code: '1007A01', isChecked: false },
      { name: '청미천1(청미A1)', code: '1007A03', isChecked: false },
      { name: '청미천3(청미A2)', code: '1007A11', isChecked: false },
    ],
  },
  {
    name: '강원도',
    subItems: [
      { name: '지촌천(북한B1)', code: '1010A33', isChecked: false },
      { name: '춘천1(북한B)', code: '1010A35', isChecked: false },
      { name: '만대천(인북A1)', code: '1011A05', isChecked: false },
    ],
  },
  {
    name: '충청북도',
    subItems: [
      { name: '금상천(초강A1)', code: '3005A25', isChecked: false },
      { name: '이원(금본E, 이원)', code: '3006A05', isChecked: false },
      { name: '대청(금본F)', code: '3008A52', isChecked: false },
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
      { name: '구량천(금본B1)', code: '3001A05', isChecked: false },
      { name: '정자천(금본B2)', code: '3001A30', isChecked: false },
      { name: '용담(금본B)', code: '3002A40', isChecked: false },
    ],
  },
  {
    name: '경상북도',
    subItems: [
      { name: '석포3', code: '2001A36', isChecked: false },
      { name: '석포4', code: '2001A37', isChecked: false },
    ],
  },
  {
    name: '경상남도',
    subItems: [
      { name: '가야천', code: '2013A20', isChecked: false },
      { name: '창녕(적포)', code: '2014A60', isChecked: false },
      { name: '월곡저수지', code: '2014D50', isChecked: false },
    ],
  },
  {
    name: '제주특별자치도',
    subItems: [
      { name: '옹포천', code: '6001A10', isChecked: false },
      { name: '외도천', code: '6002A10', isChecked: false },
      { name: '동홍천', code: '6003A10', isChecked: false },
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
