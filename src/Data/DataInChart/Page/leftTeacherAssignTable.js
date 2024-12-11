import { Typography } from '@mui/material';
import './leftSlidePage.scss';
import { useEffect, useState } from 'react';
import { customAxios } from '../../../Common/CustomAxios';
import CustomDataAdaptor from '../DataSet/CustomDataAdaptor';

import { useGraphDataStore } from '../store/graphStore';
import { convertToNumber } from '../store/utils/convertToNumber';
import { DataArray } from '@mui/icons-material';
import { useLocation, useParams } from 'react-router-dom';

//항목 이름 (한국어 -> 영어)
const engToKor = (name) => {
  const kor = {
    ITEMDATE: '측정일',

    //수질 데이터
    PTNM: '조사지점명',
    ITEMWMWK: '회차',
    ITEMWNDEP: '수심',
    ITEMTEMP: '수온',
    ITEMDO: '용존 산소',
    ITEMBOD: 'BOD',
    ITEMCOD: 'COD',
    ITEMSS: '부유물',
    ITEMTN: '총 질소',
    ITEMTP: '총인',
    ITEMTOC: '총유기탄소',

    //대기질 데이터
    stationName: '조사지점명',
    ITEMNO2: '산소 농도(ppm)',
    ITEMO3: '오존 농도(ppm)',
    ITEMPM10: '미세먼지(PM10) 농도(㎍/㎥)',
    ITEMPM25: '미세먼지(PM2.5) 농도(㎍/㎥)',
    ITEMSO2VALUE: '아황산가스 농도(ppm)',

    //시도별 대기질 데이터
    ITEMCODE: '변인',
    ITEMDATETIME: '측정 시간',
    ITEMDAEGU: '대구',
    ITEMCHUNGNAM: '충남',
    ITEMINCHEON: '인천',
    ITEMDAEJEON: '대전',
    ITEMGYONGBUK: '경북',
    ITEMSEJONG: '세종',
    ITEMGWANGJU: '광주',
    ITEMJEONBUK: '전북',
    ITEMGANGWON: '강원',
    ITEMULSAN: '울산',
    ITEMJEONNAM: '전남',
    ITEMSEOUL: '서울',
    ITEMBUSAN: '부산',
    ITEMJEJU: '제주',
    ITEMCHUNGBUK: '충북',
    ITEMGYEONGNAM: '경남',
    ITEMGYEONGGI: '경기',

    //SEED 데이터
    measuredDate: '측정 시간',
    location: '측정 장소',
    unit: '소속',
    period: '저장 주기',
    username: '사용자명',
    hum: '습도',
    temp: '기온',
    tur: '탁도',
    ph: 'pH',
    dust: '미세먼지',
    dox: '용존산소량',
    co2: '이산화탄소',
    lux: '조도',
    hum_EARTH: '토양 습도',
    pre: '기압',
  };
  return kor[name] || name;
};

export default function LeftTeacherAssignTable({ content, setDataCategory }) {
  const { setData, setTitle } = useGraphDataStore();

  //TODO 1 : content uuid 저장된 테이블 찾아서 가져온다음 아래 버튼에 넣어주고 클릭하면 setDataCategory 넣어서 되돌려주기
  //TODO 2 : 가져와서 Dataset 테이블에 맞는 형식으로 데이터 세팅해줘야함
  //TODO 3 : 그리고 Data store에 set 해주고 로컬 스토리지에다가도 넣어주기. 그러면 끝.
  //TODO 4 : 이거 다해서 잘 되는거 확인 후에 전체 배포를 위한 병합 수행하고 배포 한번 하기
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dataType = searchParams.get('dataType');
  const uuid = searchParams.get('uuid');

  console.log(dataType, uuid);
  const ClickTable = async () => {
    if (dataType === '커스텀 데이터') {
      customAxios
        .get(`api/custom/${uuid}`)
        .then((res) => {
          //수정 필요
          console.log(res.data.title);
          const title = res.data.title;
          let rows = 0;
          let columns = 0;
          const headerSet = new Set();
          res.data.numericFields.forEach((table) => {
            const key = Object.keys(table)[0];
            headerSet.add(key);
          });

          res.data.stringFields.forEach((table) => {
            const key = Object.keys(table)[0];
            headerSet.add(key);
          });

          columns = headerSet.size;
          rows =
            (res.data.numericFields.length + res.data.stringFields.length) /
            columns;
          const variables = Array(columns);

          const data = Array(rows + 1)
            .fill()
            .map(() => Array(columns).fill(0));

          res.data.numericFields.forEach((table) => {
            const key = Object.keys(table)[0];
            if (table[key].order < columns) {
              data[0][table[key].order] = key;
              variables[table[key].order] = {
                name: key,
                type: 'Numeric',
                isSelected: false,
                isMoreSelected: false,
                variableIndex: table[key].order,
              };
            }

            data[Math.floor(table[key].order / columns) + 1][
              table[key].order % columns
            ] = convertToNumber(table[key].value);
          });

          res.data.stringFields.forEach((table) => {
            const key = Object.keys(table)[0];
            if (table[key].order < columns) {
              data[0][table[key].order] = key;
              variables[table[key].order] = {
                name: key,
                type: 'Categorical',
                isSelected: false,
                isMoreSelected: false,
                variableIndex: table[key].order,
              };
            }
            data[Math.floor(table[key].order / columns) + 1][
              table[key].order % columns
            ] = convertToNumber(table[key].value);
          });
          console.log(data);
          setData(data, title, true, variables);

          // localStorage.setItem('data', JSON.stringify(data));
          // localStorage.setItem('title', JSON.stringify(title));
        })
        .catch((err) => console.log(err));
    } else {
      let path = '';
      if (dataType === '수질 데이터') {
        path = `/ocean-quality/mine/chunk?dataUUID=${uuid}`;
        customAxios
          .get(path)
          .then((res) => {
            // 남기고 싶은 키 목록
            const keysToKeep = [
              'PTNM',
              'ITEMDATE',
              'ITEMWMWK',
              'ITEMWNDEP',
              'ITEMBOD',
              'ITEMCOD',
              'ITEMDO',
              'ITEMSS',
              'ITEMTEMP',
              'ITEMTN',
              'ITEMTOC',
              'ITEMTP',
            ];

            // 변환 로직
            const transformedData = res.data[0].data.map((item) => {
              const newItem = {};
              keysToKeep.forEach((key) => {
                if (item[key] !== undefined) {
                  if (item[key] === null) return;
                  else if (isNaN(item[key])) newItem[key] = item[key];
                  else newItem[key] = convertToNumber(item[key]);
                } else {
                  newItem[key] = null; // 해당 키가 없으면 null로 설정
                }
              });
              return newItem;
            });
            console.log(transformedData);
            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];
            console.log(recombined);
            setData(recombined, res.data[0].title, true);
          })
          .catch((err) => console.log(err));
      } else if (dataType === '대기질 데이터') {
        path = `/air-quality/mine/chunk?dataUUID=${uuid}`;
        customAxios
          .get(path)
          .then((res) => {
            // 남기고 싶은 키 목록
            const keysToKeep = [
              'stationName',
              'ITEMDATE',
              'ITEMNO2',
              'ITEMO3',
              'ITEMPM10',
              'ITEMPM25',
              'ITEMSO2VALUE',
            ];
            console.log(res.data);
            // 변환 로직
            const transformedData = res.data.data.map((item) => {
              const newItem = {};
              keysToKeep.forEach((key) => {
                if (item[key] !== undefined) {
                  if (item[key] === null) return;
                  else if (isNaN(item[key])) newItem[key] = item[key];
                  else newItem[key] = convertToNumber(item[key]);
                } else {
                  newItem[key] = null; // 해당 키가 없으면 null로 설정
                }
              });
              return newItem;
            });
            console.log(transformedData);
            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];
            console.log(recombined);
            setData(recombined, res.data.title, true);
          })
          .catch((err) => console.log(err));
      } else if (dataType === '시도별 대기질 데이터') {
        path = `/city-air-quality/mine/chunk?dataUUID=${uuid}`;
        customAxios
          .get(path)
          .then((res) => {
            // 남기고 싶은 키 목록
            const keysToKeep = [
              'ITEMCODE',
              'ITEMDATETIME',
              'ITEMDAEGU',
              'ITEMCHUNGNAM',
              'ITEMINCHEON',
              'ITEMDAEJEON',
              'ITEMGYONGBUK',
              'ITEMSEJONG',
              'ITEMGWANGJU',
              'ITEMJEONBUK',
              'ITEMGANGWON',
              'ITEMULSAN',
              'ITEMJEONNAM',
              'ITEMSEOUL',
              'ITEMBUSAN',
              'ITEMJEJU',
              'ITEMCHUNGBUK',
              'ITEMGYEONGNAM',
              'ITEMGYEONGGI',
            ];
            console.log(res.data);
            // 변환 로직
            const transformedData = res.data.data.map((item) => {
              const newItem = {};
              keysToKeep.forEach((key) => {
                if (item[key] === null) return;
                else if (item[key] !== undefined) {
                  newItem[key] = convertToNumber(item[key]);
                } else {
                  newItem[key] = null; // 해당 키가 없으면 null로 설정
                }
              });
              return newItem;
            });
            console.log(transformedData);
            let headers = Object.keys(transformedData[0]);

            headers = headers.map((header) => engToKor(header));

            const datas = transformedData.map((item) => Object.values(item));
            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...datas];
            console.log(recombined);
            setData(recombined, res.data.title, true);
          })
          .catch((err) => console.log(err));
      } else if (dataType === 'SEED') {
        path = `/seed/mine/chunk?dataUUID=${uuid}`;
      } else if (dataType === '데이터없음') {
        console.log('데이터 없음');
        return;
      }
    }

    // localStorage.setItem('data', JSON.stringify(data));
    // localStorage.setItem('title', JSON.stringify(title));

    setDataCategory('ExpertData');
  };

  return (
    <div style={{ margin: '0 5rem 0 3rem' }}>
      <div>
        <Typography
          sx={{
            fontSize: '3vh',
            color: 'black',
          }}
        >
          스텝 테이블
        </Typography>
      </div>
      <div style={{ height: '10vh', width: '20vh' }}>
        <div style={{ marginTop: '1rem' }} className="flex">
          <img
            src="/assets/img/folder-icon.png"
            style={{ width: '1.5rem', margin: '0 0.5rem' }}
          />
          <label
            onClick={() => ClickTable()}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            스텝 데이터
          </label>
        </div>
      </div>

      <div></div>
    </div>
  );
}
